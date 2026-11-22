import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  Gift,
  HelpCircle,
  Users,
  Shuffle,
  EyeOff,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Generator for Secret Santa: How to Draw Names Online Fairly & Privately",
  description:
    "Draw names online for Secret Santa in 60 seconds with 100% secrecy and smart exclusion rules. Completely ad-free and no app download required.",
  alternates: {
    canonical: "/generator-for-secret-santa",
  },
  openGraph: {
    title: "Generator for Secret Santa: Draw Names Online Fairly & Privately",
    description:
      "Automated online Secret Santa generator with spouse exclusions, budget caps, and secret animated gift unboxing. 100% free and ad-free.",
    url: "https://thesantacircle.com/generator-for-secret-santa",
    type: "article",
  },
};

const FAQ_ITEMS = [
  {
    q: "Can the organizer see who has whom in an online Secret Santa?",
    a: "Not on The Santa Circle. Names are matched via an automated circular permutation and stored securely in the database. Even the circle organizer cannot see assignments, keeping the surprise intact for the host.",
  },
  {
    q: "How do exclusion rules work in a Secret Santa generator?",
    a: "Exclusion rules prevent designated pairs (such as spouses, siblings, roommates, or last year's matches) from drawing each other. When you configure a pair exclusion, the algorithm mathematically eliminates that pairing before assignments are finalized.",
  },
  {
    q: "Do participants need to download an app or create accounts?",
    a: "No app download is ever required. Participants join via an email invite or a direct share link (usable in WhatsApp, Slack, or group texts) and view their recipient directly in their mobile browser.",
  },
  {
    q: "What happens if an odd number of people join the exchange?",
    a: "Online Secret Santa generators work seamlessly with any number of participants from 3 to 500+. The engine creates a single closed loop (Person A → Person B → Person C → Person A), guaranteeing that everyone gives one gift and receives one gift.",
  },
  {
    q: "Can participants create holiday wishlists with specific links?",
    a: "Yes! Every member has a personal wishlist profile where they can specify clothing sizes, favorite colors, dislikes, and direct Amazon wishlist links.",
  },
];

export default function GeneratorForSecretSantaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "The Santa Circle - Online Secret Santa Generator",
        url: "https://thesantacircle.com/generator-for-secret-santa",
        description:
          "Free, ad-free online Secret Santa generator with smart exclusion rules, Amazon wishlists, and encrypted recipient assignments.",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Automated Circular Name Drawing",
          "Spouse & Pair Exclusions",
          "Organizer Blind Draw (Host Cannot Peek)",
          "Amazon Wishlist Integration",
          "100% Ad-Free Experience",
          "Instant Shareable Invite Link",
        ],
      },
      {
        "@type": "HowTo",
        name: "How to Draw Names for Secret Santa Online",
        description:
          "A step-by-step guide to drawing Secret Santa names online fairly, anonymously, and with zero duplicate draws.",
        step: [
          {
            "@type": "HowToStep",
            name: "Set Up Your Circle & Budget",
            text: "Create a free gift exchange circle, give it a festive title, and define a clear budget limit.",
            url: "https://thesantacircle.com/register",
          },
          {
            "@type": "HowToStep",
            name: "Invite Your Group",
            text: "Send automated email invitations or share a single direct join link in your family or team chat.",
          },
          {
            "@type": "HowToStep",
            name: "Lock In Exclusion Rules",
            text: "Mark partners, spouses, or roommates who should not draw one another.",
          },
          {
            "@type": "HowToStep",
            name: "Execute the Draw",
            text: "Click Draw Names. Each player receives a private notification to open their animated gift reveal.",
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
              <Zap className="w-4 h-4 text-[#d4af37]" />
              The Modern Name Drawer • 100% Ad-Free • Host Cannot Peek
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#fef9ee] tracking-tight font-festive leading-tight">
              Generator for Secret Santa: <span className="text-[#d4af37]">Draw Names Online Fairly & Privately</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Ditch folded scraps in a bowl, awkward redraws when couples draw each other, and legacy apps covered in ads. Set up a pristine, randomized gift exchange in under 60 seconds.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f3c053] hover:from-[#f3c053] hover:to-[#d4af37] text-[#0b2b20] font-extrabold text-base sm:text-lg shadow-xl shadow-[#d4af37]/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Draw Names Free in 60s</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/secret-santa-generator-with-exclusions"
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#144534] hover:bg-[#1d5943] text-[#fef9ee] font-bold text-sm sm:text-base border border-[#1d5943] transition flex items-center justify-center gap-2"
              >
                <span>See Exclusion Rules</span>
                <ShieldCheck className="w-4 h-4 text-[#f3c053]" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto pt-6 border-t border-[#1d5943]/60">
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                <span>Zero Self-Draws</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                <span>Spouse Exclusions</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                <span>No Mobile App Needed</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                <span>100% Ad-Free</span>
              </div>
            </div>
          </div>
        </section>

        {/* DIRECT ANSWER BOX */}
        <section className="py-12 bg-[#081d16] border-b border-[#1d5943]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0b2b20] border-2 border-[#d4af37]/40 shadow-xl relative">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#d4af37] flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4" /> Direct Answer
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#fef9ee] mb-3">
                How does an online Secret Santa generator work?
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                An online <strong>generator for Secret Santa</strong> randomly assigns each participant a secret recipient using a circular permutation algorithm. It guarantees that nobody draws themselves, prevents duplicate assignments, and allows organizers to set exclusion rules so spouses, roommates, or previous-year matches are never paired together. Platforms like <strong>The Santa Circle</strong> ensure complete privacy so even the exchange organizer cannot see who drew whom.
              </p>
            </div>
          </div>
        </section>

        {/* WHY PAPER SLIPS FAIL */}
        <section className="py-16 sm:py-20 bg-[#0b2b20] border-b border-[#1d5943]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#f3c053] uppercase tracking-widest">
                The Problem With Analog Draws
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] mt-1 font-festive">
                Why Drawing Names from a Hat Fails Every Year
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl mx-auto">
                Nearly every holiday exchange that uses slips in a bowl runs into one of these classic problems:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#0e3527] border border-[#1d5943]">
                <div className="w-10 h-10 rounded-xl bg-red-900/40 border border-red-500/40 flex items-center justify-center text-xl mb-4">
                  ❌
                </div>
                <h3 className="font-bold text-lg text-[#fef9ee] mb-2">The Self-Draw Nightmare</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Inevitably, someone unfolds a slip, sighs, and says <em>"I drew myself."</em> Everyone has to re-fold their slips and draw all over again.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0e3527] border border-[#1d5943]">
                <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-500/40 flex items-center justify-center text-xl mb-4">
                  ⚠️
                </div>
                <h3 className="font-bold text-lg text-[#fef9ee] mb-2">The Spouse Conundrum</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Partners and roommates who share finances or live under the same roof draw each other, destroying the fun of buying an unexpected gift.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0e3527] border border-[#1d5943]">
                <div className="w-10 h-10 rounded-xl bg-blue-900/40 border border-blue-500/40 flex items-center justify-center text-xl mb-4">
                  👀
                </div>
                <h3 className="font-bold text-lg text-[#fef9ee] mb-2">The Organizer Peek</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  To keep track of matches for absentee members, the host writes down the master list on a notepad, spoiling the holiday surprise for themselves.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STEP BY STEP GUIDE */}
        <section className="py-16 sm:py-24 bg-[#081d16] border-b border-[#1d5943]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-[#f3c053] uppercase tracking-widest">
                Simple 4-Step Process
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] mt-1 font-festive">
                How to Draw Names Online in Under 60 Seconds
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl mx-auto">
                No apps to download, no complicated passwords, and zero banner ads.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4 p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943]">
                <div className="w-10 h-10 rounded-full bg-[#d4af37] text-[#0b2b20] font-black flex items-center justify-center shrink-0 text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#fef9ee] mb-1">Set Up Your Circle</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Name your circle (e.g., <em>"Marketing Team Secret Santa"</em> or <em>"Smith Family Christmas"</em>) and define your budget cap (e.g., $25) and party date.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943]">
                <div className="w-10 h-10 rounded-full bg-[#d4af37] text-[#0b2b20] font-black flex items-center justify-center shrink-0 text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#fef9ee] mb-1">Invite Members with One Link</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Send email invites or copy your circle’s private join link to paste into WhatsApp, Slack, or SMS. Members RSVP in one click.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943]">
                <div className="w-10 h-10 rounded-full bg-[#d4af37] text-[#0b2b20] font-black flex items-center justify-center shrink-0 text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#fef9ee] mb-1">Add Smart Exclusion Rules</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Prevent couples, roommates, or previous-year pairs from drawing each other. The algorithm pre-validates rules to guarantee a viable circle.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943]">
                <div className="w-10 h-10 rounded-full bg-[#d4af37] text-[#0b2b20] font-black flex items-center justify-center shrink-0 text-lg">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#fef9ee] mb-1">Click Draw & Unbox</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Names are drawn instantly in an encrypted database transaction. Participants receive private links to open an animated unboxing reveal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON MATRIX */}
        <section className="py-16 sm:py-24 bg-[#0b2b20] border-b border-[#1d5943]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#f3c053] uppercase tracking-widest">
                Feature Comparison
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] mt-1 font-festive">
                How The Santa Circle Compares
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl mx-auto">
                Why modern organizers switch from legacy apps to The Santa Circle.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#1d5943] shadow-2xl">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-[#081d16] text-xs uppercase tracking-wider text-[#d4af37] border-b border-[#1d5943]">
                  <tr>
                    <th className="py-4 px-6">Feature</th>
                    <th className="py-4 px-6">Paper in a Hat</th>
                    <th className="py-4 px-6">Legacy Ad-Heavy Apps</th>
                    <th className="py-4 px-6 bg-[#144534] text-[#fef9ee] font-bold">The Santa Circle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1d5943]">
                  <tr className="bg-[#0b2b20]/60 hover:bg-[#0e3527]/40">
                    <td className="py-4 px-6 font-semibold text-[#fef9ee]">Ad-Free Experience</td>
                    <td className="py-4 px-6 text-slate-400">Yes</td>
                    <td className="py-4 px-6 text-red-400">❌ Popups & Banner Ads</td>
                    <td className="py-4 px-6 bg-[#144534]/40 font-bold text-[#f3c053]">✓ 100% Ad-Free</td>
                  </tr>
                  <tr className="bg-[#0b2b20]/60 hover:bg-[#0e3527]/40">
                    <td className="py-4 px-6 font-semibold text-[#fef9ee]">No App Download Required</td>
                    <td className="py-4 px-6 text-slate-400">Yes</td>
                    <td className="py-4 px-6 text-red-400">❌ Pushes App Store Downloads</td>
                    <td className="py-4 px-6 bg-[#144534]/40 font-bold text-[#f3c053]">✓ Clean Web Link</td>
                  </tr>
                  <tr className="bg-[#0b2b20]/60 hover:bg-[#0e3527]/40">
                    <td className="py-4 px-6 font-semibold text-[#fef9ee]">Host Cannot Peek</td>
                    <td className="py-4 px-6 text-red-400">❌ Organizer often knows</td>
                    <td className="py-4 px-6 text-amber-400">⚠️ Often visible to admin</td>
                    <td className="py-4 px-6 bg-[#144534]/40 font-bold text-[#f3c053]">✓ Fully Concealed</td>
                  </tr>
                  <tr className="bg-[#0b2b20]/60 hover:bg-[#0e3527]/40">
                    <td className="py-4 px-6 font-semibold text-[#fef9ee]">Spouse & Pair Exclusions</td>
                    <td className="py-4 px-6 text-red-400">❌ Forces Redraws</td>
                    <td className="py-4 px-6 text-slate-400">Clunky menus</td>
                    <td className="py-4 px-6 bg-[#144534]/40 font-bold text-[#f3c053]">✓ 1-Click 2-Way Pairing</td>
                  </tr>
                  <tr className="bg-[#0b2b20]/60 hover:bg-[#0e3527]/40">
                    <td className="py-4 px-6 font-semibold text-[#fef9ee]">Amazon Wishlists</td>
                    <td className="py-4 px-6 text-red-400">❌ Manual texts</td>
                    <td className="py-4 px-6 text-slate-400">Proprietary stores</td>
                    <td className="py-4 px-6 bg-[#144534]/40 font-bold text-[#f3c053]">✓ Direct Amazon Links</td>
                  </tr>
                  <tr className="bg-[#0b2b20]/60 hover:bg-[#0e3527]/40">
                    <td className="py-4 px-6 font-semibold text-[#fef9ee]">Recipient Reveal</td>
                    <td className="py-4 px-6 text-slate-400">Plain paper</td>
                    <td className="py-4 px-6 text-slate-400">Plain email</td>
                    <td className="py-4 px-6 bg-[#144534]/40 font-bold text-[#f3c053]">✓ Animated 3D Unboxing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-16 sm:py-24 bg-[#081d16] border-b border-[#1d5943]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#f3c053] uppercase tracking-widest">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] mt-1 font-festive">
                Everything You Need to Know
              </h2>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((faq, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943] hover:border-[#d4af37]/50 transition"
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
            <div className="w-16 h-16 rounded-2xl bg-[#144534] border border-[#d4af37]/40 flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl">
              🎁
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#fef9ee] font-festive">
              Ready to Draw Names for Your Gift Exchange?
            </h2>
            <p className="mt-4 text-slate-300 max-w-xl mx-auto text-base sm:text-lg">
              Set up your circle in 60 seconds, prevent couples from drawing each other, and enjoy a completely ad-free holiday celebration.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f3c053] hover:from-[#f3c053] hover:to-[#d4af37] text-[#0b2b20] font-extrabold text-lg shadow-2xl shadow-[#d4af37]/30 transition transform hover:-translate-y-1"
              >
                <span>Start Your Free Circle Now</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
