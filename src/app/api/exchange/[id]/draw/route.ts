import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { executeExchangeDrawing } from "@/lib/engine/drawing";
import { prisma } from "@/lib/db";
import { sendDrawingReadyEmail } from "@/lib/email/brevo";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: exchangeId } = await params;

    // Execute drawing inside database transaction
    const result = await executeExchangeDrawing(exchangeId, session.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Drawing succeeded! Now trigger notifications asynchronously.
    // Notice: Even if email sending fails, the drawing is already atomically committed and preserved!
    const exchange = await prisma.giftExchange.findUnique({
      where: { id: exchangeId },
      include: {
        participants: {
          where: { status: "CONFIRMED" },
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (exchange) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      // Dispatch emails in parallel without exposing recipient names
      for (const p of exchange.participants) {
        sendDrawingReadyEmail({
          toEmail: p.user.email,
          toName: p.user.name,
          exchangeName: exchange.name,
          exchangeYear: exchange.year,
          appUrl,
        })
          .then((emailRes) => {
            return prisma.exchangeNotification.updateMany({
              where: { exchangeId, userId: p.user.id, type: "DRAWING_READY" },
              data: {
                status: emailRes.success ? "SENT" : "FAILED",
                error: emailRes.error || null,
                sentAt: emailRes.success ? new Date() : null,
              },
            });
          })
          .catch((err) => {
            console.error(`[Email Notify Error] User ${p.user.id}:`, err);
          });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Names drawn successfully! ${result.count} Secret Santa assignments created.`,
      count: result.count,
    });
  } catch (err: unknown) {
    console.error("[Draw Route Error]:", err);
    return NextResponse.json({ error: "Drawing failed to execute." }, { status: 500 });
  }
}
