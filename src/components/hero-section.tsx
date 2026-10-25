import Link from "next/link";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative overflow-hidden bg-white pt-10 pb-16 sm:pt-14 sm:pb-20"
    >
      {/* Background radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-indigo-100/60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-0 w-[400px] h-[400px] rounded-full bg-violet-100/50 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Copy ────────────────────────────────────── */}
          <div className="flex flex-col gap-6 animate-fade-in-up">
            {/* Trust pill */}
            <div className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span className="text-xs font-bold text-indigo-700 tracking-wide">
                Verified by Sri Lankan Universities &amp; SMEs
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-gray-900">
              Sell your{" "}
              <span className="gradient-text">innovation.</span>
              <br />
              Trusted by{" "}
              <span className="relative">
                Sri Lanka.
                <svg
                  aria-hidden
                  viewBox="0 0 220 12"
                  className="absolute -bottom-2 left-0 w-full"
                  fill="none"
                >
                  <path
                    d="M2 9 C50 3, 140 3, 218 9"
                    stroke="#4F46E5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                </svg>
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg text-gray-500 leading-relaxed max-w-md">
              The first marketplace where every product is verified by a
              university or registered SME body — before it reaches buyers
              across Sri Lanka.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 pt-2">
              {[
                { value: "1,847", label: "Verified Sellers" },
                { value: "4,392", label: "Products Listed" },
                { value: "22", label: "Districts Reached" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span className="text-2xl font-black text-indigo-700">{stat.value}</span>
                  <span className="text-xs text-gray-400 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/innovations"
                id="hero-browse-cta"
                className="btn-glow inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-200"
              >
                Browse Innovations
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/list-innovation"
                id="hero-sell-cta"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                List Your Product
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex -space-x-2">
                {["🧑‍🎓", "👩‍💼", "🧑‍🔬", "👩‍🌾"].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 border-2 border-white flex items-center justify-center text-xs"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} className="text-amber-400 fill-amber-400" />
                ))}
                <span className="text-xs text-gray-500 ml-1">
                  Trusted by <span className="font-semibold text-gray-700">12,000+</span> buyers
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: FocusFlow Showcase Card ────────────────── */}
          <div className="flex justify-center lg:justify-end animate-fade-in-up animation-delay-200">
            <div className="relative w-full max-w-sm">
              {/* Floating accent dots */}
              <div aria-hidden className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-indigo-100 blur-2xl opacity-80" />
              <div aria-hidden className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-violet-100 blur-2xl opacity-80" />

              {/* Dark showcase card */}
              <div className="relative rounded-3xl bg-[#080911] border border-[#1E2240] shadow-2xl shadow-indigo-900/30 overflow-hidden">

                {/* Card top gradient strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

                <div className="p-6 flex flex-col gap-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">
                        Featured Innovation
                      </span>
                      <h2 className="mt-1 text-xl font-black text-white leading-tight">
                        FocusFlow Planner System
                      </h2>
                      <p className="mt-1 text-xs text-gray-400">
                        by A. Fernando — UoC Psychology
                      </p>
                    </div>
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-fuchsia-600 flex items-center justify-center text-2xl shadow-lg shadow-rose-900/40">
                      📓
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Research-backed A5 productivity planner for Sri Lankan university
                    students. Sinhala &amp; English. 24-week semester format.
                  </p>

                  {/* Badges row */}
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900/50 border border-emerald-700/50 text-emerald-400 text-xs font-semibold">
                      <ShieldCheck size={11} strokeWidth={2.5} />
                      University of Colombo
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#1E2240] text-gray-400 text-xs font-medium border border-[#2A3060]">
                      Colombo District
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#1E2240] text-gray-400 text-xs font-medium border border-[#2A3060]">
                      Productivity
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Units Sold", value: "834" },
                      { label: "Rating", value: "4.7 ★" },
                      { label: "Reviews", value: "112" },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col gap-0.5 bg-[#0F1120] rounded-xl p-2.5 border border-[#1E2240]">
                        <span className="text-base font-black text-white">{item.value}</span>
                        <span className="text-[10px] text-gray-500">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-2xl font-black text-white">Rs. 1,850</span>
                      <p className="text-xs text-gray-500 mt-0.5">per planner unit</p>
                    </div>
                    <Link
                      href="/orders/ORD-2026-01"
                      id="hero-card-buy-btn"
                      className="inline-flex items-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors duration-200 shadow-lg shadow-indigo-900/40"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating notification chip */}
              <div className="absolute -top-3 -left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-lg border border-gray-100 text-xs font-semibold text-gray-700 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                834 sold this semester
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
