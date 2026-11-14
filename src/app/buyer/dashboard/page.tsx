"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Package,
  Clock,
  CheckCircle,
  Truck,
  ExternalLink,
  Lock,
  ArrowRight,
  ShoppingBag,
  User,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface BuyerOrder {
  id: string;
  productTitle: string;
  sellerName: string;
  institution: string;
  amount: number;
  escrowStatus: "in_escrow" | "funds_released";
  deliveryStatus: "dispatched" | "delivered" | "in_inspection";
  trackingNumber: string;
  courier: string;
  daysRemaining: number;
  orderDate: string;
}

interface BuyerProfile {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export default function BuyerDashboardPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [totalInEscrow, setTotalInEscrow] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [releasingId, setReleasingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/buyer/dashboard");

      if (res.status === 401) {
        router.push("/signin?redirect=/buyer/dashboard");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setOrders(data.orders || []);
        setTotalInEscrow(data.totalInEscrow || 0);
      }
    } catch (err) {
      console.error("Failed to load buyer dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleReleaseEscrow = async (orderId: string) => {
    try {
      setReleasingId(orderId);
      const res = await fetch("/api/buyer/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "release_escrow", orderId }),
      });

      const result = await res.json();
      if (result.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, escrowStatus: "funds_released", deliveryStatus: "delivered" }
              : o
          )
        );
        // Recalculate escrow sum
        setTotalInEscrow((prev) => {
          const releasedOrder = orders.find((o) => o.id === orderId);
          return Math.max(0, prev - (releasedOrder?.amount || 0));
        });
        showToast("✅ Protected funds successfully released to the creator!");
      } else {
        showToast(`❌ Error: ${result.error || "Failed to release payment"}`);
      }
    } catch {
      showToast("❌ An unexpected error occurred while releasing payment.");
    } finally {
      setReleasingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] pt-28 pb-24 px-4 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-500">Loading your protected account...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm">
            <CheckCircle size={18} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Profile Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 uppercase font-black text-xl">
              {profile?.fullName ? profile.fullName.charAt(0) : "B"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900">
                  {profile?.fullName || "Commercial Buyer"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Verified Buyer
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {profile?.email || "buyer@company.lk"} · Protected by 7-Day Payment Protection
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
              Payment Protection Rules
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Funds in Safe Escrow */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Protected Funds
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Lock size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">
              Rs. {totalInEscrow.toLocaleString()}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              {totalInEscrow > 0
                ? "Held with Commercial Bank partner until your inspection approval."
                : "No active protected funds. Orders will reflect here."}
            </p>
          </div>

          {/* Active Deliveries */}
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
              Tracked via Domex / Certified Courier API.
            </p>
          </div>

          {/* Institutional Guarantee */}
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

        {/* Orders Section */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Your Protected Purchases &amp; Orders
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Review your active hardware prototype and software deliverables.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 px-3 py-1 rounded-full bg-indigo-50">
              7-Day Inspection Window
            </span>
          </div>

          {orders.length === 0 ? (
            /* Empty State for New Buyers */
            <div className="py-14 px-4 text-center border-2 border-dashed border-gray-200 rounded-2xl space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
                <ShoppingBag size={28} />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base font-black text-gray-900">No Orders Yet</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  You have not placed any orders yet. Discover campus innovations, precision hardware prototypes, and enterprise software verified by top Sri Lankan universities.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/innovations"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all"
                >
                  <ShoppingBag size={14} />
                  <span>Explore Verified Inventions</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
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
                          {order.id.slice(0, 8).toUpperCase()}
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
                        {order.escrowStatus === "in_escrow" ? "🔒 Payment Protected" : "✓ Funds Released"}
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
                          disabled={releasingId === order.id}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer disabled:opacity-60"
                        >
                          {releasingId === order.id ? (
                            <RefreshCw size={13} className="animate-spin" />
                          ) : (
                            <CheckCircle size={13} />
                          )}
                          <span>Inspect &amp; Release Funds</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
