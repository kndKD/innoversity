"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wallet,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  Package,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  X,
  ShieldCheck,
  AlertCircle,
  Settings,
  Store,
  Lock,
} from "lucide-react";
import {
  getStoredVerificationProfiles,
  subscribeToVerification,
  getVerificationPipelineInfo,
  canSellerListProducts,
  VerificationItem,
} from "@/lib/verification-store";

interface SellerOrder {
  id: string;
  item: string;
  buyer: string;
  amount: number;
  status: "pending_shipping" | "in_transit" | "inspection_countdown" | "released";
  courier?: string;
  trackingNumber?: string;
  daysRemaining?: number;
}

export default function SellerDashboardPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([
    {
      id: "ORD-2026-01",
      item: "IoT Paddy Moisture Sensor ×2",
      buyer: "Lanka Agri Supplies",
      amount: 29600,
      status: "inspection_countdown",
      courier: "Domex",
      trackingNumber: "DMX-782914-LK",
      daysRemaining: 6,
    },
    {
      id: "ORD-2026-08",
      item: "FocusFlow Planner System",
      buyer: "Tharindu Wickrama",
      amount: 1850,
      status: "pending_shipping",
    },
    {
      id: "ORD-2026-04",
      item: "SMD Reflow Hotplate Pro",
      buyer: "Kavinda Perera",
      amount: 28500,
      status: "released",
      courier: "Domex",
      trackingNumber: "DMX-661204-LK",
    },
  ]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [targetOrder, setTargetOrder] = useState<SellerOrder | null>(null);
  const [courierCarrier, setCourierCarrier] = useState("Domex");
  const [trackingInput, setTrackingInput] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [sellerProfile, setSellerProfile] = useState<VerificationItem | null>(null);

  useEffect(() => {
    let uId = "usr-kasun-05";
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("innoversity_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          uId = parsed.id;
        } catch {
          // ignore
        }
      }
    }
    const profiles = getStoredVerificationProfiles();
    const current = profiles.find((p) => p.user_id === uId) || profiles[0];
    if (current) setSellerProfile(current);

    const unsubscribe = subscribeToVerification((updatedList) => {
      const match = updatedList.find((p) => p.user_id === uId) || updatedList[0];
      if (match) setSellerProfile(match);
    });

    return () => unsubscribe();
  }, []);

  const openTrackingModal = (order: SellerOrder) => {
    setTargetOrder(order);
    setCourierCarrier(order.courier || "Domex");
    setTrackingInput(order.trackingNumber || "");
    setModalOpen(true);
  };

  const saveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetOrder) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === targetOrder.id
          ? {
              ...o,
              courier: courierCarrier,
              trackingNumber: trackingInput,
              status: "in_transit",
            }
          : o
      )
    );
    setModalOpen(false);
    showToast(`✅ Tracking updated for #${targetOrder.id} (${courierCarrier}: ${trackingInput})`);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Wallet math
  const pendingBalance = orders
    .filter((o) => o.status !== "released")
    .reduce((sum, o) => sum + o.amount, 0);

  const availableBalance = orders
    .filter((o) => o.status === "released")
    .reduce((sum, o) => sum + o.amount, 0);

  const totalEarnings = pendingBalance + availableBalance;

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24">
      {/* Tracking Modal */}
      {modalOpen && targetOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-600">
                  Domex Courier Integration
                </span>
                <h3 className="text-lg font-black text-gray-900">
                  Dispatch Consignment #{targetOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={saveTracking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Courier Partner
                </label>
                <select
                  value={courierCarrier}
                  onChange={(e) => setCourierCarrier(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-900"
                >
                  <option value="Domex">Domex Courier Express</option>
                  <option value="Pronto">Pronto Lanka (Pvt) Ltd</option>
                  <option value="CertCourier">Cert Lanka Express</option>
                  <option value="PickMeFlash">PickMe Flash Same-Day</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Waybill / Tracking Reference Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DMX-998241-LK"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold text-gray-900 uppercase"
                />
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900">
                <span className="font-bold block">Automated Payment Protection Milestone:</span>
                Once Domex scans this parcel as delivered, buyer&apos;s 7-day inspection window starts.
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <Truck size={14} /> Confirm Dispatch &amp; Notify Buyer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-24 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-fade-in-up border border-gray-700">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                {sellerProfile?.shop_name || "Seller Studio"}
              </span>
              {sellerProfile?.verification_status === "admin_approved" || sellerProfile?.verification_status === "approved" ? (
                <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
                  <ShieldCheck size={14} className="text-emerald-600" /> ✓ Fully Verified Creator · {sellerProfile.institution_or_business}
                </span>
              ) : sellerProfile?.verification_status === "verifier_approved" ? (
                <span className="flex items-center gap-1 text-xs text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-bold">
                  <Clock size={13} className="text-blue-600" /> 🏛️ Verifier Signed Off · Awaiting Admin Final Approval
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-bold">
                  <Clock size={13} className="text-amber-600" /> ⏳ KYC Under Verifier Audit ({sellerProfile?.institution_or_business || "Institution"})
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black text-gray-900 mt-1">
              Innovator Dashboard
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage your verified listings, Pay Safely balances, and domestic courier consignments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/seller/dashboard/settings"
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <Settings size={14} /> Shop Settings
            </Link>
            <Link
              href="/onboarding"
              className="px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <ShieldCheck size={14} /> KYC Verification
            </Link>
            {sellerProfile?.verification_status === "admin_approved" || sellerProfile?.verification_status === "approved" ? (
              <Link
                href="/list-innovation"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5"
              >
                <Plus size={15} /> List Innovation
              </Link>
            ) : (
              <Link
                href="/list-innovation"
                className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 font-bold text-xs transition-all flex items-center gap-1.5 border border-gray-200"
                title="Listing locked until Admin Final Approval is granted"
              >
                <Lock size={13} /> List Innovation (Locked)
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Real-Time Verification Tracking Pipeline Stepper ── */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Verification Lifecycle
              </span>
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Clock size={16} className="text-indigo-600" />
                Real-Time Verification Tracking Pipeline
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  sellerProfile?.verification_status === "admin_approved" || sellerProfile?.verification_status === "approved"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : sellerProfile?.verification_status === "verifier_approved"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}
              >
                Current Status: {sellerProfile?.verification_status || "pending"}
              </span>
              <Link
                href="/verifiers"
                className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                Auditor Portal →
              </Link>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Submitted */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                  1. Submitted
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Confirmed
                </span>
              </div>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Credentials &amp; Student ID encrypted with zero-leak masking. Alert sent to verifier.
              </p>
            </div>

            {/* Step 2: Under Verifier Review */}
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1 ${
                sellerProfile?.verification_status === "verifier_approved" ||
                sellerProfile?.verification_status === "admin_approved" ||
                sellerProfile?.verification_status === "approved"
                  ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                  : "bg-amber-50/80 border-amber-200 text-amber-950"
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                      sellerProfile?.verification_status === "verifier_approved" ||
                      sellerProfile?.verification_status === "admin_approved" ||
                      sellerProfile?.verification_status === "approved"
                        ? "bg-emerald-600"
                        : "bg-amber-500 animate-pulse"
                    }`}
                  >
                    {sellerProfile?.verification_status === "verifier_approved" ||
                    sellerProfile?.verification_status === "admin_approved" ||
                    sellerProfile?.verification_status === "approved"
                      ? "✓"
                      : "2"}
                  </span>
                  2. Under Verifier Review
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    sellerProfile?.verification_status === "verifier_approved" ||
                    sellerProfile?.verification_status === "admin_approved" ||
                    sellerProfile?.verification_status === "approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {sellerProfile?.verification_status === "verifier_approved" ||
                  sellerProfile?.verification_status === "admin_approved" ||
                  sellerProfile?.verification_status === "approved"
                    ? "Verifier Signed Off"
                    : "In Review"}
                </span>
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed">
                {sellerProfile?.institution_or_business || "University"} auditor evaluates prototype credibility &amp; faculty endorsement.
              </p>
            </div>

            {/* Step 3: Admin Approved */}
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1 ${
                sellerProfile?.verification_status === "admin_approved" ||
                sellerProfile?.verification_status === "approved"
                  ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                      sellerProfile?.verification_status === "admin_approved" ||
                      sellerProfile?.verification_status === "approved"
                        ? "bg-emerald-600"
                        : "bg-gray-400"
                    }`}
                  >
                    {sellerProfile?.verification_status === "admin_approved" ||
                    sellerProfile?.verification_status === "approved"
                      ? "✓"
                      : "3"}
                  </span>
                  3. Admin Approved
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    sellerProfile?.verification_status === "admin_approved" ||
                    sellerProfile?.verification_status === "approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {sellerProfile?.verification_status === "admin_approved" ||
                  sellerProfile?.verification_status === "approved"
                    ? "Unlocked"
                    : "Locked"}
                </span>
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed">
                Final platform governance sign-off unlocks active marketplace listing &amp; protected payouts.
              </p>
            </div>
          </div>
        </div>

        {/* ── Safe Holding Wallet Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Pending Safe Holding */}
          <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                <Clock size={13} /> In Safe Holding (Pending)
              </span>
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                🔒
              </span>
            </div>
            <h3 className="text-3xl font-black text-gray-900">
              Rs. {pendingBalance.toLocaleString("en-LK")}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Safely held in protected deposit. Auto-releases to payout upon 7-day post-delivery inspection.
            </p>
          </div>

          {/* Card 2: Available for Payout */}
          <div className="bg-white rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle size={13} /> Available for Payout
              </span>
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                💳
              </span>
            </div>
            <h3 className="text-3xl font-black text-emerald-700">
              Rs. {availableBalance.toLocaleString("en-LK")}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Cleared funds ready for instant bank transfer to your Commercial Bank or BOC account.
            </p>
          </div>

          {/* Card 3: Lifetime Volume */}
          <div className="bg-[#080911] text-white rounded-3xl border border-[#1E2240] p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp size={13} /> Lifetime Sales Volume
              </span>
              <span className="w-8 h-8 rounded-xl bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold text-xs">
                📈
              </span>
            </div>
            <h3 className="text-3xl font-black text-white">
              Rs. {totalEarnings.toLocaleString("en-LK")}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              100% verified order completion across 3 academic semesters.
            </p>
          </div>
        </div>

        {/* ── Orders Management Table ── */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-black text-gray-900">
                Recent Protected Orders &amp; Courier Dispatches
              </h3>
              <p className="text-xs text-gray-500">
                Update tracking numbers to start the automatic delivery verification webhook.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Product</th>
                  <th className="pb-3 font-bold">Buyer</th>
                  <th className="pb-3 font-bold">Amount</th>
                  <th className="pb-3 font-bold">Protection Status</th>
                  <th className="pb-3 font-bold">Logistics Tracking</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 font-mono font-bold text-indigo-600">
                      <Link href={`/orders/${ord.id}`} className="hover:underline">
                        {ord.id}
                      </Link>
                    </td>
                    <td className="py-4 font-semibold text-gray-900">{ord.item}</td>
                    <td className="py-4 text-gray-600">{ord.buyer}</td>
                    <td className="py-4 font-black text-gray-900">
                      Rs. {ord.amount.toLocaleString("en-LK")}
                    </td>
                    <td className="py-4">
                      {ord.status === "inspection_countdown" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
                          <Clock size={11} /> 7-Day Auto ({ord.daysRemaining}d left)
                        </span>
                      )}
                      {ord.status === "pending_shipping" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                          Needs Tracking
                        </span>
                      )}
                      {ord.status === "in_transit" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                          <Truck size={11} /> In Transit ({ord.courier})
                        </span>
                      )}
                      {ord.status === "released" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          <CheckCircle size={11} /> Payout Released
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                      {ord.trackingNumber ? (
                        <span className="font-mono text-gray-700">
                          {ord.courier}: {ord.trackingNumber}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No tracking added</span>
                      )}
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => openTrackingModal(ord)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-gray-700 font-bold transition-all"
                      >
                        {ord.trackingNumber ? "Edit Courier" : "Add Tracking"}
                      </button>
                      <Link
                        href={`/orders/${ord.id}`}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all inline-block"
                      >
                        Tracker
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Add Courier Tracking Modal ── */}
      {modalOpen && targetOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                <Truck size={18} className="text-indigo-600" />
                Add Courier Tracking
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveTracking} className="space-y-4 text-xs">
              <div>
                <span className="text-gray-400 block mb-1">Target Order:</span>
                <strong className="text-gray-900 block text-sm">
                  #{targetOrder.id} — {targetOrder.item}
                </strong>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Courier Partner
                </label>
                <select
                  value={courierCarrier}
                  onChange={(e) => setCourierCarrier(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Domex">Domex Courier (Automated Tracking)</option>
                  <option value="SLPost">Sri Lanka Post Registered</option>
                  <option value="Pronto">Pronto Lanka</option>
                  <option value="Certis">Certis Lanka Courier</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Airway Bill / Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="e.g. DMX-889012-LK"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-900 text-[11px] leading-relaxed">
                💡 Entering this tracking number triggers a notification to the buyer and synchronizes delivery status with the 7-day auto-release payment protection countdown.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200"
                >
                  Save &amp; Notify Buyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
