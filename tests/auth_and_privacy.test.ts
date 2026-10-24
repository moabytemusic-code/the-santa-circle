import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { signSession, verifySession } from "@/lib/auth/session";
import { validateAudioBuffer } from "@/lib/music/storage";
import { Role } from "@prisma/client";

describe("Authentication & Security", () => {
  it("should securely hash and verify passwords using bcrypt", async () => {
    const password = "SuperSecretChristmasPassword!2026";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true);

    const isMatch = await verifyPassword(password, hash);
    expect(isMatch).toBe(true);

    const isWrong = await verifyPassword("WrongPassword123", hash);
    expect(isWrong).toBe(false);
  });

  it("should create, sign and verify JWT session tokens", async () => {
    const user = {
      id: "user-123",
      email: "santa@northpole.com",
      name: "Santa Claus",
      role: Role.ADMIN,
    };

    const token = await signSession(user);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);

    const verified = await verifySession(token);
    expect(verified).not.toBeNull();
    expect(verified?.id).toBe(user.id);
    expect(verified?.email).toBe(user.email);
    expect(verified?.role).toBe(Role.ADMIN);
  });

  it("should reject tampered or invalid JWT tokens", async () => {
    const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.token";
    const verified = await verifySession(invalidToken);
    expect(verified).toBeNull();
  });
});

describe("Audio Upload Validation & Security", () => {
  it("should accept valid MP3 buffers with ID3 headers", () => {
    // Valid ID3v2 header: 49 44 33 (ID3) + 9 bytes
    const mp3Buffer = Buffer.from([0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const result = validateAudioBuffer(mp3Buffer, "jingle-bells.mp3");
    expect(result.valid).toBe(true);
    expect(result.mimeType).toBe("audio/mpeg");
    expect(result.extension).toBe(".mp3");
  });

  it("should accept valid OGG buffers with OggS magic bytes", () => {
    // Valid OggS header: 4F 67 67 53
    const oggBuffer = Buffer.from([0x4f, 0x67, 0x67, 0x53, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const result = validateAudioBuffer(oggBuffer, "silent-night.ogg");
    expect(result.valid).toBe(true);
    expect(result.mimeType).toBe("audio/ogg");
  });

  it("should accept valid WAV buffers with RIFF WAVE headers", () => {
    // RIFF (4 bytes) + 4 bytes length + WAVE (4 bytes)
    const wavBuffer = Buffer.from([
      0x52, 0x49, 0x46, 0x46,
      0x24, 0x00, 0x00, 0x00,
      0x57, 0x41, 0x56, 0x45,
    ]);
    const result = validateAudioBuffer(wavBuffer, "deck-the-halls.wav");
    expect(result.valid).toBe(true);
    expect(result.mimeType).toBe("audio/wav");
  });

  it("should reject malicious or disguised executable files with audio extension", () => {
    // A bash script disguised as an mp3
    const maliciousScript = Buffer.from("#!/bin/bash\necho 'hacked'\nexit 0\n");
    const result = validateAudioBuffer(maliciousScript, "fake-song.mp3");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Invalid file format");
  });

  it("should reject oversized files", () => {
    process.env.MAX_UPLOAD_SIZE_MB = "1"; // Set to 1MB for test
    const oversizedBuffer = Buffer.alloc(2 * 1024 * 1024);
    const result = validateAudioBuffer(oversizedBuffer, "huge-song.mp3");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("File exceeds maximum allowed size");
    delete process.env.MAX_UPLOAD_SIZE_MB;
  });
});
