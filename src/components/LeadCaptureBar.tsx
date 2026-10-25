"use client";

import { useState } from "react";
import { Sparkles, Mail, CheckCircle, ArrowRight, Loader2, Download, Gift } from "lucide-react";

interface LeadCaptureBarProps {
  culturalTheme?: string;
}

export function LeadCaptureBar({ culturalTheme = "CLASSIC" }: LeadCaptureBarProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/leads/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name.trim() || undefined,
          source: "HOMEPAGE_LEAD_MAGNET",
          culturalTheme,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscription failed");

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#144534] via-[#1a5641] to-[#0f382a] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden my-12">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3c053] text-xs font-bold uppercase tracking-wider">
          <Gift className="w-3.5 h-3.5" />
          <span>Free Holiday Download</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold font-festive text-[#fef9ee] tracking-tight">
          Get the 2026 Secret Santa Host Toolkit & Top 50 Gift Guide
        </h2>

        <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Planning a gift exchange for family, friends, or coworkers? Download our free ready-to-print rules cheat-sheet, party game cards, and curated budget gift recommendations.
        </p>

        {submitted ? (
          <div className="bg-[#0b2b20]/90 border border-[#d4af37] rounded-2xl p-6 max-w-lg mx-auto text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 bg-[#d4af37]/20 border border-[#d4af37] rounded-full flex items-center justify-center mx-auto text-[#d4af37]">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#fef9ee] font-festive">You're on the VIP Holiday List!</h3>
              <p className="text-xs text-slate-300 mt-1">
                We've saved your spot. Click below to view and download your free Host Guide & Rules Toolkit!
              </p>
            </div>
            <a
              href="/gift-guides"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#b89528] text-[#0b2b20] font-bold text-xs transition shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Curated Gift Guides</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0b2b20] border border-[#1d5943] rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-sm transition shadow-lg flex items-center justify-center space-x-2 shrink-0"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Get Free Toolkit</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {error && <p className="text-xs text-red-300">{error}</p>}

            <p className="text-[11px] text-slate-300">
              🔒 100% free. No spam. Unsubscribe anytime with 1-click.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
