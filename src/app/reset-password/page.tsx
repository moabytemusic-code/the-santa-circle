"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="festive-card p-6 sm:p-8 rounded-2xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h1 className="text-xl font-bold text-slate-100">Invalid Reset Link</h1>
        <p className="text-sm text-slate-300">
          No reset token was provided. Please request a new password reset link.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block px-6 py-2.5 rounded-full bg-[#d4af37] text-[#0b2b20] font-bold text-sm"
        >
          Request Reset Link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="festive-card p-6 sm:p-8 rounded-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="text-4xl">🔑</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#fef9ee] font-festive">Choose New Password</h1>
        <p className="text-sm text-slate-300">Please enter and confirm your new password</p>
      </div>

      {error && (
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="text-center space-y-4">
          <div className="p-4 rounded-xl bg-[#1d5943]/60 border border-[#d4af37]/40 text-emerald-200 space-y-2">
            <CheckCircle className="w-8 h-8 text-[#d4af37] mx-auto" />
            <p className="text-sm font-medium">Your password has been successfully reset!</p>
            <p className="text-xs text-slate-300">Redirecting to login in a few seconds...</p>
          </div>
          <Link
            href="/login"
            className="inline-block text-sm text-[#f3c053] hover:text-[#d4af37] font-semibold"
          >
            Go to Login Now
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="newPassword">
              New Password (min 8 chars)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="newPassword"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-slate-100 placeholder-slate-500 text-sm focus:border-[#d4af37] focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
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
            <span>{loading ? "Updating..." : "Update Password"}</span>
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="max-w-md mx-auto my-8 sm:my-16 px-4">
      <Suspense fallback={<div className="text-center py-12 text-[#f3c053]">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
