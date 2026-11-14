import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Star, CheckCircle2 } from "lucide-react";

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

          {/* ── Right: Innovation Prototype Showcase Card ───────── */}
          <div className="flex justify-center lg:justify-end animate-fade-in-up animation-delay-200">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Floating accent glows */}
              <div aria-hidden className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-indigo-200/50 blur-3xl pointer-events-none" />
              <div aria-hidden className="absolute -bottom-6 -left-6 w-36 h-36 rounded-full bg-violet-200/50 blur-3xl pointer-events-none" />

              {/* Floating micro-badge: Top-Left "⚡ Domex Tracked" */}
              <div className="absolute -top-3.5 -left-2 sm:-left-4 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg shadow-slate-200/50 text-xs font-bold text-slate-800">
                <span className="text-amber-500">⚡</span>
                <span>Domex Tracked</span>
              </div>

              {/* Floating micro-badge: Bottom-Right "🛡️ Zero-Fraud Guarantee" */}
              <div className="absolute -bottom-3.5 -right-2 sm:-right-4 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg shadow-slate-200/50 text-xs font-bold text-slate-800">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Zero-Fraud Guarantee</span>
              </div>

              {/* Light Glassmorphism Card */}
              <div className="relative bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-2xl rounded-3xl p-4 sm:p-5 transition-all duration-300 hover:shadow-indigo-100/70 hover:border-slate-300">
                {/* Image Display Area */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-inner">
                  <Image
                    src="/innovations/hero-proto.jpg"
                    alt="IoT Micro-Climate Smart Sensor Prototype"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Corner Status Pill: 🟢 Live Working Prototype */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Working Prototype</span>
                  </div>

                  {/* Category chip top-right */}
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-indigo-700 uppercase tracking-wider shadow-sm">
                    IoT Hardware
                  </div>
                </div>

                {/* Content below photo */}
                <div className="pt-4 flex flex-col gap-3">
                  {/* Title & Creator */}
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                      IoT Micro-Climate Smart Sensor
                    </h2>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <span className="inline-flex items-center text-indigo-600 font-semibold">
                        <CheckCircle2 size={13} className="text-indigo-600 mr-1" />
                        Verified Creator
                      </span>
                      <span>·</span>
                      <span className="text-slate-500">University of Moratuwa</span>
                    </div>
                  </div>

                  {/* Quick specs pill row */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium border border-slate-200/60">
                      ESP32 · Solar Powered
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60 flex items-center gap-1">
                      <ShieldCheck size={12} className="text-emerald-600" />
                      Audited
                    </span>
                  </div>

                  {/* Price & Primary CTA Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        Rs. 24,500
                      </span>
                      <div className="flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-[11px] font-semibold text-indigo-700 w-fit">
                        <ShieldCheck size={11} className="text-indigo-600" />
                        7-Day Payment Protection
                      </div>
                    </div>

                    <Link
                      href="/innovations/1"
                      id="hero-inspect-prototype-cta"
                      className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-200 shrink-0"
                    >
                      Inspect Prototype
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
