"use client";

import Link from "next/link";
import { ShieldCheck, MapPin, Lock, Star, ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/mock-data";
import { clsx } from "clsx";

interface ProductCardProps {
  product: Product;
}

function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-LK")}`;
}

function categoryEmoji(category: string): string {
  const map: Record<string, string> = {
    "IT Solutions & Services": "💻",
    "AgriTech": "🌾",
    "EdTech": "📚",
    "IoT & Hardware": "📡",
    "Health & Wellness": "💧",
    "Food & Beverage": "🫙",
    "Electronics": "⚡",
    "Environment": "🌿",
    "Productivity": "📓",
  };
  return map[category] ?? "💡";
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/innovations/${product.id}`}
      className="block group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl"
    >
      <article
        className={clsx(
          "h-full relative bg-white rounded-2xl border border-gray-100 shadow-sm",
          "group-hover:shadow-xl group-hover:shadow-indigo-100/60 group-hover:-translate-y-1 group-hover:border-indigo-200",
          "transition-all duration-300 ease-out overflow-hidden flex flex-col"
        )}
        aria-label={`Product: ${product.title}`}
      >
        {/* ── Image / Gradient Thumbnail ──────────────────────────────── */}
        <div
          className={`relative h-44 bg-gradient-to-br ${product.imageGradient} flex items-center justify-center overflow-hidden`}
        >
          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Ccircle cx='4' cy='4' r='1.5'/%3E%3Ccircle cx='20' cy='4' r='1.5'/%3E%3Ccircle cx='12' cy='12' r='1.5'/%3E%3Ccircle cx='28' cy='12' r='1.5'/%3E%3Ccircle cx='4' cy='20' r='1.5'/%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3Ccircle cx='12' cy='28' r='1.5'/%3E%3Ccircle cx='28' cy='28' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Category chip (top-left) */}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/25 backdrop-blur-sm text-white text-xs font-semibold border border-white/30">
            {product.category}
          </span>

          {/* Safe Holding badge (top-right) */}
          {product.isService ? (
            <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-semibold shadow-sm">
              <ShieldCheck size={11} strokeWidth={2.5} />
              Pay Safely
            </span>
          ) : product.isEscrowSafe ? (
            <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-semibold shadow-sm">
              <ShieldCheck size={11} strokeWidth={2.5} />
              Pay Safely
            </span>
          ) : null}

          {/* Center emoji icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30 group-hover:scale-110 transition-transform duration-300">
            <span className="text-3xl" role="img" aria-hidden>
              {categoryEmoji(product.category)}
            </span>
          </div>

          {/* Hover prompt icon */}
          <div className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight size={16} />
          </div>
        </div>

        {/* ── Card Body ────────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* District */}
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <MapPin size={11} strokeWidth={2} />
            <span>{product.district} District</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>

          {/* Story snippet */}
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
            {product.storySnippet}
          </p>

          {/* Verified badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 w-fit max-w-full">
            <ShieldCheck size={13} className="text-emerald-600 shrink-0" strokeWidth={2.5} />
            <span className="text-emerald-700 text-xs font-semibold truncate">
              {product.verifierInstitution}
            </span>
          </div>

          {/* Bottom row: rating + price */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-50">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviewCount})</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-indigo-700">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          {/* Safe Holding release time */}
          {product.isService ? (
            <p className="text-[11px] text-indigo-600 font-semibold -mt-1 flex items-center gap-1">
              🛡️ 50/50 Safe Holding Protection (Deposit + UAT Approval)
            </p>
          ) : product.isEscrowSafe && product.escrowReleaseDays ? (
            <p className="text-[11px] text-emerald-600 font-medium -mt-1 flex items-center gap-1">
              🛡️ Pay Safely · Funds released {product.escrowReleaseDays} days after delivery
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
