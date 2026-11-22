import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Gift,
  CheckCircle2,
  HelpCircle,
  ShoppingBag,
  Heart,
  AlertCircle,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Secret Santa Wishlist: How to Write One Your Giver Will Actually Use",
  description:
    "Learn the 3-tier formula for writing the perfect Secret Santa wishlist. Includes Amazon wishlist tips, price-tier examples, and what to avoid putting on your list.",
  alternates: {
    canonical: "/secret-santa-wishlist",
  },
  openGraph: {
    title: "Secret Santa Wishlist Guide: How to Write One Your Giver Will Love",
    description:
      "Avoid getting generic socks and candles. Here is the exact formula for writing a helpful Secret Santa wishlist with direct Amazon links and clothing sizes.",
    url: "https://thesantacircle.com/secret-santa-wishlist",
    type: "article",
  },
};

const FAQ_ITEMS = [
  {
    q: "How many items should I put on a Secret Santa wishlist?",
    a: "The ideal number is 3 to 5 items across varied price points within the group's budget. Giving your Santa options ensures you get something you actually like while still keeping the final gift a surprise.",
  },
  {
    q: "Can I add direct Amazon wishlist links on The Santa Circle?",
    a: "Yes! The Santa Circle features built-in Amazon wishlist integration. You can paste your public Amazon wishlist URL directly into your profile so your Secret Santa can buy with 1-click delivery.",
  },
  {
    q: "Is it rude to ask for specific items in Secret Santa?",
    a: "No! In fact, most gift-givers feel relieved when their recipient provides specific ideas, links, or preferences. It eliminates shopping anxiety and prevents wasted money on unwanted gifts.",
  },
  {
    q: "What should I include besides specific product links?",
    a: "Always include helpful contextual preferences: your shirt/shoe size, favorite snacks or coffee beans, favorite colors, scents you dislike, and whether you prefer physical items or practical consumables.",
  },
];

export default function SecretSantaWishlistPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Secret Santa Wishlist: How to Write One Your Giver Will Actually Use",
        description:
          "The complete guide to writing a helpful, thoughtful Secret Santa wishlist that prevents awkward gifts and simplifies holiday shopping.",
        url: "https://thesantacircle.com/secret-santa-wishlist",
        author: {
          "@type": "Organization",
          name: "The Santa Circle",
          url: "https://thesantacircle.com",
        },
      },
      {
        "@type": "HowTo",
        name: "How to Build a Secret Santa Wishlist",
        description:
          "A step-by-step formula for creating a balanced, helpful Secret Santa wishlist that respects group budgets and retains the magic of surprise.",
        step: [
          {
            "@type": "HowToStep",
            name: "Provide a Budget-Floor Item ($10 - $15)",
            text: "Give an accessible starter item like premium coffee, gourmet chocolate, or a fun desk accessory.",
          },
          {
            "@type": "HowToStep",
            name: "Provide a Budget-Cap Item (The Full $25 Limit)",
            text: "List a marquee item you've been wanting, such as a bestselling book, portable charger, or insulated tumbler.",
          },
          {
            "@type": "HowToStep",
            name: "Add Sizes & Dislikes",
            text: "State your clothing sizes, dietary restrictions (e.g., nut allergy, gluten-free), and scents you dislike.",
          },
          {
            "@type": "HowToStep",
            name: "Paste Your Amazon Wishlist Link",
            text: "Add your Amazon link to The Santa Circle so your secret giver can order in seconds.",
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
              <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
              The 3-Tier Wishlist Formula • Amazon Integration • Zero Awkward Gifts
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#fef9ee] tracking-tight font-festive leading-tight">
              Secret Santa Wishlist: <span className="text-[#d4af37]">How to Write One Your Giver Will Love</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Tired of receiving generic scented candles, novelty socks, or oversized coffee mugs? Here is the exact formula for building a wishlist that respects the budget and keeps the surprise alive.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f3c053] hover:from-[#f3c053] hover:to-[#d4af37] text-[#0b2b20] font-extrabold text-base sm:text-lg shadow-xl shadow-[#d4af37]/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Create Your Wishlist on The Santa Circle</span>
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

        {/* DIRECT ANSWER SNIPPET BOX */}
        <section className="py-12 bg-[#081d16] border-b border-[#1d5943]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0b2b20] border-2 border-[#d4af37]/40 shadow-xl relative">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#d4af37] flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4" /> Quick Formula
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#fef9ee] mb-3">
                What should you put on a Secret Santa wishlist?
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                The most effective Secret Santa wishlist follows the <strong>3-tier formula</strong>: (1) one lower-cost consumable or treat ($10–$15), (2) two distinct gift options at the exact budget cap (e.g. $25), and (3) personal preferences like clothing sizes, favorite colors, and disliked scents. Providing a direct <strong>Amazon Wishlist link</strong> allows your giver to purchase in one click while ensuring the final choice remains a genuine surprise.
              </p>
            </div>
          </div>
        </section>

        {/* THE 3-TIER WISHLIST FORMULA */}
        <section className="py-16 sm:py-24 bg-[#0b2b20] border-b border-[#1d5943]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-[#f3c053] uppercase tracking-widest">
                The Winning Strategy
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] mt-1 font-festive">
                The 3-Tier Secret Santa Wishlist Formula
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl mx-auto">
                Giving your Santa three clear choices guarantees you get something you adore without making them feel like a personal shopping service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#0e3527] border border-[#1d5943]">
                <div className="w-10 h-10 rounded-xl bg-[#144534] border border-[#d4af37]/40 flex items-center justify-center text-xl mb-4">
                  ☕
                </div>
                <h3 className="font-bold text-lg text-[#fef9ee] mb-2">Tier 1: Consumable Treat ($10–$15)</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Items that get consumed and don’t clutter your house. Examples: single-origin whole bean coffee, artisanal hot honey, holiday tea sampler, or gourmet chocolates.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0e3527] border border-[#1d5943]">
                <div className="w-10 h-10 rounded-xl bg-[#144534] border border-[#d4af37]/40 flex items-center justify-center text-xl mb-4">
                  🎯
                </div>
                <h3 className="font-bold text-lg text-[#fef9ee] mb-2">Tier 2: The Budget Cap Pick ($20–$25)</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  A tangible item right at the agreed spending ceiling. Examples: stainless steel Yeti tumbler, hardcover bestseller book, wool beanie, or a desktop wireless charging pad.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0e3527] border border-[#1d5943]">
                <div className="w-10 h-10 rounded-xl bg-[#144534] border border-[#d4af37]/40 flex items-center justify-center text-xl mb-4">
                  🎨
                </div>
                <h3 className="font-bold text-lg text-[#fef9ee] mb-2">Tier 3: The Wildcard Hobby Item</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Something tied to a specific pastime. Examples: gardening shears, cocktail bitters, running socks, a travel card game, or watercolor brush pens.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 MISTAKES TO AVOID */}
        <section className="py-16 sm:py-24 bg-[#081d16] border-b border-[#1d5943]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#f3c053] uppercase tracking-widest">
                What Not to Do
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#fef9ee] mt-1 font-festive">
                4 Things to NEVER Put on a Secret Santa Wishlist
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#0b2b20] border border-red-500/30 flex gap-4">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-[#fef9ee] mb-1">1. "Anything is fine / Surprise me!"</h3>
                  <p className="text-sm text-slate-300">
                    This is the #1 anxiety-inducing response for a gift-giver. It forces your Santa to guess and usually results in generic desk trinkets or drugstore bath bombs.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0b2b20] border border-red-500/30 flex gap-4">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-[#fef9ee] mb-1">2. Only listing ONE exact item</h3>
                  <p className="text-sm text-slate-300">
                    If you only link one item and it goes out of stock or exceeds budget after shipping, your Santa is stranded with no backup plan.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0b2b20] border border-red-500/30 flex gap-4">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-[#fef9ee] mb-1">3. Items over the group budget</h3>
                  <p className="text-sm text-slate-300">
                    If your circle has a $25 limit, don’t link a $50 sweater hoping they’ll pay extra. It creates unfair social pressure and awkwardness.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0b2b20] border border-red-500/30 flex gap-4">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-[#fef9ee] mb-1">4. High-risk personal items without sizes</h3>
                  <p className="text-sm text-slate-300">
                    Never ask for "jeans" or "cologne" without specifying your exact waist/inseam measurements or fragrance brands. Fit and scent are intensely subjective.
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
              Add Your Wishlist on The Santa Circle
            </h2>
            <p className="mt-4 text-slate-300 max-w-xl mx-auto text-base sm:text-lg">
              Set up your free gift circle, attach your Amazon links and clothing sizes, and ensure everyone gets gifts they actually treasure.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f3c053] hover:from-[#f3c053] hover:to-[#d4af37] text-[#0b2b20] font-extrabold text-lg shadow-2xl shadow-[#d4af37]/30 transition transform hover:-translate-y-1"
              >
                <span>Create Free Circle & Wishlist</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
