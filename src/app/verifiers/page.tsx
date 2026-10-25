"use client";

import { useState } from "react";
import Link from "next/link";
import { mockVerifierQueue, VerifierQueueItem } from "@/lib/mock-data";
import {
  ShieldCheck,
  EyeOff,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  UserCheck,
  AlertCircle,
  ChevronRight,
  Filter,
  CheckSquare,
  Square,
  Lock,
} from "lucide-react";

export default function VerifiersPage() {
  const [queue, setQueue] = useState<VerifierQueueItem[]>(mockVerifierQueue);
  const [selectedId, setSelectedId] = useState<string>(mockVerifierQueue[0].id);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "under_review" | "approved">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 4-point verification checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    identity: true,
    prototype: true,
    faculty: false,
    escrowAgreement: false,
  });

  const selectedItem = queue.find((q) => q.id === selectedId) || queue[0];

  const filteredQueue = queue.filter((item) => {
    if (filterStatus === "all") return true;
    return item.status === filterStatus;
  });

  const toggleChecklist = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApprove = () => {
    const allChecked = Object.values(checklist).every(Boolean);
    if (!allChecked) {
      showToast("⚠️ Complete all 4 checklist points before approving verification.");
      return;
    }
    setQueue((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id ? { ...item, status: "approved" } : item
      )
    );
    showToast(`✅ Successfully approved & issued badge for "${selectedItem.productTitle}"!`);
  };

  const handleReject = () => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id ? { ...item, status: "rejected" as any } : item
      )
    );
    showToast(`❌ Verification rejected for "${selectedItem.productTitle}". Notified applicant.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-fade-in-up border border-gray-700">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                Auditor Access
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <Lock size={12} /> Strict RLS Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Privacy-First Verifier Portal
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Review and certify student and SME innovations without accessing unmasked personal PII.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/signin"
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Switch Role
            </Link>
          </div>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 cols): Queue List */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Clock size={16} className="text-indigo-600" />
                Verification Queue ({filteredQueue.length})
              </h3>
              <div className="flex items-center gap-1">
                {(["all", "pending", "under_review", "approved"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold capitalize transition-colors ${
                      filterStatus === st
                        ? "bg-indigo-600 text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredQueue.map((item) => {
                const isSelected = item.id === selectedItem.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? "bg-indigo-50/60 border-indigo-300 shadow-sm"
                        : "bg-white border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-black text-gray-900 line-clamp-1">
                        {item.productTitle}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                          item.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "under_review"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{item.institution}</span>
                      <span className="font-mono text-gray-400">{item.maskedNic}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-100/80">
                      <span>{item.applicantName}</span>
                      <span>{item.documentsCount} docs attached</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (7 cols): Split-Screen Active Review */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Active Review File: #{selectedItem.id}
                </span>
                <h2 className="text-xl font-black text-gray-900 mt-1">
                  {selectedItem.productTitle}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold">
                  Submitted {selectedItem.submittedAt}
                </span>
              </div>
            </div>

            {/* Privacy Redaction Box */}
            <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-[#0F1120] text-white p-5 space-y-3 border border-gray-800">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Privacy-First Redaction Layer (Zero-Leak)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  RLS RESTRICTED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700">
                  <span className="text-gray-400 block text-[10px] uppercase">Applicant NIC</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {selectedItem.maskedNic}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700">
                  <span className="text-gray-400 block text-[10px] uppercase">Endorsing Entity</span>
                  <span className="text-indigo-300 font-bold text-xs truncate block">
                    {selectedItem.institution}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700">
                  <span className="text-gray-400 block text-[10px] uppercase">Phone / Contact</span>
                  <span className="text-amber-400 font-bold text-xs flex items-center gap-1 mt-0.5">
                    <EyeOff size={12} /> 🔒 Hidden at API/RLS Level
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700">
                  <span className="text-gray-400 block text-[10px] uppercase">Payout Account</span>
                  <span className="text-amber-400 font-bold text-xs flex items-center gap-1 mt-0.5">
                    <EyeOff size={12} /> 🔒 Hidden at API/RLS Level
                  </span>
                </div>
              </div>
            </div>

            {/* Document Verification Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-900">
                  4-Point Institutional Verification Checklist
                </h4>
                <span className="text-xs text-gray-500">
                  {Object.values(checklist).filter(Boolean).length}/4 Verified
                </span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: "identity",
                    label: "Student Registration / SME Business Registration Validity",
                    desc: "Verified institutional student record or Registrar of Companies active BR status.",
                  },
                  {
                    id: "prototype",
                    label: "Hardware Prototype / Formulation Batch Evidence",
                    desc: "Tested laboratory test results, prototype schematic photos, or safety certificates.",
                  },
                  {
                    id: "faculty",
                    label: "Faculty Department / Chamber Recommendation Endorsement",
                    desc: "Head of Department or Chamber Secretary recommendation letter on official letterhead.",
                  },
                  {
                    id: "escrowAgreement",
                    label: "Escrow 7-Day Auto-Release & Dispute Compliance Undertaking",
                    desc: "Applicant signed acceptance of Innoversity standardized escrow release terms.",
                  },
                ].map((item) => {
                  const isChecked = checklist[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? "bg-emerald-50/50 border-emerald-200"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <button className="mt-0.5 text-emerald-600 shrink-0">
                        {isChecked ? (
                          <CheckSquare size={18} className="text-emerald-600" />
                        ) : (
                          <Square size={18} className="text-gray-400" />
                        )}
                      </button>
                      <div className="text-xs">
                        <strong className={`block ${isChecked ? "text-emerald-950" : "text-gray-800"}`}>
                          {item.label}
                        </strong>
                        <p className="text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                id="verifier-approve-btn"
                onClick={handleApprove}
                className="w-full sm:flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={17} />
                Approve &amp; Assign Verified Badge
              </button>

              <button
                id="verifier-reject-btn"
                onClick={handleReject}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <XCircle size={17} />
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
