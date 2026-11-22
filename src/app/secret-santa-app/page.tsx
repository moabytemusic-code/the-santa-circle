import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Smartphone,
  CheckCircle2,
  HelpCircle,
  Zap,
  Lock,
  Share2,
  DownloadCloud,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Best Secret Santa App: Organize from Your Phone (No Download Required)",
  description:
    "Organize your Secret Santa exchange from your iPhone or Android in 60 seconds without downloading an app. 100% ad-free, spouse exclusions, and instant join links.",
  alternates: {
    canonical: "/secret-santa-app",
  },
  openGraph: {
    title: "Best Secret Santa App: Organize from Your Phone (No App Download)",
    description:
      "Skip clunky app store downloads. The Santa Circle is the modern web app that runs right from your mobile browser with zero ads and instant text invites.",
    url: "https://thesantacircle.com/secret-santa-app",
    type: "article",
  },
};

const FAQ_ITEMS = [
  {
    q: "Why is a web-based Secret Santa better than a mobile app?",
    a: "In any group of 5 to 50 people, requiring an app store download causes massive friction. Some members don't have storage space, others forget their Apple ID passwords, and older family members get confused. A mobile web app like The Santa Circle allows everyone to join instantly from their mobile browser without downloading anything.",
  },
  {
    q: "Does The Santa Circle work on both iPhone and Android?",
    a: "Yes! Because The Santa Circle is built with responsive web standards, it works identically on iOS Safari, Android Chrome, tablets, and desktop computers.",
  },
  {
    q: "Can I invite people through WhatsApp, Slack, or text message?",
    a: "Yes. In addition to email invitations, The Santa Circle generates a single secure shareable invite link that you can paste directly into group chats on WhatsApp, iMessage, SMS, or Slack.",
  },
  {
    q: "Can I save The Santa Circle as an icon on my phone home screen?",
    a: "Yes! In Safari or Chrome, tap 'Share' (or the three dots menu) and select 'Add to Home Screen'. The Santa Circle will function just like a native mobile app with instant tap access.",
  },
];

export default function SecretSantaAppPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "The Santa Circle - Mobile Secret Santa Web App",
        url: "https://thesantacircle.com/secret-santa-app",
        description:
          "Zero-install Secret Santa app for iPhone and Android. Manage gift exchanges, exclusion rules, and wishlists directly from your mobile browser.",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "iOS, Android, All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#0b2b20] text-slate-100 selection:bg-[#d4af37] selection:text-[#0b2b20]">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-16 sm:py-24 border-b border-[#1d5943]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#144534] border border-[#d4af37]/50 text-xs sm:text-sm font-bold text-[#f3c053] shadow-lg mb-6">
              <Smartphone className="w-4 h-4 text-[#d4af37]" />
              Zero App Store Installs • Instant Text & WhatsApp Invites • 100% Ad-Free
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#fef9ee] tracking-tight font-festive leading-tight">
              The Best Secret Santa App: <span className="text-[#d4af37]">Organize Right From Your Phone</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Don't force your family or coworkers to download a 100MB mobile app full of popup ads. The Santa Circle runs instantly in any mobile browser with 1-click text invites and animated unboxing reveals.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f3c053] hover:from-[#f3c053] hover:to-[#d4af37] text-[#0b2b20] font-extrabold text-base sm:text-lg shadow-xl shadow-[#d4af37]/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Start Mobile Circle in 60s</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/generator-for-secret-santa"
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#144534] hover:bg-[#1d5943] text-[#fef9ee] font-bold text-sm sm:text-base border border-[#1d5943] transition flex items-center justify-center gap-2"
              >
                <span>How Drawing Names Works</span>
                <Sparkles className="w-4 h-4 text-[#f3c053]" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto pt-6 border-t border-[#1d5943]/60">
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                <span>Zero Downloads</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                <span>WhatsApp & Text Links</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                <span>Spouse Exclusions</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                <span>100% Ad-Free</span>
              </div>
            </div>
          </div>
        </section>

        {/* DIRECT ANSWER SNIPPET BOX */}
        <section className="py-12 bg-[#081d16] border-b border-[#1d5943]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0b2b20] border-2 border-[#d4af37]/40 shadow-xl relative">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#d4af37] flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4" /> Quick Answer
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#fef9ee] mb-3">
                Do you need an app to run Secret Santa from your phone?
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                No. Modern gift exchange organizers prefer <strong>progressive web apps</strong> like <strong>The Santa Circle</strong>. Instead of forcing participants to search the App Store, remember their passwords, or download bloated 100MB apps, web apps allow everyone to join via a simple link in iMessage, WhatsApp, or Slack. You get all the features of a mobile app—push alerts, wishlists, animated reveals—with zero friction.
              </p>
            </div>
          </div>
        </section>

        {/* WHY NATIVE APPS FAIL GROUPS */}
        <section className="py-16 sm:py-20 bg-[#0b2b20] border-b border-[#1d5943]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#f3c053] uppercase tracking-widest">
                The App Store Hurdle
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] mt-1 font-festive">
                Why Native Mobile Apps Ruin Group Gift Exchanges
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#0e3527] border border-[#1d5943]">
                <div className="w-10 h-10 rounded-xl bg-red-900/40 border border-red-500/40 flex items-center justify-center text-xl mb-4">
                  📱
                </div>
                <h3 className="font-bold text-lg text-[#fef9ee] mb-2">The "No Storage" Excuse</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Inevitably, at least 3 people in your family or office group don't have phone storage space or refuse to download an app they'll only use once a year.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0e3527] border border-[#1d5943]">
                <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-500/40 flex items-center justify-center text-xl mb-4">
                  🔑
                </div>
                <h3 className="font-bold text-lg text-[#fef9ee] mb-2">Forgotten Passwords</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Older relatives get stuck on App Store login screens, two-factor authentication, and permission requests, stalling the entire exchange.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0e3527] border border-[#1d5943]">
                <div className="w-10 h-10 rounded-xl bg-blue-900/40 border border-blue-500/40 flex items-center justify-center text-xl mb-4">
                  🛑
                </div>
                <h3 className="font-bold text-lg text-[#fef9ee] mb-2">Aggressive Mobile Ads</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Legacy Secret Santa apps are notorious for auto-playing 30-second video game ads and popups every time you tap to view a wishlist.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MOBILE FEATURES */}
        <section className="py-16 sm:py-24 bg-[#081d16] border-b border-[#1d5943]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-[#f3c053] uppercase tracking-widest">
                Built for Mobile
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] mt-1 font-festive">
                How The Santa Circle Excels on Your Phone
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943] flex gap-4">
                <Share2 className="w-8 h-8 text-[#d4af37] shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-[#fef9ee] mb-1">Instant Group Chat Link</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Tap one button to copy your private join link and text it directly to your family iMessage group, WhatsApp group, or company Slack channel.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943] flex gap-4">
                <Sparkles className="w-8 h-8 text-[#d4af37] shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-[#fef9ee] mb-1">Animated Unboxing Reveal</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    When participants tap their reveal link, their phone screen displays an interactive gift box with floating holiday confetti, making the reveal memorable.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943] flex gap-4">
                <Zap className="w-8 h-8 text-[#d4af37] shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-[#fef9ee] mb-1">Direct Amazon Wishlists</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Members can add clothing sizes, shoe sizes, and direct Amazon wishlist links right from their mobile browser so gifters never buy the wrong item.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943] flex gap-4">
                <Lock className="w-8 h-8 text-[#d4af37] shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-[#fef9ee] mb-1">Host Blind Protection</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Even though you organized the circle on your phone, the assignments remain completely hidden from you so you can participate without spoiling your match.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-16 sm:py-24 bg-[#0b2b20] border-b border-[#1d5943]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] font-festive">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((faq, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-[#0e3527] border border-[#1d5943]"
                >
                  <h3 className="font-bold text-base sm:text-lg text-[#fef9ee] flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#d4af37] shrink-0" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed pl-7">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-20 bg-gradient-to-b from-[#0b2b20] to-[#061811] text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#fef9ee] font-festive">
              Start Your Mobile Circle in 60 Seconds
            </h2>
            <p className="mt-4 text-slate-300 max-w-xl mx-auto text-base sm:text-lg">
              No App Store downloads. No popups. Just a sleek, ad-free holiday gift exchange your friends and family will actually enjoy using.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f3c053] hover:from-[#f3c053] hover:to-[#d4af37] text-[#0b2b20] font-extrabold text-lg shadow-2xl shadow-[#d4af37]/30 transition transform hover:-translate-y-1"
              >
                <span>Create Mobile Circle (Free)</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
