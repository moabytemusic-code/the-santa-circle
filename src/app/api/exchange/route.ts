import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

// GET /api/exchange - List user's active & historical exchanges
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const memberships = await prisma.familyMembership.findMany({
      where: { userId: session.id },
      select: { familyGroupId: true, role: true },
    });

    const groupIds = memberships.map((m) => m.familyGroupId);

    const exchanges = await prisma.giftExchange.findMany({
      where: {
        familyGroupId: { in: groupIds },
      },
      include: {
        familyGroup: {
          select: { id: true, name: true },
        },
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
        },
        exclusions: {
          include: {
            userA: { select: { id: true, name: true } },
            userB: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { year: "desc" },
    });

    return NextResponse.json({ exchanges });
  } catch (err: unknown) {
    console.error("[Get Exchanges Error]:", err);
    return NextResponse.json({ error: "Failed to load exchanges." }, { status: 500 });
  }
}

// POST /api/exchange - Create a new exchange (Admin only)
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      familyGroupId,
      name,
      year,
      budget,
      currency = "USD",
      exchangeDate,
      drawDate,
      participationDeadline,
      location,
      instructions,
    } = await req.json();

    if (!familyGroupId || !name || !year || !budget || !exchangeDate) {
      return NextResponse.json({ error: "Family group, name, year, budget, and exchange date are required." }, { status: 400 });
    }

    // Check admin permission
    const membership = await prisma.familyMembership.findUnique({
      where: {
        familyGroupId_userId: { familyGroupId, userId: session.id },
      },
    });

    if (!membership || (membership.role !== "ADMIN" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Only family administrators can create exchanges." }, { status: 403 });
    }

    // Check year uniqueness for this family
    const existingYear = await prisma.giftExchange.findUnique({
      where: {
        familyGroupId_year: {
          familyGroupId,
          year: parseInt(year, 10),
        },
      },
    });

    if (existingYear) {
      return NextResponse.json({ error: `An exchange for the year ${year} already exists in this family.` }, { status: 409 });
    }

    // Create exchange
    const exchange = await prisma.giftExchange.create({
      data: {
        familyGroupId,
        name: name.trim(),
        year: parseInt(year, 10),
        budget: parseFloat(budget),
        currency: currency.toUpperCase(),
        exchangeDate: new Date(exchangeDate),
        drawDate: drawDate ? new Date(drawDate) : null,
        participationDeadline: participationDeadline ? new Date(participationDeadline) : null,
        location: location?.trim(),
        instructions: instructions?.trim(),
        status: "CONFIRMING",
        createdById: session.id,
      },
    });

    // Automatically add all current family members as invited participants
    const familyMembers = await prisma.familyMembership.findMany({
      where: { familyGroupId },
    });

    await prisma.exchangeParticipant.createMany({
      data: familyMembers.map((m) => ({
        exchangeId: exchange.id,
        userId: m.userId,
        status: m.userId === session.id ? "CONFIRMED" : "INVITED",
        confirmedAt: m.userId === session.id ? new Date() : null,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true, exchange });
  } catch (err: unknown) {
    console.error("[Create Exchange Error]:", err);
    return NextResponse.json({ error: "Failed to create exchange." }, { status: 500 });
  }
}

// PATCH /api/exchange - Confirm or decline participation
export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { exchangeId, status } = await req.json();
    if (!exchangeId || !["CONFIRMED", "DECLINED"].includes(status)) {
      return NextResponse.json({ error: "Valid exchange ID and status (CONFIRMED/DECLINED) required." }, { status: 400 });
    }

    const exchange = await prisma.giftExchange.findUnique({
      where: { id: exchangeId },
    });

    if (!exchange) {
      return NextResponse.json({ error: "Exchange not found." }, { status: 404 });
    }

    if (exchange.status === "DRAWN" || exchange.status === "COMPLETED") {
      return NextResponse.json({ error: "Cannot change participation after names have been drawn." }, { status: 400 });
    }

    const updated = await prisma.exchangeParticipant.upsert({
      where: {
        exchangeId_userId: { exchangeId, userId: session.id },
      },
      update: {
        status,
        confirmedAt: status === "CONFIRMED" ? new Date() : null,
      },
      create: {
        exchangeId,
        userId: session.id,
        status,
        confirmedAt: status === "CONFIRMED" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, participant: updated });
  } catch (err: unknown) {
    console.error("[Update Participation Error]:", err);
    return NextResponse.json({ error: "Failed to update participation." }, { status: 500 });
  }
}

// PUT /api/exchange - Edit exchange details (Admin only)
export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      exchangeId,
      name,
      budget,
      currency = "USD",
      exchangeDate,
      location,
      instructions,
    } = await req.json();

    if (!exchangeId || !name || !budget || !exchangeDate) {
      return NextResponse.json({ error: "Exchange ID, name, budget, and date are required." }, { status: 400 });
    }

    const exchange = await prisma.giftExchange.findUnique({
      where: { id: exchangeId },
      include: {
        familyGroup: {
          include: {
            memberships: {
              where: { userId: session.id },
            },
          },
        },
      },
    });

    if (!exchange) {
      return NextResponse.json({ error: "Exchange not found." }, { status: 404 });
    }

    const membership = exchange.familyGroup.memberships[0];
    const isCreator = exchange.createdById === session.id;
    const isAdmin = (membership && membership.role === "ADMIN") || session.role === "ADMIN";

    if (!isAdmin && !isCreator) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const updated = await prisma.giftExchange.update({
      where: { id: exchangeId },
      data: {
        name: name.trim(),
        budget: parseFloat(budget),
        currency: currency.toUpperCase(),
        exchangeDate: new Date(exchangeDate),
        location: location?.trim() || null,
        instructions: instructions?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, exchange: updated });
  } catch (err: unknown) {
    console.error("[Edit Exchange Error]:", err);
    return NextResponse.json({ error: "Failed to update exchange." }, { status: 500 });
  }
}
