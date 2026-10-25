import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CULTURAL_THEME_PRESETS, CulturalThemeId, getThemeById } from "@/lib/theme";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedTheme = searchParams.get("theme") || searchParams.get("id");

    // Check if there is an active theme in DB
    let activeThemeId: CulturalThemeId = "CLASSIC";
    try {
      const setting = await prisma.platformSetting.findUnique({
        where: { key: "active_cultural_theme" },
      });
      if (setting?.value && setting.value in CULTURAL_THEME_PRESETS) {
        activeThemeId = setting.value as CulturalThemeId;
      }
    } catch {
      // Table might not exist yet during migration
    }

    const cookieStore = await cookies();
    const cookieTheme = cookieStore.get("cultural_theme")?.value;

    const finalThemeId = requestedTheme || cookieTheme || activeThemeId;
    const theme = getThemeById(finalThemeId);

    const response = NextResponse.json({
      success: true,
      activeThemeId,
      theme,
      presets: CULTURAL_THEME_PRESETS,
    });

    if (requestedTheme) {
      response.cookies.set("cultural_theme", theme.id.toLowerCase(), {
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (error: unknown) {
    console.error("[Theme API Error]:", error);
    return NextResponse.json({
      success: true,
      theme: CULTURAL_THEME_PRESETS.CLASSIC,
      presets: CULTURAL_THEME_PRESETS,
    });
  }
}
