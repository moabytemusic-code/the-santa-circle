import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { Priority } from "@prisma/client";
import { tagAmazonUrl } from "@/lib/affiliate";

// POST add a new wish list item
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { exchangeId, title, description, url, price, priority = "MEDIUM" } = await req.json();

    if (!exchangeId || !title) {
      return NextResponse.json({ error: "Exchange ID and title are required." }, { status: 400 });
    }

    // Ensure wishList exists for this user & exchange
    let wishList = await prisma.wishList.findUnique({
      where: {
        exchangeId_userId: { exchangeId, userId: session.id },
      },
    });

    if (!wishList) {
      wishList = await prisma.wishList.create({
        data: {
          exchangeId,
          userId: session.id,
        },
      });
    }

    const item = await prisma.wishListItem.create({
      data: {
        wishListId: wishList.id,
        title: title.trim(),
        description: description?.trim(),
        url: url ? tagAmazonUrl(url) : null,
        price: price ? parseFloat(price) : null,
        priority: priority as Priority,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    console.error("[Add Wishlist Item Error]:", err);
    return NextResponse.json({ error: "Failed to add wish list item." }, { status: 500 });
  }
}

// DELETE a wish list item
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("id");

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
    }

    // Ensure item belongs to logged-in user's wish list
    const item = await prisma.wishListItem.findUnique({
      where: { id: itemId },
      include: { wishList: true },
    });

    if (!item || item.wishList.userId !== session.id) {
      return NextResponse.json({ error: "Unauthorized or item not found." }, { status: 403 });
    }

    await prisma.wishListItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[Delete Wishlist Item Error]:", err);
    return NextResponse.json({ error: "Failed to delete item." }, { status: 500 });
  }
}
