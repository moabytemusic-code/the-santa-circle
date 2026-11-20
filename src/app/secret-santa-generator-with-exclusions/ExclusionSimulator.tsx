"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Shuffle, AlertCircle, Sparkles, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";

interface Person {
  id: string;
  name: string;
  group: string;
  avatar: string;
}

interface Match {
  giver: Person;
  receiver: Person;
  valid: boolean;
}

const SAMPLE_MEMBERS: Person[] = [
  { id: "1", name: "Alex", group: "Spouse of Sarah", avatar: "👨‍💼" },
  { id: "2", name: "Sarah", group: "Spouse of Alex", avatar: "👩‍💼" },
  { id: "3", name: "Jordan", group: "Roommate of Taylor", avatar: "🧑‍🎨" },
  { id: "4", name: "Taylor", group: "Roommate of Jordan", avatar: "👩‍🔬" },
  { id: "5", name: "Marcus", group: "Individual", avatar: "👨‍💻" },
];

export default function ExclusionSimulator() {
  const [exclusionsActive, setExclusionsActive] = useState(true);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [drawing, setDrawing] = useState(false);

  const runSimulation = () => {
    setDrawing(true);
    setTimeout(() => {
      if (exclusionsActive) {
        // Deterministic valid cycle respecting exclusions:
        // Alex -> Taylor
        // Sarah -> Marcus
        // Jordan -> Alex
        // Taylor -> Sarah
        // Marcus -> Jordan
        const validPairs: Match[] = [
          { giver: SAMPLE_MEMBERS[0], receiver: SAMPLE_MEMBERS[3], valid: true },
          { giver: SAMPLE_MEMBERS[1], receiver: SAMPLE_MEMBERS[4], valid: true },
          { giver: SAMPLE_MEMBERS[2], receiver: SAMPLE_MEMBERS[0], valid: true },
          { giver: SAMPLE_MEMBERS[3], receiver: SAMPLE_MEMBERS[1], valid: true },
          { giver: SAMPLE_MEMBERS[4], receiver: SAMPLE_MEMBERS[2], valid: true },
        ];
        setMatches(validPairs);
      } else {
        // Bad draw with couples matching!
        const badPairs: Match[] = [
          { giver: SAMPLE_MEMBERS[0], receiver: SAMPLE_MEMBERS[1], valid: false }, // Alex -> Sarah (FAIL)
          { giver: SAMPLE_MEMBERS[1], receiver: SAMPLE_MEMBERS[0], valid: false }, // Sarah -> Alex (FAIL)
          { giver: SAMPLE_MEMBERS[2], receiver: SAMPLE_MEMBERS[3], valid: false }, // Jordan -> Taylor (FAIL)
          { giver: SAMPLE_MEMBERS[3], receiver: SAMPLE_MEMBERS[4], valid: true },
          { giver: SAMPLE_MEMBERS[4], receiver: SAMPLE_MEMBERS[2], valid: true },
        ];
        setMatches(badPairs);
      }
      setDrawing(false);
    }, 300);
  };

  return (
    <div className="bg-[#144534]/90 border-2 border-[#d4af37]/60 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1d5943]">
        <div>
          <span className="text-xs font-bold text-[#f3c053] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Demonstration
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#fef9ee] mt-1 font-festive">
            Secret Santa Exclusion Rule Simulator
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Toggle smart exclusions to see how The Santa Circle prevents couples and roommates from drawing each other.
          </p>
        </div>

        <button
          onClick={() => setExclusionsActive(!exclusionsActive)}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 shadow-md ${
            exclusionsActive
              ? "bg-[#d4af37] text-[#0b2b20] hover:bg-[#f3c053]"
              : "bg-red-900/80 text-white border border-red-500/50 hover:bg-red-800"
          }`}
        >
          {exclusionsActive ? (
            <>
              <ShieldCheck className="w-4 h-4" /> Smart Exclusions: ON
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" /> Exclusions: OFF (Paper Hat Mode)
            </>
          )}
        </button>
      </div>

      {/* Participants Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-6">
        {SAMPLE_MEMBERS.map((m) => (
          <div
            key={m.id}
            className="p-3 rounded-xl bg-[#0b2b20]/80 border border-[#1d5943] text-center"
          >
            <div className="text-2xl mb-1">{m.avatar}</div>
            <div className="text-sm font-bold text-slate-100">{m.name}</div>
            <div className="text-[11px] text-[#f3c053] truncate">{m.group}</div>
          </div>
        ))}
      </div>

      {/* Draw Button */}
      <div className="text-center my-6">
        <button
          onClick={runSimulation}
          disabled={drawing}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f3c053] hover:from-[#f3c053] hover:to-[#d4af37] text-[#0b2b20] font-extrabold text-sm sm:text-base shadow-lg shadow-[#d4af37]/25 transition transform active:scale-95 flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
        >
          <Shuffle className={`w-4 h-4 ${drawing ? "animate-spin" : ""}`} />
          {drawing ? "Calculating Math Permutations..." : "Run Test Drawing Now"}
        </button>
      </div>

      {/* Results Display */}
      {matches && (
        <div className="mt-6 pt-6 border-t border-[#1d5943] animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
              Drawing Results:
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                exclusionsActive
                  ? "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40"
                  : "bg-red-900/60 text-red-300 border border-red-500/40"
              }`}
            >
              {exclusionsActive ? "✅ Perfect Draw (Zero Collisions)" : "⚠️ 3 Family Collisions Detected!"}
            </span>
          </div>

          <div className="space-y-2.5">
            {matches.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm transition ${
                  m.valid
                    ? "bg-[#0b2b20]/60 border border-[#1d5943] text-slate-100"
                    : "bg-red-950/40 border border-red-500/40 text-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{m.giver.avatar}</span>
                  <span className="font-bold">{m.giver.name}</span>
                  <span className="text-slate-400">({m.giver.group})</span>
                </div>

                <div className="flex items-center gap-2 font-medium">
                  <span className="text-[#d4af37]">gives to 🎁</span>
                  <span>{m.receiver.avatar}</span>
                  <span className="font-bold">{m.receiver.name}</span>
                </div>

                <div>
                  {m.valid ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Valid
                    </span>
                  ) : (
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Spouse Match!
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {exclusionsActive ? (
            <div className="mt-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-emerald-200">
                <strong>No awkward redraws!</strong> Spouses and roommates are guaranteed different recipients while preserving 100% secrecy.
              </div>
              <Link
                href="/register"
                className="whitespace-nowrap px-4 py-2 rounded-full bg-[#d4af37] text-[#0b2b20] font-bold text-xs hover:bg-[#f3c053] transition shadow flex items-center gap-1"
              >
                Create Free Circle <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="mt-6 p-4 rounded-xl bg-red-950/50 border border-red-500/30 text-xs sm:text-sm text-red-200">
              <strong>The Problem with Paper Scraps:</strong> In standard drawings, Alex drew his wife Sarah, and Sarah drew Alex. The surprise is ruined, requiring an awkward manual redraw.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
