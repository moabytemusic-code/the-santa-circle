import { getSession } from "./session";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

const DEFAULT_SUPER_ADMINS = [
  "kentjigga@gmail.com",
  "admin@thesantacircle.com",
];

export function getSuperAdminEmails(): string[] {
  const envEmail = process.env.SUPER_ADMIN_EMAIL?.toLowerCase().trim();
  const list = [...DEFAULT_SUPER_ADMINS];
  if (envEmail && !list.includes(envEmail)) {
    list.push(envEmail);
  }
  return list;
}

export function isSuperAdmin(user: { email?: string; role?: Role | string } | null | undefined): boolean {
  if (!user || !user.email) return false;
  if (user.role === "ADMIN") return true;
  const adminEmails = getSuperAdminEmails();
  return adminEmails.includes(user.email.toLowerCase().trim());
}

export async function requireSuperAdminSession() {
  const session = await getSession();
  if (!session || !isSuperAdmin(session)) {
    return null;
  }

  // Ensure DB role is also ADMIN for consistency
  if (session.role !== "ADMIN") {
    try {
      await prisma.user.update({
        where: { id: session.id },
        data: { role: "ADMIN" },
      });
      session.role = "ADMIN";
    } catch {
      // Ignore if concurrent or db issue
    }
  }

  return session;
}
