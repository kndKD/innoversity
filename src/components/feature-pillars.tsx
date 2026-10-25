import { ShieldCheck, MessageCircle, Lock, Truck } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    title: "Verified Sellers",
    description:
      "Every seller is vetted by a recognised Sri Lankan university or BR-registered SME body before their first listing goes live.",
  },
  {
    icon: MessageCircle,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
    title: "Safe Messaging",
    description:
      "All buyer-seller communication stays inside Innoversity — no personal numbers shared until an order is confirmed.",
  },
  {
    icon: Lock,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    title: "Pay Safely Protection",
    description:
      "Payment is safely held in our protected deposit and only released to the creator after you confirm delivery — protecting both sides of every transaction.",
  },
  {
    icon: Truck,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
    title: "Delivery Support",
    description:
      "Integrated with local courier networks covering all 25 districts. Track your order in real time from dispatch to door.",
  },
];

export default function FeaturePillars() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold tracking-wide uppercase mb-3">
            Built for trust
          </span>
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl font-black text-gray-900 mb-3"
          >
            Why Innoversity is different
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Four layers of trust baked into every transaction — not bolted on as an afterthought.
          </p>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col gap-4 p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg hover:shadow-indigo-50/80 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl ${pillar.iconBg} flex items-center justify-center shrink-0`}
              >
                <pillar.icon size={22} className={pillar.iconColor} strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-gray-900 text-base">{pillar.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
