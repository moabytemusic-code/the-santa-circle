import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdminSession } from "@/lib/auth/super-admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSuperAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const { name, isPremium } = body;

    const circle = await prisma.familyGroup.findUnique({
      where: { id },
      include: { exchanges: { orderBy: { createdAt: "desc" } } },
    });

    if (!circle) {
      return NextResponse.json({ error: "Circle not found." }, { status: 404 });
    }

    if (name && typeof name === "string") {
      await prisma.familyGroup.update({
        where: { id },
        data: { name: name.trim() },
      });
    }

    if (typeof isPremium === "boolean") {
      await prisma.giftExchange.updateMany({
        where: { familyGroupId: id },
        data: { isPremium },
      });
    }

    return NextResponse.json({ success: true, message: "Circle updated successfully." });
  } catch (error: unknown) {
    console.error("[SuperAdmin Circle PATCH Error]:", error);
    return NextResponse.json(
      { error: "Failed to update circle." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSuperAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const circle = await prisma.familyGroup.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!circle) {
      return NextResponse.json({ error: "Circle not found." }, { status: 404 });
    }

    await prisma.familyGroup.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Circle "${circle.name}" deleted successfully.`,
    });
  } catch (error: unknown) {
    console.error("[SuperAdmin Circle DELETE Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete circle." },
      { status: 500 }
    );
  }
}
