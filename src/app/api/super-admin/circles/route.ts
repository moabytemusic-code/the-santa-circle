import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdminSession } from "@/lib/auth/super-admin";

export async function GET() {
  const session = await requireSuperAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const circles = await prisma.familyGroup.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        memberships: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        exchanges: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            year: true,
            status: true,
            budget: true,
            isPremium: true,
            stripeSessionId: true,
            _count: { select: { participants: true, assignments: true } },
          },
        },
      },
    });

    const formatted = circles.map((circle) => {
      const activeExchange = circle.exchanges[0] || null;
      return {
        id: circle.id,
        name: circle.name,
        description: circle.description,
        createdAt: circle.createdAt,
        creator: circle.creator,
        membersCount: circle.memberships.length,
        members: circle.memberships.map((m) => m.user),
        exchangeId: activeExchange?.id || null,
        exchangeYear: activeExchange?.year || new Date().getFullYear(),
        exchangeStatus: activeExchange?.status || "DRAFT",
        budget: activeExchange?.budget ? Number(activeExchange.budget) : null,
        isPremium: activeExchange?.isPremium || false,
        participantsCount: activeExchange?._count.participants || 0,
        drawnAssignmentsCount: activeExchange?._count.assignments || 0,
      };
    });

    return NextResponse.json({ success: true, circles: formatted });
  } catch (error: unknown) {
    console.error("[SuperAdmin Circles GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch circles." },
      { status: 500 }
    );
  }
}
