import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getActiveThemeServer } from "@/lib/theme";
import {
  Gift,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Music2,
  ArrowRight,
  Check,
  Crown,
  Zap,
  Users,
} from "lucide-react";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ theme?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const currentTheme = await getActiveThemeServer(resolvedParams?.theme);
  const user = await getSession();

  // Calculate days until Christmas
  const now = new Date();
  const currentYear = now.getFullYear();
  let christmasDate = new Date(currentYear, 11, 25);
  if (now > christmasDate) {
    christmasDate = new Date(currentYear + 1, 11, 25);
  }
  const diffTime = Math.abs(christmasDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-20 py-6 sm:py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto px-4">
        {/* Cultural Theme Mascot */}
        {currentTheme.mascotType === "image" ? (
          <div className="flex justify-center">
            <img
              src={currentTheme.mascotValue}
              alt={currentTheme.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#d4af37] shadow-2xl animate-float object-cover bg-[#144534]"
            />
          </div>
        ) : (
          <div className="text-6xl sm:text-7xl animate-float">{currentTheme.mascotValue}</div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#144534] border border-[#d4af37]/40 text-[#f3c053] text-sm shadow-sm">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>{diffDays} days until Christmas!</span>
          </div>
          {currentTheme.id !== "CLASSIC" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f3c053] text-xs font-bold uppercase tracking-wider">
              {currentTheme.badge}
            </span>
          )}
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#fef9ee] font-festive">
          {currentTheme.appName}
        </h1>

        <p className="text-lg sm:text-2xl text-[#f3c053] font-medium max-w-2xl mx-auto">
          {currentTheme.heroHeadline}
        </p>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          {currentTheme.heroSubheadline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {user ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-[#d4af37] text-[#0b2b20] font-bold text-base hover:bg-[#f3c053] transition shadow-lg shadow-[#d4af37]/20"
            >
              <span>Go to Circle Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-[#d4af37] text-[#0b2b20] font-bold text-base hover:bg-[#f3c053] transition shadow-lg shadow-[#d4af37]/20 cursor-pointer"
              >
                <span>{currentTheme.callToAction}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#144534] text-[#fef9ee] font-medium text-base hover:bg-[#1d5943] border border-[#1d5943] transition"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center justify-center space-x-6 text-xs text-slate-400 pt-2">
          <span className="flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>100% Ad-Free Experience</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Ready in 60 Seconds</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Private &amp; Secure</span>
          </span>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="festive-card p-6 rounded-2xl space-y-3 border border-[#1d5943]">
          <div className="w-12 h-12 rounded-xl bg-[#0b2b20] flex items-center justify-center text-[#d4af37] border border-[#d4af37]/30">
            <Gift className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#fef9ee] font-festive">Smart &amp; Fair Pairing</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Automatic randomization engine with spouse and partner exclusions. Nobody draws themselves or their significant other.
          </p>
        </div>

        <div className="festive-card p-6 rounded-2xl space-y-3 border border-[#1d5943]">
          <div className="w-12 h-12 rounded-xl bg-[#0b2b20] flex items-center justify-center text-[#d4af37] border border-[#d4af37]/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#fef9ee] font-festive">Strict Privacy</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Assignments remain completely secret. Even circle hosts cannot peek at who drew whom, keeping the reveal genuine and exciting.
          </p>
        </div>

        <div className="festive-card p-6 rounded-2xl space-y-3 border border-[#1d5943]">
          <div className="w-12 h-12 rounded-xl bg-[#0b2b20] flex items-center justify-center text-[#d4af37] border border-[#d4af37]/30">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#fef9ee] font-festive">Holiday Wish Lists</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Add gift ideas, clothing sizes, favorite colors, and hobby notes directly with direct links and an anonymous purchased tracker.
          </p>
        </div>
      </section>

      {/* Pricing / Plan Comparison Section */}
      <section className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs text-[#f3c053] uppercase tracking-wider font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Simple, Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#fef9ee] font-festive">
            Choose What Fits Your Circle
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Free forever for small families and friend groups. Upgrade to the Host Pass for larger exchanges, automated reminder broadcasts, and premium tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Free Tier */}
          <div className="festive-card p-8 rounded-2xl border border-[#1d5943] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#fef9ee]">Standard Circle</span>
                <span className="text-2xl font-bold text-[#d4af37]">$0</span>
              </div>
              <p className="text-xs text-slate-300">
                Perfect for immediate family gatherings and small circles.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span>Up to 15 circle participants</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span>Spouse &amp; partner exclusion rules</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span>Holiday wish lists &amp; gift tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span>Festive carols &amp; interactive snowfall</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span>100% Ad-Free interface</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3 text-center rounded-xl bg-[#144534] hover:bg-[#1d5943] text-[#fef9ee] font-bold text-sm border border-[#1d5943] transition"
            >
              Start Free Circle
            </Link>
          </div>

          {/* Host Pass Premium Tier */}
          <div className="festive-card p-8 rounded-2xl border-2 border-[#d4af37] bg-gradient-to-b from-[#144534]/80 to-[#071d15]/90 flex flex-col justify-between space-y-6 relative shadow-2xl shadow-[#d4af37]/20">
            <div className="absolute -top-3 right-6 bg-[#d4af37] text-[#0b2b20] text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md flex items-center space-x-1">
              <Crown className="w-3.5 h-3.5" />
              <span>Most Popular</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-[#fef9ee] flex items-center space-x-1.5">
                    <span>Host Pass</span>
                    <Crown className="w-4 h-4 text-[#d4af37]" />
                  </span>
                  <p className="text-[11px] text-[#f3c053]">One-time fee per exchange • No subscription</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-[#d4af37]">$7.99</span>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                Ideal for large families, company teams, alumni circles, and busy organizers who want stress-free management.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-100">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span><strong>Unlimited participants</strong> (no head-count limits)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span><strong>1-Click Reminder Broadcasts</strong> to guests awaiting response</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span><strong>Custom Reveal Countdown</strong> &amp; unwrap effects</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span><strong>Export Roster</strong> &amp; wishlist summaries</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span><strong>Priority Email Delivery</strong> via verified Brevo route</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3 text-center rounded-xl bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-sm shadow-lg shadow-[#d4af37]/25 transition"
            >
              Get Started with Host Pass
            </Link>
          </div>
        </div>
      </section>

      {/* Atmosphere Banner */}
      <section className="festive-card p-8 rounded-2xl bg-gradient-to-r from-[#144534] via-[#0b2b20] to-[#144534] border border-[#d4af37]/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 text-[#f3c053] text-sm font-semibold">
            <Music2 className="w-4 h-4" />
            <span>Festive Atmosphere</span>
          </div>
          <h3 className="text-2xl font-bold text-[#fef9ee] font-festive">
            Christmas Carols &amp; Gentle Snowfall
          </h3>
          <p className="text-sm text-slate-300 max-w-xl">
            Enjoy curated classical carols and peaceful snow animations while setting up your exchange and browsing holiday wishlists.
          </p>
        </div>
        <Link
          href="/register"
          className="px-6 py-3 rounded-full bg-[#d4af37] text-[#0b2b20] font-bold text-sm hover:bg-[#f3c053] transition shadow-md whitespace-nowrap"
        >
          Create Your Circle Now
        </Link>
      </section>
    </div>
  );
}
