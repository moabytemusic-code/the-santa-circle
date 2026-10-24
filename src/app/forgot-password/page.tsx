"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 sm:my-16 px-4">
      <div className="festive-card p-6 sm:p-8 rounded-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl">🔒</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#fef9ee] font-festive">Reset Password</h1>
          <p className="text-sm text-slate-300">
            Enter your email to receive a password reset link
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-xl bg-[#1d5943]/60 border border-[#d4af37]/40 text-emerald-200 space-y-2">
              <CheckCircle className="w-8 h-8 text-[#d4af37] mx-auto" />
              <p className="text-sm font-medium">
                If an account exists with that email, a password reset link has been dispatched!
              </p>
              <p className="text-xs text-slate-300">
                Check your inbox (and spam folder) for instructions.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-block text-sm text-[#f3c053] hover:text-[#d4af37] font-semibold"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@family.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-slate-100 placeholder-slate-500 text-sm focus:border-[#d4af37] focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-sm transition shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? "Sending..." : "Send Reset Link"}</span>
            </button>

            <div className="text-center pt-2 border-t border-[#1d5943]">
              <Link href="/login" className="text-xs text-slate-300 hover:text-[#f3c053]">
                Remember your password? Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
