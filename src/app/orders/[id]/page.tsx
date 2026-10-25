"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Truck,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowLeft,
  ChevronRight,
  Package,
  X,
  FileText,
  PauseCircle,
} from "lucide-react";

function OrderTrackingContent() {
  const params = useParams();
  const orderId = (params?.id as string) || "ORD-2026-01";

  // Progress Bar State: 1 = Vaulted, 2 = Dispatched, 3 = Delivered (7-day timer running), 4 = Released
  const [currentStep, setCurrentStep] = useState<number>(3);
  const [isDisputed, setIsDisputed] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("defective");
  const [disputeNote, setDisputeNote] = useState("");
  const [confirmedSuccess, setConfirmedSuccess] = useState(false);

  // Live Countdown Timer (starting from 6 days, 14 hours, 22 mins, 18 secs)
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 14,
    minutes: 22,
    seconds: 18,
  });

  useEffect(() => {
    if (isDisputed || currentStep === 4) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        // When zero is reached, auto-release!
        setCurrentStep(4);
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDisputed, currentStep]);

  const handleConfirmReceipt = () => {
    setCurrentStep(4);
    setConfirmedSuccess(true);
  };

  const handleRaiseDispute = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisputed(true);
    setDisputeModalOpen(false);
  };

  const isServiceOrder = orderId.includes("IT") || orderId === "ORD-2026-IT";

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link href="/innovations" className="hover:text-indigo-600 transition-colors">Orders</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="font-mono font-bold text-gray-900">{orderId}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase">
              {isServiceOrder ? "Pay Safely Milestone" : "Pay Safely Protected"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Link
          href="/innovations"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Innovations
        </Link>

        {/* ── Order Overview Card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-600">
                {isServiceOrder ? "Pay Safely Milestone Contract" : "Pay Safely Protected Order"}: #{orderId}
              </span>
              <h1 className="text-2xl font-black text-gray-900 mt-0.5">
                {isServiceOrder
                  ? "B2B Enterprise POS & Inventory System Setup"
                  : "IoT Paddy Moisture Sensor & Auto Aerator ×2"}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Verified Provider:{" "}
                <span className="font-semibold text-gray-700">
                  {isServiceOrder
                    ? "SyncLanka Enterprise IT Solutions · Moratuwa Verified SME"
                    : "K. Perera & Team — ITUM · University of Moratuwa"}
                </span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400 block">Total Protected Deposit</span>
              <span className="text-2xl font-black text-indigo-700">
                {isServiceOrder ? "Rs. 85,000" : "Rs. 29,600"}
              </span>
              {isServiceOrder && (
                <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                  Milestone 1 (50%) Cleared · Milestone 2 in Protected Hold
                </span>
              )}
            </div>
          </div>

          {/* ── 4-Step Progress Bar ── */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {isServiceOrder ? "Pay Safely Milestone Roadmap" : "Pay Safely Order Steps"}
              </span>
              <span className="text-xs font-semibold text-gray-700">
                {currentStep === 1 && (isServiceOrder ? "Stage 1: 50% Kickoff Deposit Protected" : "Stage 1: Funds Held in Safe Deposit")}
                {currentStep === 2 && (isServiceOrder ? "Stage 2: Milestone 1 Approved (Cloud Setup Cleared)" : "Stage 2: Dispatched via Domex Courier")}
                {currentStep === 3 && (isDisputed ? "⚠️ Timer Frozen (Dispute Under Review)" : isServiceOrder ? "Stage 3: Milestone 2 in 7-Day Testing & Verification" : "Stage 3: Delivered & In 7-Day Inspection")}
                {currentStep === 4 && (isServiceOrder ? "Stage 4: Milestone 2 Approved & Production Handover Complete" : "Stage 4: Funds Cleared & Released to Seller")}
              </span>
            </div>

            {/* Stepper graphical line */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {(isServiceOrder
                ? [
                    { step: 1, label: "Kickoff", desc: "50% Protected" },
                    { step: 2, label: "Milestone 1", desc: "DB/Cloud (Cleared)" },
                    { step: 3, label: "Milestone 2", desc: "UAT Signoff Hold" },
                    { step: 4, label: "Handover", desc: "100% Released" },
                  ]
                : [
                    { step: 1, label: "Protected", desc: "Safe Deposit" },
                    { step: 2, label: "Dispatched", desc: "Domex LK" },
                    { step: 3, label: "Inspection", desc: "7-Day Timer" },
                    { step: 4, label: "Released", desc: "Paid to Seller" },
                  ]
              ).map((s) => {
                const isPassed = currentStep > s.step;
                const isCurrent = currentStep === s.step;
                return (
                  <div key={s.step} className="space-y-2">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        isPassed
                          ? "bg-emerald-500"
                          : isCurrent
                          ? isDisputed
                            ? "bg-rose-500 animate-pulse"
                            : "bg-amber-500 animate-pulse"
                          : "bg-gray-100"
                      }`}
                    />
                    <div>
                      <span className={`block text-xs font-bold ${isCurrent ? "text-indigo-600" : "text-gray-800"}`}>
                        {s.step}. {s.label}
                      </span>
                      <span className="text-[10px] text-gray-400 block">{s.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Live Countdown Timer Box ── */}
          <div
            className={`rounded-2xl p-6 border transition-all ${
              isDisputed
                ? "bg-rose-50 border-rose-200"
                : currentStep === 4
                ? "bg-emerald-50 border-emerald-200"
                : "bg-amber-50/80 border-amber-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span
                  className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    isDisputed
                      ? "text-rose-800"
                      : currentStep === 4
                      ? "text-emerald-800"
                      : "text-amber-800"
                  }`}
                >
                  {isDisputed ? (
                    <><PauseCircle size={16} /> Pay Safely Auto-Release Frozen</>
                  ) : currentStep === 4 ? (
                    <><CheckCircle size={16} /> Funds Released to Seller Account</>
                  ) : (
                    <><Clock size={16} /> Pay Safely 7-Day Auto-Release Protection</>
                  )}
                </span>
                <p className="text-xs text-gray-600 max-w-md">
                  {isDisputed
                    ? "Dispute filed: timer is completely frozen. Our academic verifiers are reviewing photos and courier logs."
                    : currentStep === 4
                    ? (isServiceOrder
                        ? "Order & contract completed! Rs. 85,000 has been transferred directly into the verified agency's bank account."
                        : "Order completed! Rs. 29,600 has been transferred directly into the student innovator's bank account.")
                    : (isServiceOrder
                        ? "The remaining 50% milestone balance will auto-release upon UAT period conclusion unless a dispute is filed."
                        : "The funds will automatically release into the seller's account when the countdown ends, unless you raise a dispute.")}
                </p>
              </div>

              {/* Digits Display */}
              {!isDisputed && currentStep !== 4 && (
                <div className="flex items-center gap-2 font-mono">
                  {[
                    { label: "DAYS", val: String(timeLeft.days).padStart(2, "0") },
                    { label: "HRS", val: String(timeLeft.hours).padStart(2, "0") },
                    { label: "MIN", val: String(timeLeft.minutes).padStart(2, "0") },
                    { label: "SEC", val: String(timeLeft.seconds).padStart(2, "0") },
                  ].map((unit, i) => (
                    <div key={unit.label} className="flex items-center gap-2">
                      <div className="bg-white rounded-xl px-3 py-2 text-center border border-amber-200 shadow-sm">
                        <span className="block text-xl font-black text-amber-900">{unit.val}</span>
                        <span className="block text-[9px] text-amber-700 font-sans font-bold">{unit.label}</span>
                      </div>
                      {i < 3 && <span className="text-amber-800 font-black text-lg">:</span>}
                    </div>
                  ))}
                </div>
              )}

              {isDisputed && (
                <div className="px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-700 font-mono font-bold text-xs">
                  TIMER FROZEN AT STAGE 3
                </div>
              )}

              {currentStep === 4 && (
                <div className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-700 font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle size={15} /> RELEASED 100%
                </div>
              )}
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {currentStep < 4 && !isDisputed && (
              <>
                <button
                  id="confirm-receipt-release-btn"
                  onClick={handleConfirmReceipt}
                  className="w-full sm:flex-1 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle size={18} />
                  {isServiceOrder
                    ? "Confirm Milestone (Release Funds)"
                    : "Confirm Receipt (Release Funds)"}
                </button>

                <button
                  id="raise-dispute-btn"
                  onClick={() => setDisputeModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <AlertTriangle size={17} />
                  Raise Dispute
                </button>
              </>
            )}

            {currentStep === 4 && (
              <div className="w-full p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-sm font-bold text-emerald-800 flex items-center justify-center gap-2">
                  <CheckCircle size={18} />
                  {isServiceOrder
                    ? "Thank you! Milestone 2 sign-off confirmed. Rs. 85,000 has been transferred to SyncLanka Enterprise IT Solutions."
                    : "Thank you! You verified this prototype and supported university innovation."}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Delivery Logistics or Digital Handover Card ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isServiceOrder ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                <span className="p-1 rounded-lg bg-indigo-50 text-indigo-600 font-bold">💻</span>
                Digital Deliverables &amp; Deployment Handover
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Staging Sandbox:</span>
                  <a
                    href="https://uat-pos.synclanka.lk"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono font-bold text-indigo-600 hover:underline"
                  >
                    https://uat-pos.synclanka.lk
                  </a>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Source Repository:</span>
                  <span className="font-mono font-bold text-gray-800">github.com/synclanka/enterprise-pos</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Tax Compliance:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    RAMIS VAT v2.1 Certified
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400">Deployment SLA:</span>
                  <span className="font-semibold text-gray-800">14-Day Free Hotfix Warranty Active</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                <Truck size={17} className="text-indigo-600" />
                Domex Courier Tracking Consignment
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Airway Bill:</span>
                  <span className="font-mono font-bold text-gray-800">DMX-782914-LK</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Carrier Service:</span>
                  <span className="font-semibold text-gray-800">Domex Express (Door-to-Door)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Delivery Address:</span>
                  <span className="font-semibold text-gray-800 text-right">No. 42, Galle Road, Colombo 03</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400">Delivered Timestamp:</span>
                  <span className="font-semibold text-emerald-600">2026-10-24 11:34 AM</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
              <ShieldCheck size={17} className="text-emerald-600" />
              {isServiceOrder
                ? "Privacy-First Verified Creator Credentials"
                : "Pay Safely Safe Holding Guarantee"}
            </h3>
            {isServiceOrder ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Audited Agency:</span>
                  <span className="font-bold text-gray-800">SyncLanka IT Solutions</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Verification Body:</span>
                  <span className="font-bold text-indigo-700">University of Moratuwa / BR Audit</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Privacy Status:</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    NIC: XXXXXX-XXX-4821 (Masked)
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400">Safe Holding Protection:</span>
                  <span className="text-gray-600">50% Release upon UAT Sign-off only</span>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Innoversity guarantees that neither buyer nor seller is exposed to financial loss.
                  If an item is damaged or not as represented, our resolution desk refunds 100% of the held protected deposit sum.
                </p>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-[11px] text-gray-600 space-y-1">
                  <strong>Need emergency mediation?</strong>
                  <p>Email: <a href="mailto:help@innoversity.lk" className="text-indigo-600 font-semibold underline">help@innoversity.lk</a> or visit our <Link href="/info/help-centre" className="text-indigo-600 underline">Help Centre</Link>.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Raise Dispute Modal ── */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-rose-600 text-base flex items-center gap-2">
                <AlertTriangle size={18} />
                Raise Dispute
              </h3>
              <button
                onClick={() => setDisputeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRaiseDispute} className="space-y-4 text-xs">
              <p className="text-gray-600 leading-relaxed">
                Raising a dispute will <strong>immediately freeze the 7-day auto-release timer</strong> and hold the protected deposit until resolution.
              </p>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Reason for Dispute
                </label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {isServiceOrder ? (
                    <>
                      <option value="uat_failure">Software Bug / Critical UAT Failure</option>
                      <option value="missing_module">Incomplete Scope / Missing RAMIS Tax or Inventory Module</option>
                      <option value="sla_breach">Non-Responsive Developer / SLA Breach</option>
                      <option value="credentials_withheld">Source Code &amp; Admin Credentials Not Transferred</option>
                    </>
                  ) : (
                    <>
                      <option value="defective">Hardware Defect / Not Functional</option>
                      <option value="mismatch">Item Does Not Match University Specification</option>
                      <option value="damage">Damaged in Domex Courier Transit</option>
                      <option value="missing">Incomplete Parts / Missing Sensors</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description of Issue
                </label>
                <textarea
                  rows={3}
                  value={disputeNote}
                  onChange={(e) => setDisputeNote(e.target.value)}
                  placeholder={
                    isServiceOrder
                      ? "Provide bug logs, reproduction steps, or missing endpoint details..."
                      : "Provide test details or serial mismatch details..."
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDisputeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200"
                >
                  Freeze Timer &amp; Open Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-gray-400">Loading order tracker...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
