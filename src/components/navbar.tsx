"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Home,
  Package,
  User,
  Menu,
  X,
  Plus,
} from "lucide-react";

const navLinks = [
  { label: "Marketplace", href: "/#marketplace" },
  { label: "Innovations", href: "/innovations" },
  { label: "IT Solutions", href: "/innovations?category=IT+Solutions+%26+Services" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Verifiers", href: "/verifiers" },
];

const mobileNavItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/innovations" },
  { icon: Plus, label: "Sell", href: "/list-innovation", isPrimary: true },
  { icon: Package, label: "Orders", href: "/orders/ORD-2026-01" },
  { icon: User, label: "Sign In", href: "/signin" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── Desktop / Tablet Navbar ───────────────────────────────────────── */}
      <header
        className={`
          fixed top-0 inset-x-0 z-50 transition-all duration-300
          bg-white/85 backdrop-blur-md
          ${scrolled ? "shadow-[0_1px_24px_0_rgba(79,70,229,0.10)] border-b border-indigo-100/60" : "border-b border-transparent"}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0" id="navbar-logo">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
                <span className="text-white font-black text-sm leading-none">IV</span>
              </div>
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-indigo-700 to-violet-600 bg-clip-text text-transparent">
                Innoversity
              </span>
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

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
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
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 shadow-sm shadow-indigo-200"
              >
                Sign In
              </Link>
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
              key={item.href}
              href={item.href}
              id={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`
                flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-xl transition-all duration-200
                ${item.isPrimary
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
