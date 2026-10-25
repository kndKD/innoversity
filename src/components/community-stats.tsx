import { communityStats } from "@/lib/mock-data";

const stats = [
  {
    value: communityStats.verifiedSellers.toLocaleString("en-LK"),
    label: "Verified Sellers",
    sublabel: "across 9 universities & SME bodies",
    emoji: "🎓",
  },
  {
    value: communityStats.productsListed.toLocaleString("en-LK"),
    label: "Innovations Listed",
    sublabel: "from students, researchers & SMEs",
    emoji: "💡",
  },
  {
    value: communityStats.escrowOrdersCompleted.toLocaleString("en-LK"),
    label: "Pay Safely Orders Completed",
    sublabel: "with 100% safe holding protection",
    emoji: "🔒",
  },
  {
    value: `${communityStats.districtsReached} / 25`,
    label: "Districts Reached",
    sublabel: "nationwide delivery coverage",
    emoji: "🗺️",
  },
];

export default function CommunityStats() {
  return (
    <section
      id="community-stats"
      aria-labelledby="stats-heading"
      className="py-20 bg-[#080911]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-900/60 text-indigo-300 text-xs font-bold tracking-wide uppercase mb-3 border border-indigo-800/50">
            Community Growth
          </span>
          <h2
            id="stats-heading"
            className="text-3xl sm:text-4xl font-black text-white mb-3"
          >
            The numbers behind the trust
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            A growing community of verified innovators, researchers, and buyers — all transacting safely on one platform.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-3 p-6 rounded-2xl bg-[#0F1120] border border-[#1E2240] hover:border-indigo-800/60 transition-all duration-300"
            >
              <span className="text-3xl" role="img" aria-hidden>
                {stat.emoji}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-white leading-none">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold text-indigo-300 mt-1">
                  {stat.label}
                </span>
                <span className="text-xs text-gray-500">{stat.sublabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
