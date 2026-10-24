"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";

interface Props {
  exchangeId: string;
  currentStatus: string;
}

export function ParticipationButtons({ exchangeId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (status: "CONFIRMED" | "DECLINED") => {
    setLoading(true);
    try {
      const res = await fetch("/api/exchange", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchangeId, status }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleUpdate("CONFIRMED")}
        disabled={loading || currentStatus === "CONFIRMED"}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
          currentStatus === "CONFIRMED"
            ? "bg-emerald-700/50 text-emerald-200 cursor-default"
            : "bg-emerald-600 hover:bg-emerald-500 text-white shadow"
        } disabled:opacity-60`}
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
        <span>Participate</span>
      </button>

      <button
        onClick={() => handleUpdate("DECLINED")}
        disabled={loading || currentStatus === "DECLINED"}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1 ${
          currentStatus === "DECLINED"
            ? "bg-red-950/60 text-red-300 border border-red-800/60 cursor-default"
            : "bg-[#0b2b20] hover:bg-red-950/40 text-slate-300 hover:text-red-300 border border-[#1d5943]"
        } disabled:opacity-60`}
      >
        <X className="w-3.5 h-3.5" />
        <span>Decline</span>
      </button>
    </div>
  );
}
