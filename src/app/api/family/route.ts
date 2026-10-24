import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get family groups user belongs to
    const memberships = await prisma.familyMembership.findMany({
      where: { userId: session.id },
      include: {
        familyGroup: {
          include: {
            memberships: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, role: true, avatarUrl: true },
                },
              },
            },
            exchanges: {
              orderBy: { year: "desc" },
              include: {
                participants: {
                  include: {
                    user: { select: { id: true, name: true, email: true } },
                  },
                },
                exclusions: {
                  include: {
                    userA: { select: { id: true, name: true, email: true } },
                    userB: { select: { id: true, name: true, email: true } },
                  },
                },
              },
            },
            invitations: {
              where: { status: "PENDING" },
              select: { id: true, email: true, status: true, token: true, expiresAt: true, createdAt: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      memberships,
    });
  } catch (err: unknown) {
    console.error("[Family API Error]:", err);
    return NextResponse.json({ error: "Failed to load family data." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Group name is required." }, { status: 400 });
    }

    const group = await prisma.familyGroup.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        createdById: session.id,
        memberships: {
          create: {
            userId: session.id,
            role: "ADMIN",
          },
        },
      },
    });

    return NextResponse.json({ success: true, group });
  } catch (err: unknown) {
    console.error("[Create Family Error]:", err);
    return NextResponse.json({ error: "Failed to create family group." }, { status: 500 });
  }
}
