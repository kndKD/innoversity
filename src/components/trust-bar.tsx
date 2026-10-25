import { ShieldCheck } from "lucide-react";

const institutions = [
  {
    name: "University of Moratuwa",
    short: "UoM / ITUM",
    emoji: "🏛️",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    name: "University of Colombo",
    short: "UoC / UCSC",
    emoji: "🎓",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    name: "University of Peradeniya",
    short: "UoP",
    emoji: "🔬",
    color: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    name: "University of Sri Jayewardenepura",
    short: "USJ",
    emoji: "🌳",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    name: "University of Ruhuna",
    short: "UoR",
    emoji: "🌊",
    color: "text-cyan-700",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
  },
  {
    name: "University of Jaffna",
    short: "UoJ",
    emoji: "☀️",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    name: "SLIATE & ATIs",
    short: "ATIs",
    emoji: "⚙️",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    name: "BR Verified SMEs",
    short: "BR SMEs",
    emoji: "🏪",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
];

export default function TrustBar() {
  return (
    <section
      aria-label="Trusted verifier institutions"
      className="border-y border-gray-100 bg-white py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold tracking-widest uppercase text-gray-400 mb-6">
          Verified across 22+ Sri Lankan Universities, ATIs &amp; Higher Educational Institutions
        </p>

        {/* Institution tiles — responsive flex wrap */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {institutions.map((inst) => (
            <div
              key={inst.name}
              className={`
                flex items-center gap-2 px-3.5 py-2 rounded-xl
                ${inst.bg} border ${inst.border}
                hover:scale-105 transition-all duration-200 cursor-default shadow-xs
              `}
            >
              <span className="text-base" role="img" aria-label={inst.name}>
                {inst.emoji}
              </span>
              <div className="flex flex-col">
                <span className={`text-xs font-bold leading-tight ${inst.color}`}>
                  {inst.short}
                </span>
                <span className="text-[10px] text-gray-500 leading-none hidden sm:inline">
                  {inst.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust metrics subtext */}
        <div className="mt-5 flex items-center justify-center gap-6 text-xs text-gray-400 text-center flex-wrap">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            Zero-Leak Academic Identity Masking
          </span>
          <span className="hidden sm:inline">·</span>
          <span>100% Free Verification for Students Island-wide</span>
          <span className="hidden sm:inline">·</span>
          <span>Pay Safely 7-Day Safe Holding Protection</span>
        </div>
      </div>
    </section>
  );
}
