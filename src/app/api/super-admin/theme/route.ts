import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdminSession } from "@/lib/auth/super-admin";
import { CULTURAL_THEME_PRESETS, CulturalThemeId } from "@/lib/theme";

export async function GET() {
  const session = await requireSuperAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    let activeThemeId: CulturalThemeId = "CLASSIC";
    let customSettings: Record<string, any> = {};

    try {
      const setting = await prisma.platformSetting.findUnique({
        where: { key: "active_cultural_theme" },
      });
      if (setting?.value && setting.value in CULTURAL_THEME_PRESETS) {
        activeThemeId = setting.value as CulturalThemeId;
      }

      const overrides = await prisma.platformSetting.findUnique({
        where: { key: "cultural_theme_overrides" },
      });
      if (overrides?.value) {
        customSettings = JSON.parse(overrides.value);
      }
    } catch {
      // Table might not exist yet before first query
    }

    return NextResponse.json({
      success: true,
      activeThemeId,
      presets: CULTURAL_THEME_PRESETS,
      customSettings,
    });
  } catch (error: unknown) {
    console.error("[SuperAdmin Theme GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to load theme settings." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await requireSuperAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { activeThemeId, customSettings } = await req.json();

    if (activeThemeId && !(activeThemeId in CULTURAL_THEME_PRESETS)) {
      return NextResponse.json(
        { error: "Invalid theme ID provided." },
        { status: 400 }
      );
    }

    if (activeThemeId) {
      await prisma.platformSetting.upsert({
        where: { key: "active_cultural_theme" },
        update: { value: activeThemeId },
        create: { key: "active_cultural_theme", value: activeThemeId },
      });
    }

    if (customSettings && typeof customSettings === "object") {
      await prisma.platformSetting.upsert({
        where: { key: "cultural_theme_overrides" },
        update: { value: JSON.stringify(customSettings) },
        create: { key: "cultural_theme_overrides", value: JSON.stringify(customSettings) },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Platform theme successfully updated to "${activeThemeId || "custom"}".`,
      activeThemeId,
    });
  } catch (error: unknown) {
    console.error("[SuperAdmin Theme POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to save theme settings." },
      { status: 500 }
    );
  }
}
