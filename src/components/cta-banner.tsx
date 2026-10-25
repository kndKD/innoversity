import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section
      id="cta-banner"
      aria-label="Call to action"
      className="py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-8 py-14 sm:px-14 sm:py-16 text-center shadow-2xl shadow-indigo-300/40">
          {/* Background grid pattern */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Crect x='0' y='0' width='1' height='40'/%3E%3Crect x='0' y='0' width='40' height='1'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Glow orbs */}
          <div aria-hidden className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold tracking-widest uppercase">
              Ready to Launch?
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight max-w-3xl">
              Your innovation deserves a{" "}
              <span className="text-yellow-300">verified</span> platform.
            </h2>

            <p className="text-indigo-100 text-base sm:text-lg max-w-2xl leading-relaxed">
              Join 1,847 sellers who are already reaching buyers nationwide
              with institutional trust, Pay Safely protection, and full delivery
              support — all in one place.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/list-innovation"
                id="cta-banner-sell-btn"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 transition-all duration-200 shadow-lg shadow-indigo-900/30"
              >
                Start Selling Free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/how-it-works"
                id="cta-banner-learn-btn"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-bold text-sm hover:bg-white/10 hover:border-white/60 transition-all duration-200"
              >
                How It Works
              </Link>
            </div>

            <p className="text-indigo-200 text-xs mt-1">
              No listing fee · Institutional verification free for students · Pay Safely on every order
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
