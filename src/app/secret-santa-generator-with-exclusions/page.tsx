import type { Metadata } from "next";
import Link from "next/link";
import ExclusionSimulator from "./ExclusionSimulator";
import {
  ShieldCheck,
  Sparkles,
  Gift,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  HeartHandshake,
  Users,
  Lock,
  Smartphone,
  Ban,
  Clock,
  Shuffle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Secret Santa Generator with Exclusions | 100% Ad-Free",
  description:
    "Organize your gift exchange in 60 seconds with automated pair exclusions. Prevent spouses, partners, and roommates from drawing each other. 100% ad-free & no app required.",
  alternates: {
    canonical: "/secret-santa-generator-with-exclusions",
  },
  openGraph: {
    title: "Secret Santa Generator with Exclusions | The Santa Circle",
    description:
      "Prevent couples, roommates, and last year's pairs from drawing each other. 100% ad-free Secret Santa generator with smart exclusion rules.",
    url: "https://thesantacircle.com/secret-santa-generator-with-exclusions",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "Can Secret Santa prevent spouses and couples from drawing each other?",
    a: "Yes! The Santa Circle features automated 2-Way Pair Exclusions. When you mark two people as partners or spouses, the drawing engine mathematically guarantees they will never draw each other, eliminating awkward redraws.",
  },
  {
    q: "Do my family members or coworkers need to download an app?",
    a: "No app download is ever required. The Santa Circle is a modern web application that works seamlessly on iPhone, Android, tablets, and desktops via a direct link or email invite.",
  },
  {
    q: "Is this Secret Santa generator really 100% ad-free?",
    a: "Yes. Unlike legacy Secret Santa websites that flood your screen with banner ads, auto-playing videos, and tracking scripts, The Santa Circle is completely ad-free for an elegant, stress-free holiday experience.",
  },
  {
    q: "What happens if we set too many exclusion rules in our group?",
    a: "When a group has too many overlapping exclusions, a mathematical deadlock can occur where no valid circular draw exists. The Santa Circle's engine automatically pre-validates your rules before running the final draw, alerting you if an impossible combination was requested.",
  },
  {
    q: "Can we include Amazon wishlists with our Secret Santa exchange?",
    a: "Yes! Every member can add their clothing and shoe sizes, favorite colors, and direct Amazon wishlist links so their secret gift giver never has to guess what to buy.",
  },
];

export default function ExclusionsLandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "The Santa Circle - Secret Santa Generator with Exclusions",
        url: "https://thesantacircle.com/secret-santa-generator-with-exclusions",
        description:
          "Modern, ad-free online Secret Santa generator with smart exclusion rules, Amazon wishlists, and private animated unboxing reveals.",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Smart Pair Exclusions for Couples & Spouses",
          "100% Ad-Free Experience",
          "No Mandatory App Download",
          "Amazon Wishlist Integration",
          "Instant Share Link & Email Invitations",
          "Animated Private Unboxing Reveal",
        ],
      },
      {
        "@type": "HowTo",
        name: "How to Set Up Secret Santa with Exclusion Rules",
        description:
          "Step-by-step guide to organizing a gift exchange where spouses and partners do not draw each other.",
        step: [
          {
            "@type": "HowToStep",
            name: "Create Your Circle",
            text: "Create a free circle at The Santa Circle and set your budget or spending limits.",
            url: "https://thesantacircle.com/register",
          },
          {
            "@type": "HowToStep",
            name: "Invite Participants",
            text: "Add family, friends, or coworkers by sharing an instant join link or sending email invitations.",
          },
          {
            "@type": "HowToStep",
            name: "Set Exclusion Rules",
            text: "Select couples, roommates, or previous-year pairs to prevent them from drawing each other.",
          },
          {
            "@type": "HowToStep",
            name: "Draw Names Automatically",
            text: "Click Draw Names. The engine executes a secret circular shuffle that respects every exclusion rule.",
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
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#144534] border border-[#d4af37]/50 text-xs sm:text-sm font-bold text-[#f3c053] shadow-lg mb-6">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              Smart Pair Exclusions • 100% Ad-Free • Zero App Installs
            </div>

            {/* H1 */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#fef9ee] tracking-tight font-festive leading-tight">
              Secret Santa Generator with <span className="text-[#d4af37]">Smart Exclusions</span>
            </h1>

            {/* Subhead */}
            <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Tired of husbands drawing wives, roommates drawing each other, or folded paper scraps from a hat? 
              Set up your gift exchange in 60 seconds with automated pair exclusions and zero annoying ads.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f3c053] hover:from-[#f3c053] hover:to-[#d4af37] text-[#0b2b20] font-extrabold text-base sm:text-lg shadow-xl shadow-[#d4af37]/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Create Free Circle with Exclusions</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#simulator"
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#144534] hover:bg-[#1d5943] text-[#fef9ee] font-bold text-sm sm:text-base border border-[#1d5943] transition flex items-center justify-center gap-2"
              >
                <span>Try Interactive Simulator</span>
                <Shuffle className="w-4 h-4 text-[#f3c053]" />
              </a>
            </div>

            {/* Trust Points */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto pt-6 border-t border-[#1d5943]/60">
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                <span>Spouses Never Match</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                <span>100% Ad-Free</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                <span>No App Download</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                <span>Amazon Wishlists</span>
              </div>
            </div>
          </div>
        </section>

        {/* GOOGLE DIRECT ANSWER SNIPPET BOX */}
        <section className="py-12 bg-[#081d16] border-b border-[#1d5943]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0b2b20] border-2 border-[#d4af37]/40 shadow-xl relative">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#d4af37] flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4" /> Quick Answer
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#fef9ee] mb-3">
                What is a Secret Santa generator with exclusions?
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                A <strong>Secret Santa generator with exclusions</strong> is an online drawing tool that lets organizers set custom rules preventing specific participants (such as married couples, roommates, or previous-year pairs) from drawing one another. Modern platforms like <strong>The Santa Circle</strong> automate this mathematical matching instantly, guaranteeing complete privacy and zero collisions without requiring participants to download an app or view banner ads.
              </p>
            </div>
          </div>
        </section>

        {/* INTERACTIVE SIMULATOR SECTION */}
        <section id="simulator" className="py-16 sm:py-24 bg-[#0b2b20]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-[#f3c053] uppercase tracking-widest">
                Interactive Tool
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] mt-1 font-festive">
                See How Exclusion Rules Work in Real Time
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl mx-auto">
                Test the difference between an unmanaged drawing (where spouses accidentally draw each other) and The Santa Circle’s automated pair exclusion algorithm.
              </p>
            </div>

            <ExclusionSimulator />
          </div>
        </section>

        {/* 4 CORE EXCLUSION RULES */}
        <section className="py-16 bg-[#081d16] border-t border-b border-[#1d5943]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#f3c053] uppercase tracking-widest">
                Rule Framework
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] mt-1 font-festive">
                The 4 Most Common Secret Santa Exclusion Rules
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl mx-auto">
                Setting draw restrictions saves your holiday exchange from awkward redraws, redundant gift-giving, and spoiled surprises.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943] hover:border-[#d4af37]/60 transition">
                <div className="w-10 h-10 rounded-xl bg-[#144534] border border-[#d4af37]/40 flex items-center justify-center text-xl mb-4">
                  💍
                </div>
                <h3 className="text-lg font-bold text-[#fef9ee]">1. The Spouse & Partner Rule</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Couples already exchange gifts privately and share a household budget. When spouses draw each other in a family exchange, it feels redundant and takes away the fun of gifting another relative. Our 2-way exclusion blocks both partners from drawing each other.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943] hover:border-[#d4af37]/60 transition">
                <div className="w-10 h-10 rounded-xl bg-[#144534] border border-[#d4af37]/40 flex items-center justify-center text-xl mb-4">
                  📦
                </div>
                <h3 className="text-lg font-bold text-[#fef9ee]">2. The Roommate & Housemate Rule</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  When roommates or siblings living under the same roof draw each other, packages arriving at the doorstep instantly ruin the secret. Excluding housemates ensures gifts are delivered and revealed with true secrecy.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943] hover:border-[#d4af37]/60 transition">
                <div className="w-10 h-10 rounded-xl bg-[#144534] border border-[#d4af37]/40 flex items-center justify-center text-xl mb-4">
                  🔄
                </div>
                <h3 className="text-lg font-bold text-[#fef9ee]">3. The Previous-Year Repeat Rule</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Nothing deflates excitement like drawing the exact same cousin or coworker two years in a row. Setting a restriction based on last year’s assignments keeps your annual gift exchange fresh and unpredictable.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943] hover:border-[#d4af37]/60 transition">
                <div className="w-10 h-10 rounded-xl bg-[#144534] border border-[#d4af37]/40 flex items-center justify-center text-xl mb-4">
                  👔
                </div>
                <h3 className="text-lg font-bold text-[#fef9ee]">4. The Workplace Hierarchy Rule</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  In company or remote team exchanges, preventing managers from drawing their direct reports eliminates any awkward feelings of obligation or perceived favoritism, keeping workplace exchanges comfortable for all employees.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW EXCLUSIONS WORK (1-WAY VS 2-WAY) */}
        <section className="py-16 sm:py-20 bg-[#0b2b20]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fef9ee] text-center font-festive mb-8">
              Understanding 2-Way vs. 1-Way Exclusion Rules
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-[#1d5943] bg-[#144534]/50 shadow-xl">
              <table className="w-full text-left text-xs sm:text-sm text-slate-200">
                <thead className="bg-[#0b2b20] text-[#f3c053] uppercase text-[11px] font-bold border-b border-[#1d5943]">
                  <tr>
                    <th className="py-4 px-4 sm:px-6">Rule Type</th>
                    <th className="py-4 px-4 sm:px-6">How It Works</th>
                    <th className="py-4 px-4 sm:px-6">Best Used For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1d5943]/60">
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-white">2-Way Mutual Exclusion</td>
                    <td className="py-4 px-4 sm:px-6">
                      Person A cannot draw Person B, <strong>and</strong> Person B cannot draw Person A.
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-[#d4af37]">Spouses, partners, couples, roommates</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-white">1-Way Direct Exclusion</td>
                    <td className="py-4 px-4 sm:px-6">
                      Person A cannot draw Person B, <strong>but</strong> Person B can still draw Person A.
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-[#d4af37]">Office hierarchy, avoiding last year&apos;s exact giver</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Warning Callout on Deadlock */}
            <div className="mt-8 p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-200">
                <strong className="text-amber-300">The Over-Exclusion Mathematical Trap:</strong> If a group of 4 people has 3 mutual exclusions, a circular match is mathematically impossible. The Santa Circle solves this by running an automated Hamiltonian cycle validator before confirming assignments, warning you in advance so your draw never breaks.
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="py-16 bg-[#081d16] border-t border-b border-[#1d5943]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-[#f3c053] uppercase tracking-widest">
                Platform Comparison
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] mt-1 font-festive">
                How The Santa Circle Compares
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#1d5943] bg-[#0b2b20] shadow-2xl">
              <table className="w-full text-left text-xs sm:text-sm text-slate-200">
                <thead className="bg-[#144534] text-[#fef9ee] uppercase text-[11px] font-bold border-b border-[#1d5943]">
                  <tr>
                    <th className="py-4 px-4 sm:px-6">Feature</th>
                    <th className="py-4 px-4 sm:px-6 text-[#d4af37]">The Santa Circle</th>
                    <th className="py-4 px-4 sm:px-6">Elfster</th>
                    <th className="py-4 px-4 sm:px-6">DrawNames</th>
                    <th className="py-4 px-4 sm:px-6">Paper in a Hat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1d5943]/60">
                  <tr>
                    <td className="py-3.5 px-4 sm:px-6 font-medium">Smart Pair Exclusions</td>
                    <td className="py-3.5 px-4 sm:px-6 text-emerald-400 font-bold">✅ Yes (Automated)</td>
                    <td className="py-3.5 px-4 sm:px-6">✅ Yes</td>
                    <td className="py-3.5 px-4 sm:px-6">✅ Yes</td>
                    <td className="py-3.5 px-4 sm:px-6 text-red-400">❌ No (Manual redraws)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 sm:px-6 font-medium">100% Ad-Free Experience</td>
                    <td className="py-3.5 px-4 sm:px-6 text-emerald-400 font-bold">✅ 100% Clean</td>
                    <td className="py-3.5 px-4 sm:px-6 text-red-400">❌ Heavy Ads & Promos</td>
                    <td className="py-3.5 px-4 sm:px-6 text-red-400">❌ Banner & Video Ads</td>
                    <td className="py-3.5 px-4 sm:px-6 text-emerald-400">✅ Clean</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 sm:px-6 font-medium">No App Download Required</td>
                    <td className="py-3.5 px-4 sm:px-6 text-emerald-400 font-bold">✅ Any Web Browser</td>
                    <td className="py-3.5 px-4 sm:px-6 text-red-400">❌ App Store Push</td>
                    <td className="py-3.5 px-4 sm:px-6 text-emerald-400">✅ Web Based</td>
                    <td className="py-3.5 px-4 sm:px-6 text-emerald-400">✅ Physical</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 sm:px-6 font-medium">Integrated Amazon Wishlists</td>
                    <td className="py-3.5 px-4 sm:px-6 text-emerald-400 font-bold">✅ Included Free</td>
                    <td className="py-3.5 px-4 sm:px-6">✅ Included</td>
                    <td className="py-3.5 px-4 sm:px-6">✅ Included</td>
                    <td className="py-3.5 px-4 sm:px-6 text-red-400">❌ Manual Lists</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 sm:px-6 font-medium">Animated Unboxing Reveal</td>
                    <td className="py-3.5 px-4 sm:px-6 text-emerald-400 font-bold">✅ Custom Animation</td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-400">Standard Text</td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-400">Standard Text</td>
                    <td className="py-3.5 px-4 sm:px-6 text-red-400">❌ None</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* STEP BY STEP HOW TO */}
        <section className="py-16 sm:py-24 bg-[#0b2b20]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#f3c053] uppercase tracking-widest">
                Quick Setup
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] mt-1 font-festive">
                How to Set Up Exclusions in 4 Simple Steps
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 p-5 rounded-2xl bg-[#144534]/60 border border-[#1d5943]">
                <div className="w-8 h-8 rounded-full bg-[#d4af37] text-[#0b2b20] font-extrabold flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#fef9ee]">Create Your Free Circle</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Sign up with your name and email. Name your exchange (e.g., &quot;Smith Family Christmas 2026&quot; or &quot;Marketing Team Secret Santa&quot;) and set your gift spending limit.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-[#144534]/60 border border-[#1d5943]">
                <div className="w-8 h-8 rounded-full bg-[#d4af37] text-[#0b2b20] font-extrabold flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#fef9ee]">Invite Your Participants</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Send automated invites via email or copy your unique Circle share link and text it directly via SMS, iMessage, or WhatsApp.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-[#144534]/60 border border-[#1d5943]">
                <div className="w-8 h-8 rounded-full bg-[#d4af37] text-[#0b2b20] font-extrabold flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#fef9ee]">Select Excluded Pairs</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    In your Circle Admin panel, click <strong>Exclusions</strong>. Pair up spouses, partners, or roommates. The system locks them out of drawing each other automatically.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-[#144534]/60 border border-[#1d5943]">
                <div className="w-8 h-8 rounded-full bg-[#d4af37] text-[#0b2b20] font-extrabold flex items-center justify-center flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#fef9ee]">Draw Names with 100% Secrecy</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Click <strong>Draw Names</strong>. Each member receives a private email or login link directing them to their interactive unboxing reveal. Even the organizer doesn&apos;t see who drew whom!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-16 bg-[#081d16] border-t border-[#1d5943]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#f3c053] uppercase tracking-widest">
                Common Questions
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] mt-1 font-festive">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((faq, index) => (
                <div
                  key={index}
                  className="p-5 sm:p-6 rounded-2xl bg-[#0b2b20] border border-[#1d5943]"
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

        {/* BOTTOM FINAL CONVERSION HERO */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-[#0b2b20] to-[#071d15] border-t border-[#1d5943] text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-3xl sm:text-4xl">🎄 🎁 🎅</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#fef9ee] mt-4 font-festive">
              Ready to Run a Hassle-Free Secret Santa?
            </h2>
            <p className="text-sm sm:text-lg text-slate-300 mt-3 max-w-2xl mx-auto">
              Join thousands of families and teams using The Santa Circle. 100% ad-free, automated pair exclusions, and instant setup in 60 seconds.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f3c053] hover:from-[#f3c053] hover:to-[#d4af37] text-[#0b2b20] font-extrabold text-base sm:text-lg shadow-xl shadow-[#d4af37]/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Start Your Free Circle Today</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/gift-guides"
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#144534] hover:bg-[#1d5943] text-[#fef9ee] font-bold text-sm sm:text-base border border-[#1d5943] transition flex items-center justify-center gap-2"
              >
                <span>Browse Gift Guides Under $25</span>
                <Gift className="w-4 h-4 text-[#f3c053]" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
