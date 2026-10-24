import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Verify database connectivity
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "christmas-together",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: err instanceof Error ? err.message : "Database connection check failed",
      },
      { status: 503 }
    );
  }
}
