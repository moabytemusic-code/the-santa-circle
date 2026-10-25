export type CulturalThemeId = "CLASSIC" | "BLACK_SANTA" | "NAVIDAD" | "MULTICULTURAL";

export interface CulturalTheme {
  id: CulturalThemeId;
  name: string;
  badge: string;
  community: string;
  mascotType: "emoji" | "image";
  mascotValue: string; // image path (e.g. "/images/santa-logo.png") or emoji
  navbarLogo: string; // image path or emoji
  appName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  primaryGreeting: string;
  callToAction: string;
  accentColor: string; // Tailwind-compatible or hex
  description: string;
}

export const CULTURAL_THEME_PRESETS: Record<CulturalThemeId, CulturalTheme> = {
  BLACK_SANTA: {
    id: "BLACK_SANTA",
    name: "Black Santa & African-American Heritage",
    badge: "Heritage Edition",
    community: "African-American, African & Diaspora Communities",
    mascotType: "image",
    mascotValue: "/images/santa-logo.png",
    navbarLogo: "/images/santa-logo.png",
    appName: "The Santa Circle",
    tagline: "Celebrating Black Holiday Joy & Family Traditions",
    heroHeadline: "Celebrate the Holidays with Joy, Culture & Community",
    heroSubheadline:
      "The modern, ad-free Secret Santa platform built to bring family, friends, and community together. Smart spouse exclusions, instant Amazon wishlists, and holiday cheer.",
    primaryGreeting: "Joyous Holiday Season! 🎅🏿✨",
    callToAction: "Start Your Family Circle",
    accentColor: "#d4af37",
    description:
      "Features our custom Black Santa portrait emblem, celebratory heritage messaging, and family-first holiday greetings.",
  },

  CLASSIC: {
    id: "CLASSIC",
    name: "Classic Festive Holiday",
    badge: "Traditional Edition",
    community: "Classic & Traditional Holiday Gatherings",
    mascotType: "emoji",
    mascotValue: "🎅",
    navbarLogo: "🎄",
    appName: "The Santa Circle",
    tagline: "Modern Secret Santa for Work & Family",
    heroHeadline: "Bring the Joy of Secret Santa Back to the Holidays",
    heroSubheadline:
      "Organize your gift exchange in 60 seconds. Set spending limits, prevent spouse pairs from drawing each other, and share wishlists seamlessly.",
    primaryGreeting: "Merry Christmas! 🎄🎅",
    callToAction: "Create Your Free Circle",
    accentColor: "#d4af37",
    description:
      "The classic green and gold aesthetic with festive emojis, perfect for all holiday gatherings and workplaces.",
  },

  NAVIDAD: {
    id: "NAVIDAD",
    name: "Navidad & Reyes Magos (Latino / Hispanic)",
    badge: "Edición Familiar",
    community: "Hispanic, Latino & Bilingual Families",
    mascotType: "emoji",
    mascotValue: "🎅🏽",
    navbarLogo: "🎄",
    appName: "The Santa Circle (El Círculo de Santa)",
    tagline: "Tradición, Familia y Regalos Navideños",
    heroHeadline: "El Intercambio Navideño Más Fácil y Divertido",
    heroSubheadline:
      "Organiza tu Amigo Secreto o intercambio navideño en segundos. Sin publicidad molesta, con listas de deseos de Amazon y reglas para parejas.",
    primaryGreeting: "¡Feliz Navidad y Próspero Año! 🎄✨",
    callToAction: "Crear Círculo Navideño Gratis",
    accentColor: "#f3c053",
    description:
      "Warm bilingual holiday styling honoring Latino holiday traditions, Amigo Secreto, and family reunions.",
  },

  MULTICULTURAL: {
    id: "MULTICULTURAL",
    name: "Winter Glow (Inclusive Multicultural)",
    badge: "Universal Winter Edition",
    community: "Workplaces, Diverse Teams & Winter Festivals",
    mascotType: "emoji",
    mascotValue: "❄️",
    navbarLogo: "🎁",
    appName: "The Santa Circle",
    tagline: "Modern Holiday Gift Exchanges for Teams & Friends",
    heroHeadline: "Effortless Holiday Gift Exchanges for Everyone",
    heroSubheadline:
      "An inclusive, modern gift exchange platform with secret wishlists, budget limits, and smart draw rules designed for diverse friend groups and teams.",
    primaryGreeting: "Happy Holidays & Warm Winter Wishes! ❄️✨",
    callToAction: "Start a Free Gift Exchange",
    accentColor: "#67e8f9",
    description:
      "Neutral, elegant winter-themed branding focusing on togetherness, cozy winter aesthetics, and workplace inclusivity.",
  },
};

/**
 * Resolves theme from query param, cookie, or fallback to default
 */
export function getThemeById(id?: string | null): CulturalTheme {
  if (!id) return CULTURAL_THEME_PRESETS.CLASSIC;
  const upper = id.toUpperCase().replace(/-/g, "_") as string;
  if (upper === "WINTER_GLOW" || upper === "WINTER" || upper === "INCLUSIVE" || upper === "MULTICULTURAL") {
    return CULTURAL_THEME_PRESETS.MULTICULTURAL;
  }
  if (upper === "BLACK_SANTA" || upper === "BLACKSANTA" || upper === "AFRICAN_AMERICAN") {
    return CULTURAL_THEME_PRESETS.BLACK_SANTA;
  }
  if (upper === "NAVIDAD" || upper === "HISPANIC" || upper === "LATINO" || upper === "REYES_MAGOS") {
    return CULTURAL_THEME_PRESETS.NAVIDAD;
  }
  if (upper in CULTURAL_THEME_PRESETS) {
    return CULTURAL_THEME_PRESETS[upper as CulturalThemeId];
  }
  return CULTURAL_THEME_PRESETS.CLASSIC;
}

/**
 * Server-side resolver that checks query param, DB setting, or cookies
 */
export async function getActiveThemeServer(
  queryTheme?: string | null
): Promise<CulturalTheme> {
  if (queryTheme) {
    return getThemeById(queryTheme);
  }

  try {
    const { prisma } = await import("@/lib/db");
    const setting = await prisma.platformSetting.findUnique({
      where: { key: "active_cultural_theme" },
    });
    if (setting?.value && setting.value in CULTURAL_THEME_PRESETS) {
      return CULTURAL_THEME_PRESETS[setting.value as CulturalThemeId];
    }
  } catch {
    // If DB unavailable or during build
  }

  return CULTURAL_THEME_PRESETS.CLASSIC;
}
