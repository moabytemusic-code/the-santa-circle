import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdminSession } from "@/lib/auth/super-admin";

export async function GET() {
  const session = await requireSuperAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            memberships: true,
            createdGroups: true,
            participations: true,
            wishLists: true,
          },
        },
        memberships: {
          include: {
            familyGroup: { select: { id: true, name: true } },
          },
        },
      },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      membershipsCount: u._count.memberships,
      createdGroupsCount: u._count.createdGroups,
      participationsCount: u._count.participations,
      wishListsCount: u._count.wishLists,
      circles: u.memberships.map((m) => ({
        id: m.familyGroup.id,
        name: m.familyGroup.name,
        role: m.role,
      })),
    }));

    return NextResponse.json({ success: true, users: formatted });
  } catch (error: unknown) {
    console.error("[SuperAdmin Users GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch users." },
      { status: 500 }
    );
  }
}
