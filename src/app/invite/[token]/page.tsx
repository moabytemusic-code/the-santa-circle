"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gift, Sparkles, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface InviteInfo {
  email: string;
  groupName: string;
  groupDescription?: string;
  inviterName: string;
}

export default function InviteAcceptPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchInvite() {
      try {
        const res = await fetch(`/api/family/invite?token=${token}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Invalid invitation");
        }
        setInvite(data.invite);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Invalid invitation");
      } finally {
        setLoading(false);
      }
    }
    fetchInvite();
  }, [token]);

  const handleAccept = async () => {
    setAccepting(true);
    setError(null);

    try {
      const res = await fetch("/api/family/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          // User needs to log in or register
          router.push(`/register?invite=${token}`);
          return;
        }
        throw new Error(data.error || "Failed to accept");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error accepting invitation");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto my-16 text-center text-[#f3c053] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#d4af37]" />
        <p>Loading your family invitation...</p>
      </div>
    );
  }

  if (error && !invite) {
    return (
      <div className="max-w-md mx-auto my-16 festive-card p-8 rounded-2xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h1 className="text-xl font-bold text-slate-100 font-festive">Invitation Expired or Invalid</h1>
        <p className="text-sm text-slate-300">
          This invitation link has expired or has already been accepted. Please ask your family organizer to send a new invitation.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-full bg-[#144534] text-slate-200 border border-[#1d5943] text-sm"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="festive-card p-6 sm:p-8 rounded-2xl space-y-6 text-center">
        <div className="text-5xl animate-float">🎅</div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#fef9ee] font-festive">
            You&apos;re Invited!
          </h1>
          <p className="text-sm text-[#f3c053]">
            {invite?.inviterName} has invited you to join:
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0b2b20] border border-[#d4af37]/40 space-y-1">
          <div className="text-lg font-bold text-[#fef9ee]">{invite?.groupName}</div>
          {invite?.groupDescription && (
            <p className="text-xs text-slate-300">{invite.groupDescription}</p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-lg text-left">
            {error}
          </div>
        )}

        {success ? (
          <div className="p-4 bg-[#1d5943]/60 border border-[#d4af37]/40 text-emerald-200 rounded-xl space-y-2">
            <CheckCircle className="w-8 h-8 text-[#d4af37] mx-auto" />
            <p className="font-bold text-sm">Welcome to the family!</p>
            <p className="text-xs text-slate-300">Taking you to your Christmas dashboard...</p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="w-full py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-base transition shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {accepting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{accepting ? "Joining..." : "Accept Invitation"}</span>
            </button>

            <div className="pt-4 border-t border-[#1d5943] text-xs text-slate-300 space-y-2">
              <p>Don&apos;t have an account yet?</p>
              <div className="flex justify-center space-x-3">
                <Link
                  href={`/register?invite=${token}`}
                  className="px-4 py-1.5 rounded-lg bg-[#144534] hover:bg-[#1d5943] text-[#f3c053] font-semibold"
                >
                  Register Account
                </Link>
                <Link
                  href={`/login?redirect=/invite/${token}`}
                  className="px-4 py-1.5 rounded-lg border border-[#1d5943] text-slate-300 hover:text-white"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
