import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

// GET exclusions for exchange
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: exchangeId } = await params;

    const exclusions = await prisma.exclusionRule.findMany({
      where: { exchangeId },
      include: {
        userA: { select: { id: true, name: true, email: true } },
        userB: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ exclusions });
  } catch (err: unknown) {
    console.error("[Get Exclusions Error]:", err);
    return NextResponse.json({ error: "Failed to load exclusions." }, { status: 500 });
  }
}

// POST new exclusion
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: exchangeId } = await params;
    const { userAId, userBId, reason } = await req.json();

    if (!userAId || !userBId) {
      return NextResponse.json({ error: "Both participants are required." }, { status: 400 });
    }

    if (userAId === userBId) {
      return NextResponse.json({ error: "A participant cannot be excluded from drawing themselves (that is always forbidden by default)." }, { status: 400 });
    }

    // Check exchange status
    const exchange = await prisma.giftExchange.findUnique({
      where: { id: exchangeId },
    });

    if (!exchange || exchange.status === "DRAWN" || exchange.status === "COMPLETED") {
      return NextResponse.json({ error: "Cannot modify exclusions after drawing has taken place." }, { status: 400 });
    }

    // Check if rule already exists in either direction
    const existing = await prisma.exclusionRule.findFirst({
      where: {
        exchangeId,
        OR: [
          { userAId, userBId },
          { userAId: userBId, userBId: userAId },
        ],
      },
    });

    const cleanReason = typeof reason === "string" && reason.trim() ? reason.trim() : "Spouse / Partner";

    let rule;
    if (existing) {
      rule = await prisma.exclusionRule.update({
        where: { id: existing.id },
        data: { reason: cleanReason },
        include: {
          userA: { select: { id: true, name: true, email: true } },
          userB: { select: { id: true, name: true, email: true } },
        },
      });
    } else {
      rule = await prisma.exclusionRule.create({
        data: {
          exchangeId,
          userAId,
          userBId,
          reason: cleanReason,
        },
        include: {
          userA: { select: { id: true, name: true, email: true } },
          userB: { select: { id: true, name: true, email: true } },
        },
      });
    }

    return NextResponse.json({ success: true, rule });
  } catch (err: unknown) {
    console.error("[Create Exclusion Error]:", err);
    return NextResponse.json({ error: "Failed to create exclusion rule." }, { status: 500 });
  }
}

// DELETE exclusion rule
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: exchangeId } = await params;
    const { searchParams } = new URL(req.url);
    const ruleId = searchParams.get("ruleId");

    if (!ruleId) {
      return NextResponse.json({ error: "Rule ID is required." }, { status: 400 });
    }

    const exchange = await prisma.giftExchange.findUnique({
      where: { id: exchangeId },
    });

    if (exchange?.status === "DRAWN" || exchange?.status === "COMPLETED") {
      return NextResponse.json({ error: "Cannot modify exclusions after drawing has taken place." }, { status: 400 });
    }

    await prisma.exclusionRule.delete({
      where: { id: ruleId },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[Delete Exclusion Error]:", err);
    return NextResponse.json({ error: "Failed to delete exclusion." }, { status: 500 });
  }
}
