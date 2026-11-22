"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, RotateCcw, Check, HelpCircle } from "lucide-react";

export default function GamePickerQuiz() {
  const [groupType, setGroupType] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);
  const [stealing, setStealing] = useState<string | null>(null);

  const isComplete = groupType && vibe && stealing;

  // Logic:
  // If they want chaos/stealing/parties -> White Elephant
  // If they want thoughtful/family/personal/no drama -> Secret Santa
  const isWhiteElephant =
    stealing === "yes" || (vibe === "funny" && groupType !== "family");

  const reset = () => {
    setGroupType(null);
    setVibe(null);
    setStealing(null);
  };

  return (
    <div className="bg-[#144534]/90 border-2 border-[#d4af37]/60 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md my-8">
      <div className="flex items-center justify-between pb-4 border-b border-[#1d5943]">
        <div>
          <span className="text-xs font-bold text-[#f3c053] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Tool
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#fef9ee] font-festive mt-0.5">
            Which Game Should Your Group Play? (30-Sec Quiz)
          </h3>
        </div>
        {isComplete && (
          <button
            onClick={reset}
            className="text-xs text-[#f3c053] hover:text-[#d4af37] flex items-center gap-1 font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Start Over
          </button>
        )}
      </div>

      <div className="space-y-5 my-6">
        {/* Question 1 */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-2">
            1. Who is participating in the exchange?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: "family", label: "Family / Kids & Grandparents", icon: "🏡" },
              { id: "office", label: "Coworkers / Office Team", icon: "💼" },
              { id: "friends", label: "Friend Group / Party Crowd", icon: "🎉" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setGroupType(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition flex items-center gap-2.5 ${
                  groupType === opt.id
                    ? "bg-[#d4af37] text-[#0b2b20] border-[#d4af37] shadow"
                    : "bg-[#0b2b20]/70 text-slate-200 border-[#1d5943] hover:border-[#d4af37]/50"
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question 2 */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-2">
            2. What gift vibe does your group prefer?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: "thoughtful", label: "Personalized & Useful (Wishlists)", icon: "🎁" },
              { id: "funny", label: "Funny, Viral & Gag Gifts", icon: "😂" },
              { id: "practical", label: "Crowd-Pleasers (Treats/Gadgets)", icon: "☕" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setVibe(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition flex items-center gap-2.5 ${
                  vibe === opt.id
                    ? "bg-[#d4af37] text-[#0b2b20] border-[#d4af37] shadow"
                    : "bg-[#0b2b20]/70 text-slate-200 border-[#1d5943] hover:border-[#d4af37]/50"
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question 3 */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-2">
            3. Do you want competitive gift stealing?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: "yes", label: "Yes! Stealing and swapping makes it exciting.", icon: "⚡" },
              { id: "no", label: "No. Everyone should get something picked just for them.", icon: "❤️" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setStealing(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition flex items-center gap-2.5 ${
                  stealing === opt.id
                    ? "bg-[#d4af37] text-[#0b2b20] border-[#d4af37] shadow"
                    : "bg-[#0b2b20]/70 text-slate-200 border-[#1d5943] hover:border-[#d4af37]/50"
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULT CARD */}
      {isComplete ? (
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-[#0b2b20] to-[#071d15] border-2 border-[#d4af37] shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold text-[#f3c053] tracking-widest">
                Recommended For Your Group:
              </span>
              <h4 className="text-2xl font-extrabold text-[#fef9ee] font-festive mt-1">
                {isWhiteElephant ? "🐘 White Elephant Gift Exchange" : "🎅 Secret Santa (With Exclusions)"}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                {isWhiteElephant
                  ? "Your group will thrive on the fast-paced, hilarious party game atmosphere where stealing and swapping is part of the fun!"
                  : "Your group will appreciate thoughtful, personalized gifts with sizing & wishlists—where everyone gets something they actually want, with zero drama."}
              </p>
            </div>

            <div className="flex-shrink-0 w-full sm:w-auto">
              {isWhiteElephant ? (
                <Link
                  href="/games-bundle"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-extrabold text-sm shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>Get Party Games Bundle</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href="/secret-santa-generator-with-exclusions"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-extrabold text-sm shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>Set Up Free Circle</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-2 text-xs text-slate-400 italic">
          Select an option for all 3 questions above to get your instant verdict!
        </div>
      )}
    </div>
  );
}
