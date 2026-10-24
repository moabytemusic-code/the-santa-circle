import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSecureToken } from "@/lib/auth/tokens";
import { sendPasswordResetEmail } from "@/lib/email/brevo";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // To prevent email enumeration attacks, return success even if user not found
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Generate secure token valid for 2 hours
    const token = generateSecureToken(32);
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    await sendPasswordResetEmail({
      toEmail: user.email,
      toName: user.name,
      resetToken: token,
      appUrl,
    });

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (err: unknown) {
    console.error("[Forgot Password Error]:", err);
    return NextResponse.json({ error: "Could not process request." }, { status: 500 });
  }
}
