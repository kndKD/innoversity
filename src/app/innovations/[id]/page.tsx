"use client";

import { useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { mockProducts } from "@/lib/mock-data";
import {
  ShieldCheck,
  MapPin,
  Lock,
  Star,
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  Truck,
  FileCheck,
  Sparkles,
  ChevronRight,
  Share2,
  Building2,
  AlertCircle,
} from "lucide-react";

function formatPrice(n: number) {
  return `Rs. ${n.toLocaleString("en-LK")}`;
}

function categoryEmoji(cat: string): string {
  const m: Record<string, string> = {
    "IT Solutions & Services": "💻",
    AgriTech: "🌾",
    EdTech: "📚",
    "IoT & Hardware": "📡",
    "Health & Wellness": "💧",
    "Food & Beverage": "🫙",
    Electronics: "⚡",
    Environment: "🌿",
    Productivity: "📓",
  };
  return m[cat] ?? "💡";
}

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // Find product by id, or match partial slug, or fallback to first product
  const product =
    mockProducts.find((p) => p.id === id) ||
    mockProducts.find((p) => p.title.toLowerCase().includes("focus") && id?.includes("focus")) ||
    mockProducts[0];

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"story" | "specs" | "milestones">(
    product.isService ? "milestones" : "story"
  );
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product.isService) {
      router.push("/orders/ORD-2026-IT");
    } else {
      router.push("/orders/ORD-2026-01");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 overflow-hidden">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="shrink-0 text-gray-400" />
            <Link href="/innovations" className="hover:text-indigo-600 transition-colors">
              Innovations
            </Link>
            <ChevronRight size={14} className="shrink-0 text-gray-400" />
            <span className="text-gray-900 font-semibold truncate max-w-[200px]">
              {product.title}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-indigo-300 hover:text-indigo-600 bg-white transition-all"
          >
            <Share2 size={13} />
            {copied ? "Link Copied!" : "Share"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/innovations"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left 7 Cols: Visuals, Story, Verification ── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visual Hero Card */}
            <div
              className={`relative h-80 rounded-3xl bg-gradient-to-br ${product.imageGradient} flex flex-col justify-between p-8 text-white shadow-xl shadow-indigo-100/50 overflow-hidden`}
            >
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Ccircle cx='4' cy='4' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <div className="relative flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider border border-white/30">
                  {product.category}
                </span>
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/25 backdrop-blur-md text-xs font-semibold border border-white/20">
                  <MapPin size={12} /> {product.district} District
                </span>
              </div>

              <div className="relative flex items-center justify-center py-6">
                <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-5xl shadow-2xl">
                  {categoryEmoji(product.category)}
                </div>
              </div>

              <div className="relative flex items-center justify-between text-xs text-white/90">
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-amber-300 fill-amber-300" />
                  <strong className="font-bold text-white">{product.rating}</strong> ({product.reviewCount} reviews)
                </span>
                <span>{product.unitsSold} orders completed with Pay Safely</span>
              </div>
            </div>

            {/* Academic / BR Verification Proof Card */}
            <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -z-0" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <ShieldCheck size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600">
                      Institutional Credential
                    </span>
                    <h3 className="text-base font-black text-gray-900">
                      {product.verifierInstitution}
                    </h3>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <FileCheck size={14} /> Verified On {product.verifiedAt}
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-gray-400 font-medium">Verification Status</p>
                  <p className="font-bold text-emerald-700 mt-0.5">Faculty / BR Certified</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-gray-400 font-medium">Privacy Protection</p>
                  <p className="font-bold text-gray-800 mt-0.5">Masked Seller NIC</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-gray-400 font-medium">Protection Mode</p>
                  <p className="font-bold text-indigo-700 mt-0.5">
                    {product.isService ? "50/50 Milestone Protection" : "Pay Safely (7-Day Auto Hold)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs: Story Behind It / Specifications / Milestones */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-3 flex-wrap">
                {product.isService && (
                  <button
                    onClick={() => setActiveTab("milestones")}
                    className={`text-sm font-bold pb-2 transition-all relative ${
                      activeTab === "milestones"
                        ? "text-indigo-600 after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-indigo-600"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    Pay Safely Milestones &amp; Deliverables
                  </button>
                )}
                <button
                  onClick={() => setActiveTab("story")}
                  className={`text-sm font-bold pb-2 transition-all relative ${
                    activeTab === "story"
                      ? "text-indigo-600 after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-indigo-600"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {product.isService ? "Service Architecture & Overview" : "The Story Behind It"}
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`text-sm font-bold pb-2 transition-all relative ${
                    activeTab === "specs"
                      ? "text-indigo-600 after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-indigo-600"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  Technical Specifications
                </button>
              </div>

              {activeTab === "milestones" && product.serviceMilestones ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-indigo-600" />
                      Two-Stage Pay Safely Milestone Roadmap
                    </h4>
                    <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
                      100% Safe Holding Protection
                    </span>
                  </div>
                  <div className="space-y-3">
                    {product.serviceMilestones.map((m, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#F8F7FF] border border-indigo-100 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-black text-indigo-900">{m.title}</strong>
                          <span className="font-mono text-xs font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                            {formatPrice(product.price * (m.percentage / 100))}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{m.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
                    <strong>Milestone Guarantee:</strong> Each milestone requires your explicit sign-off in the Order Protection Tracker.
                    Funds for Milestone 2 are never released until you inspect the production setup and receive admin credentials.
                  </div>
                </div>
              ) : activeTab === "story" ? (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles size={18} className="text-indigo-600" />
                    {product.isService ? "About this IT Solution Package" : "How this innovation was born"}
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                    {product.fullStory}
                  </p>
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                    <strong>Creator Note:</strong> Developed under the mentorship of university faculty
                    and tested with Sri Lankan enterprises. Every engagement directly supports verified local tech talent.
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs text-gray-600">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-400 block mb-1">Provider Agency / Student</span>
                      <strong className="text-gray-800 text-sm">{product.sellerName}</strong>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-400 block mb-1">Service Tier</span>
                      <strong className="text-gray-800 text-sm capitalize">{product.sellerType} Tier Service</strong>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                    <p className="font-bold text-gray-800">Key Tags &amp; Certifications:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {product.tags.map((t) => (
                        <span key={t} className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right 5 Cols: Buy Now & Escrow Protection ── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Purchase Box */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-lg shadow-indigo-100/40 space-y-6 sticky top-24">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-2">
                  {product.isService ? "Verified IT Service Package" : "Verified In Stock"}
                </span>
                <h1 className="text-2xl font-black text-gray-900 leading-tight">
                  {product.title}
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Provided by <span className="text-gray-700 font-semibold">{product.sellerName}</span>
                </p>
              </div>

              <div className="flex items-baseline justify-between border-y border-gray-100 py-4">
                <div>
                  <span className="text-3xl font-black text-indigo-600">
                    {formatPrice(product.price * (product.isService ? 1 : quantity))}
                  </span>
                  {product.isService ? (
                    <span className="text-xs text-indigo-600 font-semibold block mt-0.5">
                      Milestone 1 Deposit: {formatPrice(product.price * 0.5)} (50%)
                    </span>
                  ) : quantity > 1 ? (
                    <span className="text-xs text-gray-400 block mt-0.5">
                      ({formatPrice(product.price)} each)
                    </span>
                  ) : null}
                </div>

                {/* Quantity Control (only for physical goods) */}
                {!product.isService ? (
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl">
                    Fixed Scope Package
                  </span>
                )}
              </div>

              {/* Pay Safely Protection Box */}
              {product.isService ? (
                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/70 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                    <ShieldCheck size={16} className="text-indigo-600" />
                    Pay Safely Guarantee — Safe Holding Protection
                  </div>
                  <p className="text-[11px] text-indigo-800 leading-relaxed">
                    Pay Safely Guarantee — Your money is safely held in our protected deposit and released to the creator only after you receive and confirm your item/service. (50% kickoff deposit held, 50% upon final UAT approval).
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    Pay Safely Guarantee
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Pay Safely Guarantee — Your money is safely held in our protected deposit and released to the creator only after you receive and confirm your item/service.
                  </p>
                </div>
              )}

              {/* Secure Payment Step / Checkout Flow Button */}
              <button
                id="buy-now-escrow-action"
                onClick={handleBuyNow}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-xl shadow-indigo-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck size={18} />
                Pay Safely (Protected Deposit)
              </button>

              <div className="space-y-3 pt-2 text-xs text-gray-500">
                {product.isService ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-indigo-600" />
                      <span>Digital Deployment &amp; GitHub/GitLab Repository Handover (Zero Courier)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span>14-Day UAT Testing &amp; Bug-Fix Warranty Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock size={14} className="text-amber-600" />
                      <span>Zero personal contact leak: Protected by Innoversity RLS Layer</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Truck size={14} className="text-indigo-600" />
                      <span>Island-wide tracking via Domex Courier &amp; SL Post (1-3 days)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span>Zero risk 100% money-back guarantee in case of dispute</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-gray-400">Loading innovation...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
