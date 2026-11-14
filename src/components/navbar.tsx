"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { supabase } from "@/lib/supabase";
import {
  ShoppingBag,
  Search,
  Home,
  Package,
  User,
  Menu,
  X,
  Plus,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

interface NavUser {
  id: string;
  email?: string;
  fullName?: string;
  role?: string;
}

const navLinks = [
  { label: "Marketplace", href: "/#marketplace" },
  { label: "Innovations", href: "/innovations" },
  { label: "How It Works", href: "/how-it-works" },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch real authenticated user session & role from database
  const refreshUserSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.fullName || "Member",
            role: (data.user.role || "BUYER").toUpperCase(),
          });
          return;
        }
      }
    } catch (err) {
      console.error("Navbar session sync error:", err);
    }
    setUser(null);
  };

  useEffect(() => {
    refreshUserSession();

    // Listen to Supabase Auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshUserSession();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Sign out error:", e);
    }

    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch {}

    if (typeof window !== "undefined") {
      document.cookie =
        "innoversity_demo_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      localStorage.removeItem("innoversity_user");
    }

    setUser(null);
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const isBuyer = user?.role === "BUYER";

  const mobileNavItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/innovations" },
    ...(isBuyer
      ? [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            href: "/buyer/dashboard",
            isPrimary: true,
          },
        ]
      : [
          {
            icon: Plus,
            label: "Sell",
            href: "/list-innovation",
            isPrimary: true,
          },
        ]),
    {
      icon: Package,
      label: "Orders",
      href: user ? "/buyer/dashboard" : "/signin",
    },
    {
      icon: User,
      label: user ? "Account" : "Sign In",
      href: user ? "/buyer/dashboard" : "/signin",
    },
  ];

  return (
    <>
      {/* ── Desktop / Tablet Navbar ───────────────────────────────────────── */}
      <header
        className={`
          fixed top-0 inset-x-0 z-50 transition-all duration-300
          bg-white/85 backdrop-blur-md
          ${
            scrolled
              ? "shadow-[0_1px_24px_0_rgba(79,70,229,0.10)] border-b border-indigo-100/60"
              : "border-b border-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="shrink-0" id="navbar-logo">
              <Logo className="w-8 h-8 text-indigo-600" textColor="text-slate-900" />
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA / User Profile Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {/* When Logged in as BUYER: HIDE List Innovation, Sign In, and Get Started */}
              {isBuyer ? (
                <>
                  {/* My Dashboard CTA */}
                  <Link
                    href="/buyer/dashboard"
                    id="navbar-my-dashboard-cta"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                  >
                    <LayoutDashboard size={16} className="text-indigo-600" />
                    <span>My Dashboard</span>
                  </Link>

                  {/* Buyer Avatar & Full Name */}
                  <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-slate-100 border border-slate-200/80">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-black text-xs flex items-center justify-center uppercase shadow-sm">
                      {user.fullName ? user.fullName.charAt(0) : "B"}
                    </div>
                    <span className="text-xs font-bold text-slate-800 max-w-[140px] truncate">
                      {user.fullName || "Buyer"}
                    </span>
                  </div>

                  {/* Sign Out Button */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    id="navbar-signout-btn"
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : user ? (
                /* Other Logged In Role (e.g. SELLER) */
                <>
                  <Link
                    href="/list-innovation"
                    id="navbar-sell-cta"
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
                  >
                    List Innovation
                  </Link>

                  <Link
                    href={user.role === "SELLER" ? "/seller/dashboard" : "/verifiers"}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                  >
                    <LayoutDashboard size={16} className="text-indigo-600" />
                    <span>Dashboard</span>
                  </Link>

                  <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-slate-100 border border-slate-200/80">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-black text-xs flex items-center justify-center uppercase shadow-sm">
                      {user.fullName ? user.fullName.charAt(0) : "U"}
                    </div>
                    <span className="text-xs font-bold text-slate-800 max-w-[140px] truncate">
                      {user.fullName}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                /* Unauthenticated View */
                <>
                  <Link
                    href="/list-innovation"
                    id="navbar-sell-cta"
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
                  >
                    List Innovation
                  </Link>
                  <Link
                    href="/signin"
                    id="navbar-login-cta"
                    className="px-3.5 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    id="navbar-signup-cta"
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 shadow-sm shadow-indigo-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
            {user && (
              <div className="flex items-center gap-2.5 px-3 py-2.5 mb-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-black text-sm flex items-center justify-center uppercase">
                  {user.fullName ? user.fullName.charAt(0) : "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">{user.fullName}</span>
                  <span className="text-[10px] text-slate-500">{user.email}</span>
                </div>
              </div>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 flex flex-col gap-2">
              {isBuyer ? (
                <>
                  <Link
                    href="/buyer/dashboard"
                    className="w-full text-center py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 transition-all cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : user ? (
                <>
                  <Link
                    href="/list-innovation"
                    className="w-full text-center py-3 rounded-xl text-sm font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    List Innovation
                  </Link>
                  <Link
                    href={user.role === "SELLER" ? "/seller/dashboard" : "/verifiers"}
                    className="w-full text-center py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 transition-all cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/list-innovation"
                    className="w-full text-center py-3 rounded-xl text-sm font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    List Innovation
                  </Link>
                  <Link
                    href="/signin"
                    className="w-full text-center py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full text-center py-3 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile Bottom Navigation Bar ─────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_24px_0_rgba(0,0,0,0.06)]"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-14 px-2">
          {mobileNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              id={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`
                flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-xl transition-all duration-200
                ${
                  item.isPrimary
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-300 scale-105 -translate-y-1"
                    : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                }
              `}
              aria-label={item.label}
            >
              <item.icon size={item.isPrimary ? 20 : 18} strokeWidth={2} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
