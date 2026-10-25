"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Package,
  Clock,
  CheckCircle,
  Truck,
  ExternalLink,
  Lock,
  ArrowRight,
  Download,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  Building,
  User,
} from "lucide-react";

interface BuyerOrder {
  id: string;
  productTitle: string;
  sellerName: string;
  institution: string;
  amount: number;
  escrowStatus: "in_escrow" | "funds_released" | "dispute_period";
  deliveryStatus: "dispatched" | "delivered" | "in_inspection";
  trackingNumber: string;
  courier: string;
  daysRemaining: number;
  orderDate: string;
}

const initialOrders: BuyerOrder[] = [
  {
    id: "ORD-2026-01",
    productTitle: "Smart IoT Poultry Incubator (Automated Humidity & Temp)",
    sellerName: "Kasun Perera",
    institution: "University of Moratuwa (ITUM)",
    amount: 58100,
    escrowStatus: "in_escrow",
    deliveryStatus: "dispatched",
    trackingNumber: "DX-774921LK",
    courier: "Domex Courier Express",
    daysRemaining: 4,
    orderDate: "2026-10-22",
  },
  {
    id: "ORD-2026-IT",
    productTitle: "B2B Enterprise POS & Inventory System Setup",
    sellerName: "SyncLanka Enterprise IT Solutions",
    institution: "SLIIT Verified Creators",
    amount: 85000,
    escrowStatus: "in_escrow",
    deliveryStatus: "in_inspection",
    trackingNumber: "E-DELIVERY-SL",
    courier: "Direct Digital Handover",
    daysRemaining: 6,
    orderDate: "2026-10-24",
  },
];

export default function BuyerDashboardPage() {
  const [orders, setOrders] = useState<BuyerOrder[]>(initialOrders);
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("innoversity_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const totalInEscrow = orders
    .filter((o) => o.escrowStatus === "in_escrow")
    .reduce((sum, o) => sum + o.amount, 0);

  const handleReleaseEscrow = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, escrowStatus: "funds_released", deliveryStatus: "delivered" }
          : o
      )
    );
    showToast(`✅ Escrow released for ${orderId}. Funds successfully paid to the inventor!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm animate-bounce">
            <CheckCircle size={18} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Profile Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
              <User size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900">
                  {user?.full_name || "Commercial Buyer"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Verified Buyer
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {user?.email || "buyer@company.lk"} · Protected by 7-Day Innoversity Escrow
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/innovations"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
            >
              <ShoppingBag size={15} />
              <span>Browse Inventions</span>
            </Link>
            <Link
              href="/how-it-works"
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-xs transition-all"
            >
              Escrow Protection Rules
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Funds in Safe Escrow
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Lock size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">
              Rs. {totalInEscrow.toLocaleString()}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Held with Commercial Bank partner until your inspection approval.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Active Deliveries
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Truck size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{orders.length} Orders</div>
            <p className="text-[11px] text-gray-500 mt-1">
              Tracked via Domex / Cert Courier API.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Institutional Guarantee
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600">100% Protected</div>
            <p className="text-[11px] text-gray-500 mt-1">
              Zero fraud guarantee backed by faculty audit.
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Your Escrow Purchases &amp; Orders
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Review your active hardware prototype and software deliverables.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 px-3 py-1 rounded-full bg-indigo-50">
              7-Day Inspection Window
            </span>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-all bg-gray-50/40 space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 px-2 py-0.5 rounded bg-indigo-50">
                        {order.id}
                      </span>
                      <span className="text-xs text-gray-400">· {order.orderDate}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1 border border-emerald-200">
                        <ShieldCheck size={12} /> {order.institution}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-gray-900">{order.productTitle}</h3>
                    <p className="text-xs text-gray-500">
                      Seller: <strong className="text-gray-700">{order.sellerName}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-gray-900">
                      Rs. {order.amount.toLocaleString()}
                    </div>
                    <span
                      className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 ${
                        order.escrowStatus === "in_escrow"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {order.escrowStatus === "in_escrow" ? "🔒 Escrow Locked" : "✓ Funds Released"}
                    </span>
                  </div>
                </div>

                {/* Tracking & Release Action Bar */}
                <div className="pt-3 border-t border-gray-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Truck size={14} className="text-blue-600" />
                      {order.courier}:{" "}
                      <span className="font-mono font-bold text-gray-900">
                        {order.trackingNumber}
                      </span>
                    </span>
                    {order.escrowStatus === "in_escrow" && (
                      <span className="flex items-center gap-1 text-amber-700 font-semibold">
                        <Clock size={13} /> {order.daysRemaining} days remaining in inspection
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold transition-all flex items-center gap-1"
                    >
                      <span>Track Status</span>
                      <ExternalLink size={12} />
                    </Link>

                    {order.escrowStatus === "in_escrow" && (
                      <button
                        onClick={() => handleReleaseEscrow(order.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle size={13} />
                        <span>Inspect &amp; Release Funds</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
