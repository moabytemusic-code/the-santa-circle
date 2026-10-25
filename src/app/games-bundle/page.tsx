"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Gift,
  Sparkles,
  CheckCircle,
  Download,
  Star,
  Printer,
  FileText,
  HelpCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  Loader2,
} from "lucide-react";

function GamesBundleContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#d4af37", "#144534", "#ffffff", "#9b111e"],
        });
      } catch {
        // ignore if canvas not ready
      }
    }
  }, [isSuccess]);

  const handleBuy = async () => {
    setLoadingCheckout(true);
    try {
      const res = await fetch("/api/billing/digital-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: "holiday_games_bundle_2026" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to start checkout");
      }
    } catch (err: any) {
      alert(err.message || "Failed to connect to checkout. Please try again.");
      setLoadingCheckout(false);
    }
  };

  const handleDownloadDemo = () => {
    // Generate a printable holiday games rules cheat sheet in a new printable window
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>The Ultimate Holiday Party Games Pack - Print Ready</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto; line-height: 1.6; }
          h1 { color: #0b2b20; border-bottom: 3px solid #d4af37; padding-bottom: 10px; font-size: 26px; }
          h2 { color: #144534; margin-top: 30px; font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .card { border: 2px dashed #999; padding: 15px; margin: 10px 0; border-radius: 8px; page-break-inside: avoid; }
          .card-title { font-weight: bold; font-size: 16px; color: #9b111e; }
          .badge { display: inline-block; background: #d4af37; color: #0b2b20; font-weight: bold; font-size: 11px; padding: 3px 8px; border-radius: 4px; }
          @media print { body { padding: 0; } button { display: none; } }
        </style>
      </head>
      <body>
        <div style="text-align: right;"><button onclick="window.print()" style="padding: 10px 20px; background: #d4af37; border: none; font-weight: bold; border-radius: 8px; cursor: pointer;">🖨️ Print This Pack</button></div>
        <h1>🎄 The Ultimate Holiday Party Games & Icebreaker Pack</h1>
        <p><strong>The Santa Circle Edition (2026)</strong> &bull; Ready to print on standard letter paper.</p>
        
        <h2>🎲 PART 1: Dirty Santa / White Elephant Action Cards (Cut out along dashed lines)</h2>
        <div class="card">
          <span class="badge">ACTION CARD 1</span>
          <div class="card-title">🔄 The Grand Heist</div>
          <p>Steal ANY unwrapped gift in the room, even if it has already been stolen twice. The victim must immediately unwrap a new gift from under the tree.</p>
        </div>
        <div class="card">
          <span class="badge">ACTION CARD 2</span>
          <div class="card-title">🛡️ The Festive Freeze</div>
          <p>Place this card on your chosen gift. That gift is now permanently locked and can NEVER be stolen for the rest of the game!</p>
        </div>
        <div class="card">
          <span class="badge">ACTION CARD 3</span>
          <div class="card-title">🎁 The Mystery Box Swap</div>
          <p>Swap your gift with anyone wearing red or green right now without looking inside the box first!</p>
        </div>
        <div class="card">
          <span class="badge">ACTION CARD 4</span>
          <div class="card-title">👑 The Host Prerogative</div>
          <p>Swap your gift with the party host. If you ARE the host, swap with the person on your right!</p>
        </div>

        <h2>🎵 PART 2: Christmas Song Emoji Pictionary</h2>
        <ol>
          <li>🎅🏿🚪🚶‍♂️💨 ➡️ <em>Santa Claus is Coming to Town</em></li>
          <li>🤫🌃✨ ➡️ <em>Silent Night</em></li>
          <li>🔔🔔🔔🎶 ➡️ <em>Jingle Bells</em></li>
          <li>👶❄️🥶 ➡️ <em>Baby It's Cold Outside</em></li>
          <li>🛷🛷🛷💨 ➡️ <em>Sleigh Ride</em></li>
        </ol>

        <h2>🎄 PART 3: Holiday Movie Trivia Showdown</h2>
        <p><strong>Q1:</strong> In <em>Home Alone</em>, where are the McCallisters going on vacation when they leave Kevin behind?<br/><strong>A:</strong> Paris, France.</p>
        <p><strong>Q2:</strong> What is the first rule in <em>The Code of Elves</em> in the movie <em>Elf</em>?<br/><strong>A:</strong> Treat every day like Christmas.</p>
        <p><strong>Q3:</strong> What phrase does the conductor punch into the boy's ticket in <em>The Polar Express</em>?<br/><strong>A:</strong> BELIEVE.</p>

        <p style="text-align: center; margin-top: 40px; color: #777; font-size: 12px;">© The Santa Circle &bull; https://thesantacircle.com</p>
      </body>
      </html>
    `);
    win.document.close();
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
        <div className="festive-card p-8 sm:p-12 rounded-3xl border-2 border-[#d4af37] shadow-2xl bg-gradient-to-b from-[#144534] to-[#0b2b20] space-y-6">
          <div className="w-16 h-16 bg-[#d4af37]/20 border-2 border-[#d4af37] rounded-full flex items-center justify-center mx-auto text-[#d4af37]">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#f3c053]">
              Payment Confirmed &bull; Order Complete
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-festive text-[#fef9ee]">
              Your Holiday Party Games Pack is Ready! 🎁
            </h1>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Thank you for supporting The Santa Circle. Your printable games pack is ready to print right now. A confirmation copy has also been logged.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleDownloadDemo}
              className="px-8 py-4 rounded-2xl bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-extrabold text-base transition shadow-xl flex items-center space-x-2"
            >
              <Printer className="w-5 h-5" />
              <span>Print / Save Games PDF Now</span>
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-4 rounded-2xl bg-[#144534] hover:bg-[#1d5943] text-[#fef9ee] font-semibold text-sm transition border border-[#1d5943]"
            >
              Back to Circle App
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3c053] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant Download &bull; 100% Print-Ready PDF</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-festive text-[#fef9ee] tracking-tight">
          The Ultimate Holiday Party Games &amp; Icebreaker Pack
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Transform your gift exchange from awkward small talk into the most talked-about event of the season. Ready to print on any home or office printer in 60 seconds.
        </p>
      </div>

      {/* Pricing Showcase Card */}
      <div className="bg-gradient-to-r from-[#144534] via-[#1a5641] to-[#0f382a] border-2 border-[#d4af37] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-extrabold uppercase tracking-wider">
                Holiday Special
              </span>
              <div className="flex items-center text-amber-400 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400 mr-1" />
                <span>5.0 Star Holiday Favorite</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fef9ee] font-festive">
              Everything You Need for an Unforgettable Exchange
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Includes our viral Dirty Santa action card deck, Christmas Emoji Pictionary, 40-question Holiday Movie Trivia, unboxing Bingo, and Black Santa coloring pages.
            </p>

            <div className="flex items-baseline space-x-3 pt-2">
              <span className="text-4xl sm:text-5xl font-black text-[#d4af37] font-mono">$7.99</span>
              <span className="text-lg text-slate-400 line-through">$14.99</span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                Save 47% Today
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-3 shrink-0">
            <button
              onClick={handleBuy}
              disabled={loadingCheckout}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-extrabold text-base transition shadow-2xl shadow-[#d4af37]/30 flex items-center justify-center space-x-2"
            >
              {loadingCheckout ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Get Instant Download &bull; $7.99</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>Secured by Stripe &bull; Instant PDF Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* What's Inside Grid */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold font-festive text-[#fef9ee]">
            What’s Inside the Printable Bundle
          </h2>
          <p className="text-xs text-slate-400">All 5 game modules formatted for easy double-sided home or office printing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="festive-card p-6 rounded-2xl border border-[#1d5943] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#0b2b20] text-3xl flex items-center justify-center border border-[#d4af37]/30">
              🎲
            </div>
            <h3 className="font-bold text-lg text-[#fef9ee] font-festive">
              1. Dirty Santa Action Card Deck (30 Cards)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cut-out action cards like "The Grand Heist", "Freeze Protection", and "Mystery Box Swap" that turn any gift exchange into an edge-of-your-seat game.
            </p>
          </div>

          <div className="festive-card p-6 rounded-2xl border border-[#1d5943] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#0b2b20] text-3xl flex items-center justify-center border border-[#d4af37]/30">
              🎵
            </div>
            <h3 className="font-bold text-lg text-[#fef9ee] font-festive">
              2. Christmas Song Emoji Pictionary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              24 clever emoji song riddles with host answer key. Guaranteed laughs as guests try to figure out famous carols written entirely in emojis.
            </p>
          </div>

          <div className="festive-card p-6 rounded-2xl border border-[#1d5943] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#0b2b20] text-3xl flex items-center justify-center border border-[#d4af37]/30">
              🎬
            </div>
            <h3 className="font-bold text-lg text-[#fef9ee] font-festive">
              3. Holiday Movie &amp; Lore Trivia (40 Questions)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Trivia questions spanning holiday classics (Home Alone, Elf, The Grinch, Christmas Vacation) plus festive global traditions.
            </p>
          </div>

          <div className="festive-card p-6 rounded-2xl border border-[#1d5943] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#0b2b20] text-3xl flex items-center justify-center border border-[#d4af37]/30">
              🎁
            </div>
            <h3 className="font-bold text-lg text-[#fef9ee] font-festive">
              4. Gift Exchange Bingo (16 Cards)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Randomized bingo boards ("Someone brought wine", "Gift has funny wrapping", "Someone tries to steal twice") keeping everyone engaged during unboxing.
            </p>
          </div>

          <div className="festive-card p-6 rounded-2xl border border-[#1d5943] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#0b2b20] text-3xl flex items-center justify-center border border-[#d4af37]/30">
              🎅🏿
            </div>
            <h3 className="font-bold text-lg text-[#fef9ee] font-festive">
              5. Black Santa &amp; Holiday Activity Pack
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Printable holiday coloring sheets, Santa letter stationery, and word searches celebrating family representation and holiday joy.
            </p>
          </div>

          <div className="festive-card p-6 rounded-2xl border border-[#1d5943] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#0b2b20] text-3xl flex items-center justify-center border border-[#d4af37]/30">
              🖨️
            </div>
            <h3 className="font-bold text-lg text-[#fef9ee] font-festive">
              Print-At-Home Compatibility
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard 8.5" x 11" US Letter and A4 sizing. Crisp high-resolution vector artwork designed to look stunning in vibrant color or clean black-and-white.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center space-y-4 pt-6 border-t border-[#1d5943]/60">
        <h3 className="text-2xl font-bold font-festive text-[#fef9ee]">
          Ready to Host the Best Holiday Party Ever?
        </h3>
        <button
          onClick={handleBuy}
          disabled={loadingCheckout}
          className="px-8 py-4 rounded-2xl bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-extrabold text-base transition shadow-xl inline-flex items-center space-x-2"
        >
          {loadingCheckout ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Get the Complete Games Bundle &bull; $7.99</span>
            </>
          )}
        </button>
        <p className="text-xs text-slate-400">
          Instant download link delivered to your screen immediately after Stripe payment.
        </p>
      </div>
    </div>
  );
}

export default function GamesBundlePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-[#fef9ee]">
          <Loader2 className="w-8 h-8 animate-spin text-[#d4af37] mb-3" />
          <p className="text-sm text-slate-300">Loading Holiday Party Games...</p>
        </div>
      }
    >
      <GamesBundleContent />
    </Suspense>
  );
}
