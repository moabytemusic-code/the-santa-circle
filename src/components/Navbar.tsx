"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Gift, Sparkles, User, Shield, LogOut, Menu, X, Heart, Crown, Tag } from "lucide-react";
import { Role } from "@prisma/client";

interface NavbarProps {
  user?: {
    id: string;
    email: string;
    name: string;
    role: Role;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      window.location.href = "/login";
    }
  };

  const navLinks = [
    { href: "/dashboard", label: "Circle Dashboard", icon: Gift },
    { href: "/reveal", label: "My Secret Santa", icon: Sparkles },
    { href: "/wishlist", label: "My Wish List", icon: Heart },
    { href: "/gift-guides", label: "Gift Guides", icon: Tag },
  ];

  if (user?.role === "ADMIN") {
    navLinks.push({ href: "/admin", label: "Host Panel", icon: Shield });
    navLinks.push({ href: "/super-admin", label: "Super Admin", icon: Crown });
  }

  return (
    <header className="sticky top-0 z-40 bg-[#0b2b20]/95 backdrop-blur-md border-b border-[#1d5943] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 text-lg font-bold text-[#fef9ee] hover:text-[#d4af37] transition group"
          >
            <span className="text-2xl animate-float">🎄</span>
            <div className="flex flex-col">
              <span className="leading-tight font-festive tracking-wide text-[#fef9ee]">The Santa Circle</span>
              <span className="text-[10px] text-[#f3c053] tracking-widest uppercase font-sans">Modern Secret Santa</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-[#144534] text-[#d4af37] border border-[#d4af37]/40 shadow-sm"
                        : "text-slate-200 hover:bg-[#144534]/50 hover:text-[#f3c053]"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#d4af37]" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* User Profile Pill & Logout */}
              <div className="flex items-center space-x-3 pl-4 border-l border-[#1d5943]">
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <div className="w-7 h-7 rounded-full bg-[#1d5943] border border-[#d4af37] flex items-center justify-center text-[#d4af37] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline-block font-medium">{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 p-2 text-xs text-slate-300 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition"
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </nav>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/gift-guides"
                className="px-3 py-2 text-sm text-[#f3c053] hover:text-[#d4af37] font-semibold transition flex items-center space-x-1.5"
              >
                <span>🎁</span>
                <span>Gift Guides</span>
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-[#fef9ee] hover:text-[#d4af37] font-medium transition"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm rounded-full bg-[#d4af37] text-[#0b2b20] font-bold hover:bg-[#f3c053] transition shadow-md"
              >
                Start a Circle
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-[#d4af37] focus:outline-none"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b2b20] border-b border-[#1d5943] px-4 pt-2 pb-4 space-y-2">
          {user ? (
            <>
              <div className="flex items-center space-x-2 py-2 px-3 bg-[#144534] rounded-lg text-sm text-[#d4af37]">
                <User className="w-4 h-4" />
                <span>Signed in as <strong>{user.name}</strong></span>
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium transition ${
                      isActive
                        ? "bg-[#144534] text-[#d4af37]"
                        : "text-slate-200 hover:bg-[#144534]/50"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#d4af37]" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-2 px-3 py-2.5 text-red-300 hover:bg-red-950/40 rounded-lg text-base font-medium transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                href="/gift-guides"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-lg bg-[#0b2b20] border border-[#d4af37]/40 text-[#f3c053] font-semibold"
              >
                🎁 Browse Holiday Gift Guides
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-lg bg-[#144534] text-[#fef9ee] font-medium"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-lg bg-[#d4af37] text-[#0b2b20] font-bold"
              >
                Start a Circle
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
