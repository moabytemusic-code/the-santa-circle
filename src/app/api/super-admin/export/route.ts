import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdminSession } from "@/lib/auth/super-admin";

function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(req: Request) {
  const session = await requireSuperAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "master";
  const themeFilter = searchParams.get("theme");

  const timestamp = new Date().toISOString().split("T")[0];

  try {
    let csvRows: string[] = [];
    let filename = `santa-circle-${type}-${timestamp}.csv`;

    if (type === "users") {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          createdGroups: { select: { id: true } },
          memberships: { select: { id: true } },
        },
      });

      csvRows.push("User_ID,Name,Email,Role,Circles_Hosted,Circles_Joined,Joined_Date");
      users.forEach((u) => {
        csvRows.push(
          [
            escapeCsvValue(u.id),
            escapeCsvValue(u.name),
            escapeCsvValue(u.email),
            escapeCsvValue(u.role),
            escapeCsvValue(u.createdGroups.length),
            escapeCsvValue(u.memberships.length),
            escapeCsvValue(u.createdAt.toISOString()),
          ].join(",")
        );
      });
    } else if (type === "invitations") {
      const invitations = await prisma.invitation.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          familyGroup: { select: { name: true, culturalTheme: true } },
          creator: { select: { name: true, email: true } },
        },
      });

      csvRows.push(
        "Invitation_ID,Guest_Email,Circle_Name,Cultural_Theme,Invited_By,Status,Created_At,Expires_At"
      );
      invitations.forEach((inv) => {
        if (themeFilter && inv.familyGroup.culturalTheme !== themeFilter) return;
        csvRows.push(
          [
            escapeCsvValue(inv.id),
            escapeCsvValue(inv.email),
            escapeCsvValue(inv.familyGroup.name),
            escapeCsvValue(inv.familyGroup.culturalTheme || "CLASSIC"),
            escapeCsvValue(inv.creator?.name || inv.creator?.email || "Unknown"),
            escapeCsvValue(inv.status),
            escapeCsvValue(inv.createdAt.toISOString()),
            escapeCsvValue(inv.expiresAt.toISOString()),
          ].join(",")
        );
      });
    } else if (type === "leads") {
      const leads = await prisma.leadSubscriber.findMany({
        orderBy: { createdAt: "desc" },
      });

      csvRows.push("Subscriber_ID,Email,Name,Source,Cultural_Theme,Subscribed_Date");
      leads.forEach((l) => {
        if (themeFilter && l.culturalTheme !== themeFilter) return;
        csvRows.push(
          [
            escapeCsvValue(l.id),
            escapeCsvValue(l.email),
            escapeCsvValue(l.name || ""),
            escapeCsvValue(l.source),
            escapeCsvValue(l.culturalTheme),
            escapeCsvValue(l.createdAt.toISOString()),
          ].join(",")
        );
      });
    } else {
      // MASTER DEDUPLICATED LIST
      const emailMap = new Map<
        string,
        { email: string; name: string; source: string; culturalTheme: string; date: string }
      >();

      // 1. Registered Users
      const users = await prisma.user.findMany({
        select: { email: true, name: true, createdAt: true },
      });
      users.forEach((u) => {
        const clean = u.email.trim().toLowerCase();
        emailMap.set(clean, {
          email: clean,
          name: u.name,
          source: "REGISTERED_USER",
          culturalTheme: "PLATFORM_USER",
          date: u.createdAt.toISOString(),
        });
      });

      // 2. Lead Subscribers
      const leads = await prisma.leadSubscriber.findMany({
        select: { email: true, name: true, source: true, culturalTheme: true, createdAt: true },
      });
      leads.forEach((l) => {
        const clean = l.email.trim().toLowerCase();
        if (!emailMap.has(clean)) {
          emailMap.set(clean, {
            email: clean,
            name: l.name || "",
            source: l.source,
            culturalTheme: l.culturalTheme,
            date: l.createdAt.toISOString(),
          });
        }
      });

      // 3. Invited Guests
      const invitations = await prisma.invitation.findMany({
        select: { email: true, createdAt: true, familyGroup: { select: { culturalTheme: true } } },
      });
      invitations.forEach((inv) => {
        const clean = inv.email.trim().toLowerCase();
        if (!emailMap.has(clean)) {
          emailMap.set(clean, {
            email: clean,
            name: "",
            source: "INVITED_GUEST",
            culturalTheme: inv.familyGroup?.culturalTheme || "CLASSIC",
            date: inv.createdAt.toISOString(),
          });
        }
      });

      csvRows.push("Email,Name,Source_Category,Cultural_Theme,Added_Date");
      emailMap.forEach((entry) => {
        if (themeFilter && entry.culturalTheme !== themeFilter) return;
        csvRows.push(
          [
            escapeCsvValue(entry.email),
            escapeCsvValue(entry.name),
            escapeCsvValue(entry.source),
            escapeCsvValue(entry.culturalTheme),
            escapeCsvValue(entry.date),
          ].join(",")
        );
      });
      filename = `santa-circle-master-leads-${timestamp}.csv`;
    }

    const csvContent = csvRows.join("\r\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache",
      },
    });
  } catch (error: unknown) {
    console.error("[SuperAdmin Export GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to generate CSV export." },
      { status: 500 }
    );
  }
}
