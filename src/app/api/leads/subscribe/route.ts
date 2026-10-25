import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, source, culturalTheme } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = typeof name === "string" ? name.trim() : null;
    const cleanSource = typeof source === "string" ? source.trim() : "HOMEPAGE_LEAD_MAGNET";
    const cleanTheme = typeof culturalTheme === "string" ? culturalTheme.trim() : "CLASSIC";

    const subscriber = await prisma.leadSubscriber.upsert({
      where: { email: cleanEmail },
      update: {
        ...(cleanName ? { name: cleanName } : {}),
        source: cleanSource,
        culturalTheme: cleanTheme,
      },
      create: {
        email: cleanEmail,
        name: cleanName,
        source: cleanSource,
        culturalTheme: cleanTheme,
      },
    });

    // Optional Brevo Sync
    try {
      if (process.env.BREVO_API_KEY) {
        await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.BREVO_API_KEY,
          },
          body: JSON.stringify({
            email: cleanEmail,
            attributes: {
              FIRSTNAME: cleanName || "",
              CULTURE: cleanTheme,
              SOURCE: cleanSource,
            },
            updateEnabled: true,
          }),
        });
      }
    } catch (brevoErr) {
      console.warn("[Brevo Lead Sync Warning]:", brevoErr);
    }

    return NextResponse.json({
      success: true,
      message: "You're all set! Check your inbox for the free Holiday Toolkit & Gift Guide.",
      subscriberId: subscriber.id,
    });
  } catch (error: unknown) {
    console.error("[Lead Subscribe POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
