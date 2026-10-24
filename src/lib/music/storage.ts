import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DEFAULT_UPLOAD_DIR = path.join(process.cwd(), "uploads", "music");

export interface AudioValidationResult {
  valid: boolean;
  mimeType?: string;
  extension?: string;
  error?: string;
}

/**
 * Validate audio buffer by checking both file extension and magic bytes
 */
export function validateAudioBuffer(buffer: Buffer, originalFilename: string): AudioValidationResult {
  // Check max size (default 15MB)
  const maxBytes = (parseInt(process.env.MAX_UPLOAD_SIZE_MB || "15", 10)) * 1024 * 1024;
  if (buffer.length > maxBytes) {
    return {
      valid: false,
      error: `File exceeds maximum allowed size of ${process.env.MAX_UPLOAD_SIZE_MB || 15}MB`,
    };
  }

  if (buffer.length < 12) {
    return { valid: false, error: "File too small or empty" };
  }

  const ext = path.extname(originalFilename).toLowerCase();
  
  // Magic bytes inspection
  // MP3: "ID3" (0x49 0x44 0x33) or sync word 0xFF 0xFB/0xF3/0xF2
  const isMp3 =
    (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) ||
    (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0);

  // OGG: "OggS" (0x4F 0x67 0x67 0x53)
  const isOgg =
    buffer[0] === 0x4f &&
    buffer[1] === 0x67 &&
    buffer[2] === 0x67 &&
    buffer[3] === 0x53;

  // WAV: "RIFF" .... "WAVE"
  const isWav =
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x41 &&
    buffer[10] === 0x56 &&
    buffer[11] === 0x45;

  if (isMp3 && (ext === ".mp3" || ext === "")) {
    return { valid: true, mimeType: "audio/mpeg", extension: ".mp3" };
  }
  if (isOgg && (ext === ".ogg" || ext === ".oga" || ext === "")) {
    return { valid: true, mimeType: "audio/ogg", extension: ".ogg" };
  }
  if (isWav && (ext === ".wav" || ext === "")) {
    return { valid: true, mimeType: "audio/wav", extension: ".wav" };
  }

  return {
    valid: false,
    error: "Invalid file format. Only legitimate MP3, OGG, or WAV audio files are permitted.",
  };
}

/**
 * Save audio track to secure persistent disk storage
 */
export async function saveAudioTrack(
  buffer: Buffer,
  originalFilename: string
): Promise<{ filePath: string; relativePath: string; mimeType: string }> {
  const validation = validateAudioBuffer(buffer, originalFilename);
  if (!validation.valid || !validation.extension || !validation.mimeType) {
    throw new Error(validation.error || "Invalid audio file");
  }

  const uploadDir = process.env.UPLOAD_DIR || DEFAULT_UPLOAD_DIR;
  await fs.mkdir(uploadDir, { recursive: true });

  // Generate an unguessable UUID filename to avoid directory traversal and execution risks
  const safeFilename = `${crypto.randomUUID()}${validation.extension}`;
  const fullPath = path.join(uploadDir, safeFilename);

  // Prevent path traversal outside uploadDir
  if (!fullPath.startsWith(path.resolve(uploadDir))) {
    throw new Error("Invalid destination path");
  }

  await fs.writeFile(fullPath, buffer);

  return {
    filePath: fullPath,
    relativePath: `/api/music/file/${safeFilename}`,
    mimeType: validation.mimeType,
  };
}

/**
 * Delete audio track from disk
 */
export async function deleteAudioTrack(filePath: string): Promise<boolean> {
  try {
    const uploadDir = path.resolve(process.env.UPLOAD_DIR || DEFAULT_UPLOAD_DIR);
    const resolvedPath = path.resolve(filePath);
    
    // Ensure file is inside upload directory
    if (resolvedPath.startsWith(uploadDir)) {
      await fs.unlink(resolvedPath);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
