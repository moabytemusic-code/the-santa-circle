import type { Metadata } from "next";
import Link from "next/link";
import GamePickerQuiz from "./GamePickerQuiz";
import {
  Gift,
  Sparkles,
  Shuffle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Printer,
  Download,
  Users,
  AlertTriangle,
  Scale,
} from "lucide-react";

export const metadata: Metadata = {
  title: "White Elephant vs. Secret Santa: Rules, Differences & Which to Pick",
  description:
    "Confused between White Elephant and Secret Santa? Discover the key rule differences, stealing mechanics, budget tips, and take our 30-second quiz to pick the best game.",
  alternates: {
    canonical: "/white-elephant-vs-secret-santa",
  },
  openGraph: {
    title: "White Elephant vs. Secret Santa: Rules, Differences & Which to Pick",
    description:
      "The definitive guide to White Elephant vs. Secret Santa. Stealing rules, comparison tables, budget caps, and which game is best for your holiday party.",
    url: "https://thesantacircle.com/white-elephant-vs-secret-santa",
    type: "article",
  },
};

const FAQ_ITEMS = [
  {
    q: "What is the main difference between White Elephant and Secret Santa?",
    a: "In Secret Santa, you buy a personalized, thoughtful gift for one specific person whose name you drew in advance, and there is no gift stealing. In White Elephant, everyone brings a generic wrapped gift for a common pool, and players take turns unwrapping gifts or stealing from one another.",
  },
  {
    q: "Is Yankee Swap the same as White Elephant?",
    a: "Yes, Yankee Swap and White Elephant are very similar. In New England and parts of the Northeast US, the game is commonly called Yankee Swap. The primary difference is that Yankee Swap historically focuses on practical, nice gifts, while White Elephant traditionally welcomes funny, quirky, or gag gifts.",
  },
  {
    q: "Can you steal a gift back immediately in White Elephant?",
    a: "No. The universal 'no immediate steal-back' rule prevents Person A from stealing back the exact gift Person B just took from them on the same turn. You must steal from someone else or open a new wrapped gift.",
  },
  {
    q: "What is the recommended budget for Secret Santa vs. White Elephant?",
    a: "For Secret Santa, $25 to $50 is common because gifts are personalized with wishlists and sizing. For White Elephant, $15 to $25 is ideal since gifts are humorous or crowd-pleasing and anyone in the room could end up with them.",
  },
  {
    q: "Which game is better for family gatherings?",
    a: "Secret Santa is typically better for families—especially when using automated pair exclusions so spouses don't draw each other. However, if your family loves competitive humor and casual party games, White Elephant is an incredible after-dinner activity.",
  },
];

export default function WhiteElephantVsSecretSantaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "White Elephant vs. Secret Santa: Rules, Differences & Which to Pick",
        description:
          "Comprehensive guide comparing Secret Santa and White Elephant holiday gift exchanges, including stealing rules, comparison tables, and game selector quiz.",
        author: {
          "@type": "Organization",
          name: "The Santa Circle",
          url: "https://thesantacircle.com",
        },
        publisher: {
          "@type": "Organization",
          name: "The Santa Circle",
          logo: {
            "@type": "ImageObject",
            url: "https://thesantacircle.com/images/santa-logo.png",
          },
        },
        datePublished: "2026-11-20T00:00:00.000Z",
        dateModified: new Date().toISOString(),
        mainEntityOfPage: "https://thesantacircle.com/white-elephant-vs-secret-santa",
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

      <article className="min-h-screen bg-[#0b2b20] text-slate-100 selection:bg-[#d4af37] selection:text-[#0b2b20]">
        {/* HEADER HERO */}
        <header className="relative overflow-hidden py-14 sm:py-20 border-b border-[#1d5943]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#144534] border border-[#d4af37]/50 text-xs sm:text-sm font-bold text-[#f3c053] shadow-lg mb-6">
              <Scale className="w-4 h-4 text-[#d4af37]" />
              The Ultimate Holiday Gift Exchange Guide
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#fef9ee] tracking-tight font-festive leading-tight">
              White Elephant vs. Secret Santa: <br className="hidden sm:inline" />
              <span className="text-[#d4af37]">Rules, Differences & Which to Pick</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Planning your office, family, or friend group gift exchange? Discover the core differences between personalized Secret Santa and competitive White Elephant stealing.
            </p>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
              <span>📅 Updated for 2026 Season</span>
              <span>•</span>
              <span>⏱️ 5-Minute Read</span>
              <span>•</span>
              <span>🎲 Includes Interactive Quiz</span>
            </div>
          </div>
        </header>

        {/* DIRECT ANSWER / FEATURED SNIPPET BOX */}
        <section className="py-10 bg-[#081d16] border-b border-[#1d5943]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0b2b20] border-2 border-[#d4af37]/40 shadow-xl">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#d4af37] flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4" /> The Quick Verdict
              </span>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                The main difference between <strong>White Elephant</strong> and <strong>Secret Santa</strong> is the gift recipient and gameplay style. In <strong>Secret Santa</strong>, you buy a thoughtful, personalized gift for one assigned person with no stealing involved. In <strong>White Elephant</strong>, everyone brings an unlabeled gift for a central pile, and players take turns picking and aggressively stealing gifts from each other.
              </p>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="py-14 sm:py-20 bg-[#0b2b20]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fef9ee] font-festive">
                Side-by-Side Comparison: White Elephant vs. Secret Santa
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                A quick glance at how both traditional holiday games stack up.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#1d5943] bg-[#144534]/50 shadow-2xl">
              <table className="w-full text-left text-xs sm:text-sm text-slate-200">
                <thead className="bg-[#0b2b20] text-[#f3c053] uppercase text-[11px] font-bold border-b border-[#1d5943]">
                  <tr>
                    <th className="py-4 px-4 sm:px-6">Feature</th>
                    <th className="py-4 px-4 sm:px-6 text-[#fef9ee]">🎅 Secret Santa</th>
                    <th className="py-4 px-4 sm:px-6 text-[#d4af37]">🐘 White Elephant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1d5943]/60">
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-white">Who you buy for</td>
                    <td className="py-4 px-4 sm:px-6">One specific assigned person</td>
                    <td className="py-4 px-4 sm:px-6">Anyone in the group (communal pool)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-white">Gift Type</td>
                    <td className="py-4 px-4 sm:px-6">Personalized, sizes, wishlists</td>
                    <td className="py-4 px-4 sm:px-6">Funny, viral, gag gifts, or crowd-pleasers</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-white">Gift Stealing?</td>
                    <td className="py-4 px-4 sm:px-6 text-red-300 font-bold">❌ No stealing allowed</td>
                    <td className="py-4 px-4 sm:px-6 text-emerald-400 font-bold">✅ Yes (core game mechanic)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-white">Ideal Budget</td>
                    <td className="py-4 px-4 sm:px-6">$25 – $50</td>
                    <td className="py-4 px-4 sm:px-6">$15 – $25</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-white">Surprise Element</td>
                    <td className="py-4 px-4 sm:px-6">Guessing who your Secret Santa was</td>
                    <td className="py-4 px-4 sm:px-6">Unwrapping bizarre items & stealing</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-white">Tone & Atmosphere</td>
                    <td className="py-4 px-4 sm:px-6">Heartfelt, thoughtful, calm</td>
                    <td className="py-4 px-4 sm:px-6">Chaotic, competitive, funny</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-white">Best Group Size</td>
                    <td className="py-4 px-4 sm:px-6">Any size (3 to 100+ members)</td>
                    <td className="py-4 px-4 sm:px-6">6 to 25 players (too big gets slow)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* INTERACTIVE QUIZ EMBED */}
            <GamePickerQuiz />
          </div>
        </section>

        {/* DEEP DIVE: SECRET SANTA RULES */}
        <section className="py-14 sm:py-20 bg-[#081d16] border-t border-b border-[#1d5943]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🎅</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fef9ee] font-festive">
                How Secret Santa Works (The Thoughtful Choice)
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              <p>
                In <strong>Secret Santa</strong>, names are drawn secretly ahead of time. You are assigned one specific person to shop for, and someone else is assigned you. Because you know your recipient in advance, participants can submit wishlists, shoe sizes, clothing preferences, and hobbies.
              </p>

              <h3 className="text-lg font-bold text-[#d4af37] pt-2">The Essential Secret Santa Rules:</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Fixed Budget:</strong> The host sets a clear price limit (e.g., $25) so everyone gives and receives gifts of equal value.</li>
                <li><strong>Strict Secrecy:</strong> Nobody discloses their assignment until the official reveal date.</li>
                <li><strong>Smart Exclusions (Modern Rule):</strong> Couples, spouses, or roommates are paired out so they don&apos;t end up buying gifts for each other.</li>
                <li><strong>The Reveal:</strong> When gifts are exchanged, the recipient opens their gift and guesses who their Secret Santa was.</li>
              </ul>

              {/* Secret Santa CTA Box */}
              <div className="mt-6 p-6 rounded-2xl bg-[#0b2b20] border border-[#d4af37]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-[#fef9ee]">Planning a Secret Santa exchange?</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Use our 100% ad-free generator with smart spouse exclusions and Amazon wishlists.
                  </p>
                </div>
                <Link
                  href="/secret-santa-generator-with-exclusions"
                  className="whitespace-nowrap px-6 py-3 rounded-full bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-xs sm:text-sm shadow transition flex items-center gap-2"
                >
                  <span>Secret Santa Generator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* DEEP DIVE: WHITE ELEPHANT RULES */}
        <section className="py-14 sm:py-20 bg-[#0b2b20]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🐘</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fef9ee] font-festive">
                How White Elephant Works (The Party Game Choice)
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              <p>
                <strong>White Elephant</strong> is a party game where the entertainment comes from unwrapping mysterious gifts, sudden plot twists, and aggressive steals. Everyone brings one anonymous, wrapped gift suitable for any generic player in the room.
              </p>

              <h3 className="text-lg font-bold text-[#d4af37] pt-2">Official White Elephant Stealing Rules:</h3>
              <ol className="space-y-3 list-decimal pl-5">
                <li>
                  <strong>Draw Numbers:</strong> Players draw numbers from 1 to N to determine turn order.
                </li>
                <li>
                  <strong>Turn 1:</strong> Player #1 picks any wrapped gift from the central pile, unwraps it, and shows everyone.
                </li>
                <li>
                  <strong>Subsequent Turns:</strong> Each following player can choose to either:
                  <ul className="list-disc pl-5 mt-1 text-slate-300">
                    <li>Unwrap a new gift from the table, <strong>OR</strong></li>
                    <li>Steal an already opened gift from any player who went before them.</li>
                  </ul>
                </li>
                <li>
                  <strong>The 3-Steal Limit (Crucial Rule):</strong> To prevent the game from lasting forever, any gift that has been stolen 3 times becomes &quot;frozen&quot; and can never be stolen again.
                </li>
                <li>
                  <strong>The Player #1 Redemption:</strong> Because Player #1 had no option to steal at the start of the game, after the last gift is opened, Player #1 gets one final opportunity to steal any unfrozen gift!
                </li>
              </ol>

              {/* White Elephant Games Bundle CTA */}
              <div className="mt-6 p-6 rounded-2xl bg-[#144534] border border-[#d4af37]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-[#fef9ee]">Hosting White Elephant this year?</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Download printable player number cards (1-50), official rule sheets, and stealing cheat sheets.
                  </p>
                </div>
                <Link
                  href="/games-bundle"
                  className="whitespace-nowrap px-6 py-3 rounded-full bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-xs sm:text-sm shadow transition flex items-center gap-2"
                >
                  <span>Download Party Bundle ($9.99)</span>
                  <Download className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* REGIONAL VARIANTS (Yankee Swap vs Dirty Santa) */}
        <section className="py-14 bg-[#081d16] border-t border-b border-[#1d5943]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fef9ee] font-festive mb-6">
              What About Yankee Swap & Dirty Santa?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
              <div className="p-5 rounded-xl bg-[#0b2b20] border border-[#1d5943]">
                <h3 className="font-bold text-white text-base mb-1">Yankee Swap</h3>
                <p>
                  Commonly used in New England and Atlantic Canada. The gameplay is identical to White Elephant, but participants traditionally bring genuine, useful gifts (like specialty foods, wine, or cozy throws) rather than comedic gag items.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#0b2b20] border border-[#1d5943]">
                <h3 className="font-bold text-white text-base mb-1">Dirty Santa</h3>
                <p>
                  Popular in the American South and Midwest. The name highlights the &quot;dirty&quot; act of stealing gifts right out of someone&apos;s hands. Like White Elephant, gifts range from high-demand viral items to humorous gags.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="py-16 bg-[#0b2b20]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] text-center font-festive mb-10">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {FAQ_ITEMS.map((faq, index) => (
                <div
                  key={index}
                  className="p-5 sm:p-6 rounded-2xl bg-[#081d16] border border-[#1d5943]"
                >
                  <h3 className="text-base sm:text-lg font-bold text-[#fef9ee] flex items-center gap-2">
                    <span className="text-[#d4af37]">Q:</span> {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM FINAL CONVERSION BANNER */}
        <footer className="py-16 sm:py-24 bg-gradient-to-b from-[#081d16] to-[#04110d] border-t border-[#1d5943] text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-4xl">🎄 🎁 🎲</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#fef9ee] mt-4 font-festive">
              Make Your 2026 Holiday Exchange Unforgettable
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-xl mx-auto">
              Whether you choose thoughtful Secret Santa or hilarious White Elephant, The Santa Circle has everything you need to organize stress-free.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/secret-santa-generator-with-exclusions"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f3c053] hover:from-[#f3c053] hover:to-[#d4af37] text-[#0b2b20] font-extrabold text-base shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Free Secret Santa with Exclusions</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/gift-guides"
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#144534] hover:bg-[#1d5943] text-[#fef9ee] font-bold text-sm sm:text-base border border-[#1d5943] transition flex items-center justify-center gap-2"
              >
                <span>Browse Gift Ideas Under $25</span>
                <Gift className="w-4 h-4 text-[#f3c053]" />
              </Link>
            </div>
          </div>
        </footer>
      </article>
    </>
  );
}
