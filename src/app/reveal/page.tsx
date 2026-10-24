"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Sparkles, Gift, Heart, Calendar, DollarSign, CheckCircle2, Loader2, Volume2, ArrowLeft } from "lucide-react";

interface RecipientData {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

interface WishListItem {
  id: string;
  title: string;
  description?: string | null;
  url?: string | null;
  price?: number | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
}

interface WishList {
  notes?: string | null;
  favoriteColors?: string | null;
  sizes?: string | null;
  interests?: string | null;
  items: WishListItem[];
}

interface RevealPayload {
  exchange: {
    id: string;
    name: string;
    year: number;
    budget: number;
    currency: string;
    exchangeDate: string;
    instructions?: string | null;
  };
  recipient: RecipientData;
  revealedAt: string;
  wishList: WishList;
  progress: {
    status: "PLANNING" | "SHOPPING" | "PURCHASED" | "WRAPPED" | "COMPLETED";
    notes?: string | null;
  };
}

export default function RevealPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RevealPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUnwrapped, setIsUnwrapped] = useState(false);
  const [wobble, setWobble] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [giftStatus, setGiftStatus] = useState<string>("PLANNING");
  const [savingProgress, setSavingProgress] = useState(false);

  useEffect(() => {
    async function fetchReveal() {
      try {
        // Fetch active exchange first
        const exRes = await fetch("/api/exchange");
        const exData = await exRes.json();
        const activeEx = exData.exchanges?.[0];

        if (!activeEx) {
          throw new Error("No active exchange found.");
        }

        const res = await fetch(`/api/exchange/${activeEx.id}/reveal`);
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Could not reveal assignment.");
        }

        setData(payload);
        setGiftStatus(payload.progress?.status || "PLANNING");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load assignment.");
      } finally {
        setLoading(false);
      }
    }
    fetchReveal();
  }, []);

  // Festive audio flourish using Web Audio API
  const playFanfare = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Play a quick ascending arpeggio of gentle holiday bells: C5 -> E5 -> G5 -> C6
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.8);
      });
    } catch {
      // Ignore audio context blocks
    }
  };

  const handleUnwrap = () => {
    setWobble(true);
    playFanfare();

    setTimeout(() => {
      setIsUnwrapped(true);
      // Trigger festive confetti explosion
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#9B111E", "#2E7D5B", "#FFFFFF"],
      });
    }, 700);
  };

  const updateProgress = async (newStatus: string) => {
    if (!data?.exchange.id) return;
    setSavingProgress(true);
    setGiftStatus(newStatus);

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exchangeId: data.exchange.id,
          status: newStatus,
        }),
      });
    } catch {
      // Revert if error
    } finally {
      setSavingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto my-16 text-center text-[#f3c053] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#d4af37]" />
        <p className="text-sm">Preparing your Secret Santa assignment...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto my-16 festive-card p-8 rounded-2xl text-center space-y-4">
        <div className="text-4xl">🎄</div>
        <h1 className="text-xl font-bold text-slate-100 font-festive">Secret Santa Not Ready Yet</h1>
        <p className="text-sm text-slate-300">
          {error || "The names have not been drawn for your exchange yet. Please check back soon!"}
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#144534] hover:bg-[#1d5943] border border-[#1d5943] text-sm text-[#fef9ee]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const steps = [
    { key: "PLANNING", label: "Thinking & Planning" },
    { key: "SHOPPING", label: "Shopping" },
    { key: "PURCHASED", label: "Purchased" },
    { key: "WRAPPED", label: "Wrapped" },
    { key: "COMPLETED", label: "Ready to Gift!" },
  ];

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-1.5 text-xs text-slate-300 hover:text-[#d4af37] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs border ${
            soundEnabled
              ? "bg-[#144534] text-[#f3c053] border-[#d4af37]/40"
              : "bg-[#0b2b20] text-slate-400 border-[#1d5943]"
          }`}
          title="Toggle reveal sound flourish"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Sound: {soundEnabled ? "On" : "Muted"}</span>
        </button>
      </div>

      {/* Main Reveal Card */}
      {!isUnwrapped ? (
        <div className="festive-card p-8 sm:p-12 rounded-3xl text-center space-y-8 border-2 border-[#d4af37]/50 shadow-2xl bg-gradient-to-b from-[#144534] to-[#0b2b20]">
          <div className="space-y-2">
            <span className="px-4 py-1.5 rounded-full bg-[#0b2b20] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold tracking-widest uppercase">
              Secret Santa {data.exchange.year}
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#fef9ee] font-festive pt-2">
              Ready to See Your Recipient?
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto">
              Your Secret Santa assignment has been safely sealed. Tap the present below to unwrap the holiday magic!
            </p>
          </div>

          {/* Interactive Gift Box */}
          <div className="py-6 flex justify-center">
            <button
              onClick={handleUnwrap}
              className={`group relative p-6 rounded-3xl bg-[#9b111e] hover:bg-[#b91c1c] border-4 border-[#d4af37] shadow-2xl transition transform hover:scale-105 active:scale-95 ${
                wobble ? "animate-unwrap" : ""
              }`}
              aria-label="Unwrap your gift recipient"
            >
              <div className="text-7xl sm:text-8xl">🎁</div>
              <div className="mt-3 text-sm font-bold text-[#fef9ee] flex items-center justify-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-[#f3c053]" />
                <span>Tap to Unwrap</span>
                <Sparkles className="w-4 h-4 text-[#f3c053]" />
              </div>
            </button>
          </div>

          <div className="text-xs text-[#f3c053]">
            Remember: Don&apos;t tell anyone! Keep the surprise safe until Christmas.
          </div>
        </div>
      ) : (
        /* Revealed Recipient Card */
        <div className="space-y-8">
          <div className="festive-card p-6 sm:p-10 rounded-3xl border-2 border-[#d4af37] shadow-2xl bg-gradient-to-b from-[#144534] to-[#0b2b20] text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-[#9b111e] text-[#fef9ee] text-xs font-bold tracking-wider uppercase border border-[#d4af37]/40">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>You are Secret Santa for</span>
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
            </div>

            <div className="space-y-2">
              <div className="text-5xl sm:text-6xl font-extrabold text-[#fef9ee] font-festive gold-gradient-text tracking-tight">
                {data.recipient.name}
              </div>
              <p className="text-xs text-[#f3c053]">
                Budget: ${Number(data.exchange.budget).toFixed(2)} {data.exchange.currency} &bull; Exchange Date: {new Date(data.exchange.exchangeDate).toLocaleDateString()}
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <a
                href="#wishlist-section"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-sm transition shadow-lg"
              >
                <Heart className="w-4 h-4" />
                <span>View {data.recipient.name}&apos;s Wish List</span>
              </a>
            </div>
          </div>

          {/* Giver's Private Gift Checklist */}
          <div className="festive-card p-6 sm:p-8 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#fef9ee] font-festive flex items-center space-x-2">
                  <Gift className="w-5 h-5 text-[#d4af37]" />
                  <span>My Gift Checklist</span>
                </h2>
                <p className="text-xs text-slate-300">
                  Private to you &mdash; track your gifting progress for {data.recipient.name}
                </p>
              </div>
              {savingProgress && (
                <span className="text-xs text-[#f3c053] animate-pulse">Saving...</span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
              {steps.map((st, i) => {
                const isActive = giftStatus === st.key;
                const isPassed = steps.findIndex((s) => s.key === giftStatus) >= i;
                return (
                  <button
                    key={st.key}
                    onClick={() => updateProgress(st.key)}
                    className={`p-3 rounded-xl text-center text-xs font-semibold transition border ${
                      isActive
                        ? "bg-[#d4af37] text-[#0b2b20] border-[#d4af37] shadow"
                        : isPassed
                        ? "bg-[#144534] text-emerald-300 border-emerald-700/60"
                        : "bg-[#0b2b20]/60 text-slate-400 border-[#1d5943] hover:text-slate-200"
                    }`}
                  >
                    <div className="text-base mb-1">
                      {i === 0 ? "💭" : i === 1 ? "🛍️" : i === 2 ? "💳" : i === 3 ? "🎀" : "🎉"}
                    </div>
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recipient's Wish List Section */}
          <div id="wishlist-section" className="festive-card p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="border-b border-[#1d5943] pb-4">
              <h2 className="text-xl font-bold text-[#fef9ee] font-festive flex items-center space-x-2">
                <Heart className="w-5 h-5 text-rose-400" />
                <span>{data.recipient.name}&apos;s Holiday Wish List</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Ideas and preferences shared by {data.recipient.name}
              </p>
            </div>

            {/* General Preferences Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0b2b20]/60 border border-[#1d5943] space-y-1">
                <div className="text-xs text-[#f3c053] font-semibold">Favorite Colors</div>
                <div className="text-sm text-slate-200">
                  {data.wishList?.favoriteColors || "Not specified"}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0b2b20]/60 border border-[#1d5943] space-y-1">
                <div className="text-xs text-[#f3c053] font-semibold">Clothing / Sizes</div>
                <div className="text-sm text-slate-200">
                  {data.wishList?.sizes || "Not specified"}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0b2b20]/60 border border-[#1d5943] space-y-1">
                <div className="text-xs text-[#f3c053] font-semibold">Interests & Hobbies</div>
                <div className="text-sm text-slate-200">
                  {data.wishList?.interests || "Not specified"}
                </div>
              </div>
            </div>

            {data.wishList?.notes && (
              <div className="p-4 rounded-xl bg-[#0b2b20]/40 border border-[#1d5943] space-y-1">
                <div className="text-xs text-[#f3c053] font-semibold">Special Notes from {data.recipient.name}</div>
                <p className="text-sm text-slate-200 leading-relaxed italic">
                  &ldquo;{data.wishList.notes}&rdquo;
                </p>
              </div>
            )}

            {/* Gift Items */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-[#fef9ee] uppercase tracking-wider text-xs">
                Suggested Gift Ideas ({data.wishList?.items.length || 0})
              </h3>

              {data.wishList?.items && data.wishList.items.length > 0 ? (
                <div className="space-y-3">
                  {data.wishList.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-[#0b2b20]/70 border border-[#1d5943] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-100 text-sm">{item.title}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              item.priority === "HIGH"
                                ? "bg-rose-950 text-rose-300 border border-rose-800"
                                : item.priority === "MEDIUM"
                                ? "bg-amber-950 text-amber-300 border border-amber-800"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {item.priority} Priority
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-slate-300">{item.description}</p>
                        )}
                        {item.price && (
                          <div className="text-xs text-[#f3c053] font-medium">
                            Approx. ${Number(item.price).toFixed(2)}
                          </div>
                        )}
                      </div>

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="px-4 py-1.5 rounded-lg bg-[#144534] hover:bg-[#1d5943] border border-[#d4af37]/40 text-xs text-[#f3c053] font-semibold transition shrink-0"
                        >
                          View Item Link &rarr;
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center rounded-xl bg-[#0b2b20]/40 border border-[#1d5943] text-xs text-slate-400">
                  {data.recipient.name} has not added any specific gift items yet. Check back soon or surprise them based on their favorite colors and interests!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
