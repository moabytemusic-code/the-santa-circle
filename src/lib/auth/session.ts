import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

const COOKIE_NAME = "christmas_session";
const SESSION_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "default-christmas-dev-secret-change-in-production-min-32-chars";
  return new TextEncoder().encode(secret);
}

/**
 * Sign a JWT session token
 */
export async function signSession(user: SessionUser): Promise<string> {
  const secret = getAuthSecret();
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRY}s`)
    .sign(secret);
}

/**
 * Verify and decode a JWT session token
 */
export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const secret = getAuthSecret();
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

/**
 * Set the session cookie on the response
 */
export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = await signSession(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_EXPIRY,
    path: "/",
  });
}

/**
 * Get current session user from cookies
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (!cookie?.value) return null;
    return await verifySession(cookie.value);
  } catch {
    return null;
  }
}

/**
 * Clear the session cookie (Log out)
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
