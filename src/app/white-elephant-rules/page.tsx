import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Dice5,
  Flame,
  ShieldAlert,
  Gift,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "White Elephant Gift Exchange: Official Rules, Stealing Limits & Variations",
  description:
    "Master the official White Elephant rules: stealing limits, turn order, the 3-steal freeze rule, and popular game variations like Dirty Santa and Yankee Swap.",
  alternates: {
    canonical: "/white-elephant-rules",
  },
  openGraph: {
    title: "White Elephant Gift Exchange: Official Rules & Stealing Limits",
    description:
      "The complete guide to running a White Elephant gift exchange. Learn stealing limits, turn orders, and avoid party arguments with our printable rules.",
    url: "https://thesantacircle.com/white-elephant-rules",
    type: "article",
  },
};

const FAQ_ITEMS = [
  {
    q: "How many times can a gift be stolen in White Elephant?",
    a: "Standard White Elephant rules enforce a 3-steal limit. Once a gift has been stolen three times (meaning a fourth person cannot steal it), it becomes 'frozen' and stays permanently with its final recipient.",
  },
  {
    q: "What is the difference between White Elephant, Dirty Santa, and Yankee Swap?",
    a: "White Elephant typically focuses on humorous, weird, or gag gifts. Dirty Santa involves wrapped, desirable, or fun gifts that people actively compete to steal. Yankee Swap is regional (popular in New England) and often allows the person who picked #1 to swap their gift at the very end.",
  },
  {
    q: "Can you steal back a gift immediately after it was taken from you?",
    a: "No. The standard 'no immediate steal-back' rule dictates that you cannot immediately take back the exact gift that was just stolen from you during that same turn. You must either steal from someone else or open a new wrapped gift.",
  },
  {
    q: "What does player #1 do at the end of the game?",
    a: "Because player #1 opened their gift with no stealing options available, official rules give Player #1 the final turn: they can choose to keep their current gift or swap it with any unfrozen gift in the room.",
  },
  {
    q: "What is an appropriate budget for a White Elephant party?",
    a: "The most popular budget range is $15 to $25. Setting a strict budget ensures all participants bring gifts of comparable value and prevents awkwardness.",
  },
];

export default function WhiteElephantRulesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "White Elephant Gift Exchange: Official Rules, Stealing Limits & Variations",
        description:
          "The complete guide to White Elephant rules, turn orders, stealing limits, and game variations.",
        url: "https://thesantacircle.com/white-elephant-rules",
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
            url: "https://thesantacircle.com/og-thumbnail.png",
          },
        },
      },
      {
        "@type": "HowTo",
        name: "How to Play White Elephant Gift Exchange",
        description:
          "Official turn-by-turn rules for organizing and running a fair, fun White Elephant holiday gift exchange.",
        step: [
          {
            "@type": "HowToStep",
            name: "Draw Numbers for Turn Order",
            text: "Write numbers 1 through N (where N is the total number of players) on slips and have each player draw their turn number.",
          },
          {
            "@type": "HowToStep",
            name: "Player #1 Unwraps a Gift",
            text: "Player #1 selects any wrapped gift from the central table and unwraps it in front of the group.",
          },
          {
            "@type": "HowToStep",
            name: "Subsequent Players Choose to Uncover or Steal",
            text: "Each subsequent player can either unwrap a new gift or steal an opened, unfrozen gift from another player.",
          },
          {
            "@type": "HowToStep",
            name: "Player #1 Bonus Turn",
            text: "After the final player takes their turn, Player #1 has the option to swap their gift with any unfrozen gift in play.",
          },
        ],
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
              <Dice5 className="w-4 h-4 text-[#d4af37]" />
              Official 2026 Game Rules • Stealing Limits • Variations
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#fef9ee] tracking-tight font-festive leading-tight">
              White Elephant Gift Exchange: <span className="text-[#d4af37]">Official Rules & Stealing Limits</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Planning a holiday party? Here are the official rules, stealing boundaries, the 3-steal freeze rule, and popular variations like Dirty Santa and Yankee Swap.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/games-bundle"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f3c053] hover:from-[#f3c053] hover:to-[#d4af37] text-[#0b2b20] font-extrabold text-base sm:text-lg shadow-xl shadow-[#d4af37]/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Get 12 Printable Party Games</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/generator-for-secret-santa"
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#144534] hover:bg-[#1d5943] text-[#fef9ee] font-bold text-sm sm:text-base border border-[#1d5943] transition flex items-center justify-center gap-2"
              >
                <span>Prefer Secret Santa? Draw Names</span>
                <Sparkles className="w-4 h-4 text-[#f3c053]" />
              </Link>
            </div>
          </div>
        </section>

        {/* DIRECT ANSWER SNIPPET BOX */}
        <section className="py-12 bg-[#081d16] border-b border-[#1d5943]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0b2b20] border-2 border-[#d4af37]/40 shadow-xl relative">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#d4af37] flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4" /> Quick Rules Summary
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#fef9ee] mb-3">
                How does a White Elephant gift exchange work?
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                In a <strong>White Elephant gift exchange</strong>, each player brings one wrapped gift. Players draw numbers to establish turn order. Player #1 unwraps a gift from the pile. Each subsequent player can either unwrap a new gift or <strong>steal an opened gift</strong> from another player. If your gift is stolen, you immediately choose another opened gift or unwrap a new one. A gift can typically only be stolen <strong>3 times</strong> before it is frozen.
              </p>
            </div>
          </div>
        </section>

        {/* THE 5 CORE RULES */}
        <section className="py-16 sm:py-24 bg-[#0b2b20] border-b border-[#1d5943]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-[#f3c053] uppercase tracking-widest">
                Step-by-Step Play
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] mt-1 font-festive">
                The 5 Official Rules of White Elephant
              </h2>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0e3527] border border-[#1d5943] flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#d4af37] text-[#0b2b20] font-black flex items-center justify-center shrink-0 text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#fef9ee] mb-1">Draw Numbers for Order</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Write numbers 1 through the total number of participants on slips of paper and place them in a bowl. Each guest draws one number. Number 1 goes first; the highest number goes last.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0e3527] border border-[#1d5943] flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#d4af37] text-[#0b2b20] font-black flex items-center justify-center shrink-0 text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#fef9ee] mb-1">Player 1 Opens the First Gift</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Player #1 inspects the wrapped pile, selects any gift, and unwraps it publicly so everyone sees what it is.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0e3527] border border-[#1d5943] flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#d4af37] text-[#0b2b20] font-black flex items-center justify-center shrink-0 text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#fef9ee] mb-1">Choose: Open or Steal</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Player #2 and all subsequent players have a choice: unwrap a new gift from the table, OR steal an already-opened gift from any prior player.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0e3527] border border-[#1d5943] flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#d4af37] text-[#0b2b20] font-black flex items-center justify-center shrink-0 text-lg">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#fef9ee] mb-1">The 3-Steal Freeze Rule</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    A gift can only be stolen <strong>3 times</strong> during the entire game. On the third steal, the gift becomes frozen and cannot be stolen again. (Also, you cannot immediately steal back a gift that was just taken from you on the same turn).
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0e3527] border border-[#1d5943] flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#d4af37] text-[#0b2b20] font-black flex items-center justify-center shrink-0 text-lg">
                  5
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#fef9ee] mb-1">Player #1 Gets the Final Swap</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Since Player #1 had no option to steal at the start of the game, after the last player takes their turn, Player #1 gets one final opportunity to swap their gift with any unfrozen gift in the room.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON: WHITE ELEPHANT VS DIRTY SANTA VS YANKEE SWAP */}
        <section className="py-16 sm:py-24 bg-[#081d16] border-b border-[#1d5943]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#f3c053] uppercase tracking-widest">
                Game Variations
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] mt-1 font-festive">
                White Elephant vs. Dirty Santa vs. Yankee Swap
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943]">
                <h3 className="text-xl font-bold text-[#d4af37] mb-2">🐘 White Elephant</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Focuses on <strong>humorous, quirky, or gag gifts</strong>. The goal is laughter and entertainment rather than practical items.
                </p>
                <span className="text-xs text-slate-400 font-semibold">Typical Gift: Bacon bandages, singing fish, oversized mugs.</span>
              </div>

              <div className="p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943]">
                <h3 className="text-xl font-bold text-[#d4af37] mb-2">🎅 Dirty Santa</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Focuses on <strong>desirable, useful gifts</strong> that players aggressively steal from one another. Highly competitive and fun.
                </p>
                <span className="text-xs text-slate-400 font-semibold">Typical Gift: Cozy throw blankets, high-end chocolates, Bluetooth speakers.</span>
              </div>

              <div className="p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943]">
                <h3 className="text-xl font-bold text-[#d4af37] mb-2">🎁 Yankee Swap</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  A New England tradition where gifts are usually practical or nice. Often played with strict 1-swap limits per turn.
                </p>
                <span className="text-xs text-slate-400 font-semibold">Typical Gift: Gourmet syrup, Yeti mugs, board games.</span>
              </div>
            </div>
          </div>
        </section>

        {/* PARTY GAMES CROSS PROMO */}
        <section className="py-16 bg-[#0e3527] border-b border-[#1d5943]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] font-festive">
              Level Up Your Holiday Party Games
            </h2>
            <p className="mt-4 text-slate-200 max-w-xl mx-auto text-sm sm:text-base">
              Get our complete 12-in-1 Holiday Party Games printable bundle. Includes White Elephant number cards, Holiday Trivia, Most Likely To, and festive icebreakers.
            </p>
            <div className="mt-8">
              <Link
                href="/games-bundle"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#d4af37] text-[#0b2b20] font-extrabold text-base hover:bg-[#f3c053] transition shadow-lg"
              >
                <span>View Party Games Bundle ($17)</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-16 sm:py-24 bg-[#081d16] border-b border-[#1d5943]">
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
                  className="p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943]"
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
              Prefer a Traditional Secret Santa Instead?
            </h2>
            <p className="mt-4 text-slate-300 max-w-xl mx-auto text-base sm:text-lg">
              If your family or team wants private, 1-to-1 gift giving without the stealing drama, draw names online in 60 seconds with automated pair exclusions.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f3c053] hover:from-[#f3c053] hover:to-[#d4af37] text-[#0b2b20] font-extrabold text-lg shadow-2xl shadow-[#d4af37]/30 transition transform hover:-translate-y-1"
              >
                <span>Draw Names Free on The Santa Circle</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
