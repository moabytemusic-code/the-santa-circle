import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { resetExchangeDrawing } from "@/lib/engine/drawing";

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
    const { confirmationText } = await req.json();

    const result = await resetExchangeDrawing(exchangeId, session.id, confirmationText);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Exchange assignments have been safely reset. You can now adjust exclusions or participants and draw again.",
    });
  } catch (err: unknown) {
    console.error("[Reset Exchange Error]:", err);
    return NextResponse.json({ error: "Failed to reset exchange." }, { status: 500 });
  }
}
