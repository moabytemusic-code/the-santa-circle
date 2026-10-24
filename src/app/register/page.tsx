"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, User, AlertCircle, Loader2, Sparkles, Users } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [circleName, setCircleName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, inviteToken, circleName }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      const target = data.redirect || (inviteToken ? "/dashboard" : "/admin");
      router.push(target);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="festive-card p-6 sm:p-8 rounded-2xl space-y-6">
      <div className="text-center space-y-3">
        <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#d4af37] shadow-xl shadow-[#d4af37]/25 bg-[#071d15]">
          <Image
            src="/images/santa-logo.png"
            alt="The Santa Circle"
            fill
            sizes="80px"
            className="object-cover"
            priority
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#fef9ee] font-festive">The Santa Circle</h1>
        <p className="text-sm text-slate-300">
          {inviteToken
            ? "Accept your invitation & set up your account"
            : "Start your gift exchange circle in under 60 seconds"}
        </p>
      </div>

      {inviteToken && (
        <div className="p-3 bg-[#1d5943]/60 border border-[#d4af37]/40 rounded-xl text-xs text-[#f3c053] flex items-center space-x-2">
          <Sparkles className="w-4 h-4 shrink-0 text-[#d4af37]" />
          <span>You have an active invitation token attached to this registration!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!inviteToken && (
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="circleName">
              Circle Name (Family or Team)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Users className="w-4 h-4" />
              </div>
              <input
                id="circleName"
                type="text"
                value={circleName}
                onChange={(e) => setCircleName(e.target.value)}
                placeholder="e.g. Miller Family Christmas or Design Team 2026"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-slate-100 placeholder-slate-500 text-sm focus:border-[#d4af37] focus:outline-none transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">You will be the Circle Host and can invite everyone with a simple link.</p>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="name">
            Your Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Miller"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-slate-100 placeholder-slate-500 text-sm focus:border-[#d4af37] focus:outline-none transition"
            />
          </div>
        </div>

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
              placeholder="sarah@example.com"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-slate-100 placeholder-slate-500 text-sm focus:border-[#d4af37] focus:outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="password">
            Password (min 8 chars)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-slate-100 placeholder-slate-500 text-sm focus:border-[#d4af37] focus:outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1" htmlFor="confirmPassword">
            Confirm Password
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
          className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-sm transition shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{loading ? "Setting Up Circle..." : inviteToken ? "Accept & Join" : "Create My Circle"}</span>
        </button>
      </form>

      <div className="text-center pt-2 border-t border-[#1d5943] text-xs text-slate-300">
        Already have an account?{" "}
        <Link href="/login" className="text-[#f3c053] hover:text-[#d4af37] font-semibold underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto my-8 sm:my-16 px-4">
      <Suspense fallback={<div className="text-center py-12 text-[#f3c053]">Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
