import crypto from "crypto";

/**
 * Generate a cryptographically secure random token (hex string)
 */
export function generateSecureToken(byteLength: number = 32): string {
  return crypto.randomBytes(byteLength).toString("hex");
}

/**
 * Compute SHA-256 hash of a token for secure storage
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
