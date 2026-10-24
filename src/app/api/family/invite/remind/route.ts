import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { generateSecureToken } from "@/lib/auth/tokens";
import { sendFollowUpInvitationEmail } from "@/lib/email/brevo";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { familyGroupId, invitationId } = await req.json();

    if (!familyGroupId && !invitationId) {
      return NextResponse.json({ error: "Either familyGroupId or invitationId is required." }, { status: 400 });
    }

    // Determine query
    let whereClause: { status: "PENDING"; id?: string; familyGroupId?: string } = {
      status: "PENDING",
    };

    if (invitationId) {
      whereClause = { ...whereClause, id: invitationId };
    } else if (familyGroupId) {
      whereClause = { ...whereClause, familyGroupId };
    }

    const pendingInvites = await prisma.invitation.findMany({
      where: whereClause,
      include: {
        familyGroup: {
          select: { id: true, name: true },
        },
      },
    });

    if (pendingInvites.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending invitations found to remind.",
        count: 0,
      });
    }

    // Resolve appUrl from request headers or env
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (host ? `${proto}://${host}` : "https://thesantacircle.com");

    const results = [];
    const now = new Date();

    for (const inv of pendingInvites) {
      let activeToken = inv.token;

      // If token expired, renew it with fresh 7-day expiration
      if (inv.expiresAt <= now) {
        activeToken = generateSecureToken(32);
        const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await prisma.invitation.update({
          where: { id: inv.id },
          data: {
            token: activeToken,
            expiresAt: newExpiresAt,
          },
        });
      }

      const emailRes = await sendFollowUpInvitationEmail({
        toEmail: inv.email,
        inviterName: session.name,
        familyGroupName: inv.familyGroup.name,
        inviteToken: activeToken,
        appUrl,
      });

      results.push({
        email: inv.email,
        inviteUrl: `${appUrl}/invite/${activeToken}`,
        delivered: emailRes.success,
        error: emailRes.error,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Follow-up reminders sent to ${results.length} pending member(s).`,
      count: results.length,
      results,
    });
  } catch (err: unknown) {
    console.error("[Reminder API Error]:", err);
    return NextResponse.json({ error: "Failed to send follow-up reminders." }, { status: 500 });
  }
}
