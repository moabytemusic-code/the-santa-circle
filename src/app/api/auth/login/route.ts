import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const passwordMatch = await verifyPassword(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    let userRole = user.role;
    const adminEmails = [
      process.env.SUPER_ADMIN_EMAIL?.toLowerCase().trim(),
      "kentjigga@gmail.com",
      "admin@thesantacircle.com",
    ].filter(Boolean);

    if (adminEmails.includes(cleanEmail) && userRole !== "ADMIN") {
      userRole = "ADMIN";
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "ADMIN" },
      });
    }

    await setSessionCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      role: userRole,
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: userRole },
    });
  } catch (err: unknown) {
    console.error("[Login API Error]:", err);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
