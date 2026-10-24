import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdminSession } from "@/lib/auth/super-admin";

export async function GET() {
  const session = await requireSuperAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const [
      totalUsers,
      totalCircles,
      totalExchanges,
      totalPaidPasses,
      recentUsers,
      recentCirclesRaw,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.familyGroup.count(),
      prisma.giftExchange.count(),
      prisma.giftExchange.count({ where: { isPremium: true } }),
      prisma.user.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { memberships: true, createdGroups: true } },
        },
      }),
      prisma.familyGroup.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          creator: { select: { id: true, name: true, email: true } },
          _count: { select: { memberships: true, exchanges: true } },
          exchanges: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { id: true, year: true, status: true, isPremium: true },
          },
        },
      }),
    ]);

    const recentCircles = recentCirclesRaw.map((circle) => ({
      id: circle.id,
      name: circle.name,
      createdAt: circle.createdAt,
      creator: circle.creator,
      memberCount: circle._count.memberships,
      latestExchange: circle.exchanges[0] || null,
      isPremium: circle.exchanges[0]?.isPremium || false,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalCircles,
        totalExchanges,
        totalPaidPasses,
        totalRevenue: Number((totalPaidPasses * 7.99).toFixed(2)),
      },
      recentUsers,
      recentCircles,
    });
  } catch (error: unknown) {
    console.error("[SuperAdmin Overview Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch super admin overview data." },
      { status: 500 }
    );
  }
}
