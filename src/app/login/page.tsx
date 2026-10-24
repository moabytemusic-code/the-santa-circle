"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
      router.refresh();
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
          <div className="text-4xl">🎅</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#fef9ee] font-festive">Welcome Back</h1>
          <p className="text-sm text-slate-300">Sign in to The Santa Circle</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300" htmlFor="password">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#f3c053] hover:text-[#d4af37] transition"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#1d5943] text-xs text-slate-300">
          New to the family exchange?{" "}
          <Link href="/register" className="text-[#f3c053] hover:text-[#d4af37] font-semibold underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
