import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, email, password, inviteToken, circleName } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists. Please log in." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    // If joining via invite, default role is USER. If creating a new circle, role is ADMIN.
    const isNewCircleHost = !inviteToken;
    const role: Role = isNewCircleHost ? Role.ADMIN : Role.USER;

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role,
      },
    });

    // Handle invite token if provided
    if (inviteToken) {
      const invite = await prisma.invitation.findUnique({
        where: { token: inviteToken },
        include: { familyGroup: true },
      });

      if (invite && invite.status === "PENDING" && new Date() < invite.expiresAt) {
        await prisma.familyMembership.create({
          data: {
            familyGroupId: invite.familyGroupId,
            userId: user.id,
            role: invite.role,
          },
        });

        await prisma.invitation.update({
          where: { id: invite.id },
          data: { status: "ACCEPTED" },
        });

        // Also add them as participant in active draft/confirming exchanges in this family
        const activeExchanges = await prisma.giftExchange.findMany({
          where: {
            familyGroupId: invite.familyGroupId,
            status: { in: ["DRAFT", "CONFIRMING", "READY_TO_DRAW"] },
          },
        });

        for (const ex of activeExchanges) {
          await prisma.exchangeParticipant.upsert({
            where: {
              exchangeId_userId: { exchangeId: ex.id, userId: user.id },
            },
            update: {},
            create: {
              exchangeId: ex.id,
              userId: user.id,
              status: "CONFIRMED",
            },
          });
        }
      }
    } else {
      // Self-service Circle Creation:
      // Create a new Circle and active exchange for this new host
      const currentYear = new Date().getFullYear();
      const circleTitle = circleName?.trim() || `${name.trim()}'s Circle`;

      const newGroup = await prisma.familyGroup.create({
        data: {
          name: circleTitle,
          description: "Secret Santa gift exchange circle",
          createdById: user.id,
        },
      });

      await prisma.familyMembership.create({
        data: {
          familyGroupId: newGroup.id,
          userId: user.id,
          role: "ADMIN",
        },
      });

      const exchange = await prisma.giftExchange.create({
        data: {
          familyGroupId: newGroup.id,
          name: `${circleTitle} ${currentYear}`,
          year: currentYear,
          budget: 50.0,
          currency: "USD",
          exchangeDate: new Date(`${currentYear}-12-25T00:00:00.000Z`),
          createdById: user.id,
          status: "DRAFT",
        },
      });

      await prisma.exchangeParticipant.create({
        data: {
          exchangeId: exchange.id,
          userId: user.id,
          status: "CONFIRMED",
        },
      });
    }

    // Set authenticated session cookie
    await setSessionCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      redirect: isNewCircleHost ? "/admin" : "/dashboard",
    });
  } catch (err: unknown) {
    console.error("[Register API Error]:", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
