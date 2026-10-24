"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, UserCheck, Shield } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Membership {
  role: string;
  user: User;
}

interface Participant {
  userId: string;
  status: "INVITED" | "CONFIRMED" | "DECLINED";
}

interface FamilyDirectoryProps {
  memberships: Membership[];
  participants: Participant[];
  hasExchange: boolean;
  isAdmin: boolean;
  currentUserId: string;
}

export function FamilyDirectory({
  memberships,
  participants,
  hasExchange,
  isAdmin,
  currentUserId,
}: FamilyDirectoryProps) {
  const [filter, setFilter] = useState<"CONFIRMED_ONLY" | "ALL">("CONFIRMED_ONLY");

  const confirmedCount = participants.filter((p) => p.status === "CONFIRMED").length;

  const displayedMembers = memberships.filter((m) => {
    if (filter === "ALL") return true;
    const participant = participants.find((p) => p.userId === m.user.id);
    return participant?.status === "CONFIRMED";
  });

  return (
    <div className="festive-card p-6 rounded-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1d5943] pb-3">
        <div>
          <h3 className="text-lg font-bold text-[#fef9ee] font-festive flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#d4af37]" />
            <span>
              {filter === "CONFIRMED_ONLY"
                ? `Confirmed Participants (${confirmedCount})`
                : `All Family Members (${memberships.length})`}
            </span>
          </h3>
          <p className="text-xs text-slate-300">
            {filter === "CONFIRMED_ONLY"
              ? "Family members actively participating in this year's Secret Santa exchange."
              : "All registered members of your family group."}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {hasExchange && (
            <div className="inline-flex rounded-lg bg-[#0b2b20] p-1 border border-[#1d5943] text-xs">
              <button
                type="button"
                onClick={() => setFilter("CONFIRMED_ONLY")}
                className={`px-3 py-1 rounded-md font-semibold transition flex items-center space-x-1 ${
                  filter === "CONFIRMED_ONLY"
                    ? "bg-[#144534] text-[#d4af37] shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Confirmed Only ({confirmedCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilter("ALL")}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  filter === "ALL"
                    ? "bg-[#144534] text-[#d4af37] shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>All Family ({memberships.length})</span>
              </button>
            </div>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              className="text-xs text-[#f3c053] hover:text-[#d4af37] font-semibold px-2 py-1"
            >
              + Invite
            </Link>
          )}
        </div>
      </div>

      {displayedMembers.length === 0 ? (
        <div className="p-8 text-center bg-[#0b2b20]/50 rounded-xl border border-dashed border-[#1d5943] space-y-2">
          <div className="text-3xl">🎅</div>
          <div className="text-sm font-semibold text-slate-200">
            No confirmed participants yet
          </div>
          <div className="text-xs text-slate-400 max-w-sm mx-auto">
            Family members can confirm their participation using the Accept button above.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {displayedMembers.map((m) => {
            const participant = participants.find((p) => p.userId === m.user.id);
            const isConfirmed = participant?.status === "CONFIRMED";
            const isDeclined = participant?.status === "DECLINED";

            return (
              <div
                key={m.user.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition ${
                  isConfirmed
                    ? "bg-[#0b2b20]/70 border-[#1d5943]"
                    : "bg-[#0b2b20]/40 border-slate-800 opacity-75"
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#144534] border border-[#d4af37]/60 flex items-center justify-center text-xs font-bold text-[#d4af37] shrink-0">
                    {m.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-medium text-slate-200 truncate flex items-center space-x-1.5">
                      <span className="truncate">{m.user.name}</span>
                      {m.user.id === currentUserId && (
                        <span className="text-[10px] text-[#d4af37] font-semibold shrink-0">
                          (You)
                        </span>
                      )}
                      {m.role === "ADMIN" && (
                        <span title="Organizer" className="shrink-0">
                          <Shield className="w-3 h-3 text-[#d4af37]" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 capitalize">
                      {m.role.toLowerCase() === "admin" ? "Organizer" : "Family Member"}
                    </div>
                  </div>
                </div>

                {hasExchange && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${
                      isConfirmed
                        ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                        : isDeclined
                        ? "bg-red-950/80 text-red-300 border border-red-800"
                        : "bg-amber-950/80 text-amber-300 border border-amber-800"
                    }`}
                  >
                    {participant?.status || "Invited"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
