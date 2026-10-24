import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Token is required." }, { status: 400 });
    }

    const invite = await prisma.invitation.findUnique({
      where: { token },
      include: { familyGroup: true },
    });

    if (!invite || invite.status !== "PENDING" || new Date() > invite.expiresAt) {
      return NextResponse.json({ error: "Invitation is invalid or has expired." }, { status: 400 });
    }

    // Add membership
    await prisma.familyMembership.upsert({
      where: {
        familyGroupId_userId: {
          familyGroupId: invite.familyGroupId,
          userId: session.id,
        },
      },
      update: {},
      create: {
        familyGroupId: invite.familyGroupId,
        userId: session.id,
        role: invite.role,
      },
    });

    // Mark invitation accepted
    await prisma.invitation.update({
      where: { id: invite.id },
      data: { status: "ACCEPTED" },
    });

    // Automatically add to ongoing exchanges in this family
    const activeExchanges = await prisma.giftExchange.findMany({
      where: {
        familyGroupId: invite.familyGroupId,
        status: { in: ["DRAFT", "CONFIRMING", "READY_TO_DRAW"] },
      },
    });

    for (const ex of activeExchanges) {
      await prisma.exchangeParticipant.upsert({
        where: {
          exchangeId_userId: {
            exchangeId: ex.id,
            userId: session.id,
          },
        },
        update: {},
        create: {
          exchangeId: ex.id,
          userId: session.id,
          status: "CONFIRMED",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `You have successfully joined ${invite.familyGroup.name}!`,
    });
  } catch (err: unknown) {
    console.error("[Accept Invite Error]:", err);
    return NextResponse.json({ error: "Failed to accept invitation." }, { status: 500 });
  }
}
