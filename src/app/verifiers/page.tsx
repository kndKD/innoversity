"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  ExternalLink,
  Store,
  FileCheck,
  Eye,
  Building2,
  MapPin,
  Sparkles,
  Mail,
  Send,
  User,
  Layers,
  Award,
} from "lucide-react";
import {
  getStoredVerificationProfiles,
  saveStoredVerificationProfiles,
  subscribeToVerification,
  VerificationItem,
} from "@/lib/verification-store";
import { maskNic } from "@/lib/supabase";

export default function VerifiersPage() {
  const [profiles, setProfiles] = useState<VerificationItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "verifier_approved" | "admin_approved" | "rejected">("all");
  const [auditMode, setAuditMode] = useState<"verifier" | "admin">("verifier");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [notificationTrayOpen, setNotificationTrayOpen] = useState(false);

  // 4-point verification checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    identity: true,
    prototype: true,
    faculty: true,
    escrowAgreement: true,
  });

  useEffect(() => {
    const initialList = getStoredVerificationProfiles();
    setProfiles(initialList);
    if (initialList.length > 0 && !selectedUserId) {
      setSelectedUserId(initialList[0].user_id);
    }

    const unsubscribe = subscribeToVerification((updatedList) => {
      setProfiles(updatedList);
    });

    return () => unsubscribe();
  }, [selectedUserId]);

  const selectedItem: VerificationItem | undefined =
    profiles.find((p) => p.user_id === selectedUserId) || profiles[0];

  const filteredProfiles = profiles.filter((item) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "admin_approved") {
      return item.verification_status === "admin_approved" || item.verification_status === "approved";
    }
    return item.verification_status === filterStatus;
  });

  const toggleChecklist = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Stage 1: Verifier Faculty Sign-Off
  const handleVerifierSignOff = async () => {
    if (!selectedItem) return;

    const allChecked = Object.values(checklist).every(Boolean);
    if (!allChecked) {
      showToast("⚠️ Complete all 4 checklist points before issuing institutional endorsement.");
      return;
    }

    setIsProcessing(true);

    try {
      const notes = reviewerNotes || "Faculty verified: Technical prototype & student enrollment verified.";
      const res = await fetch("/api/seller/verify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedItem.user_id,
          verification_status: "verifier_approved",
          reviewer_notes: notes,
          review_stage: "verifier",
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to update verifier sign-off.");
      }

      const current = getStoredVerificationProfiles();
      const updated = current.map((p) =>
        p.user_id === selectedItem.user_id
          ? {
              ...p,
              verification_status: "verifier_approved" as const,
              verifier_approved_at: new Date().toISOString(),
              reviewed_at: new Date().toISOString(),
              notes,
            }
          : p
      );
      saveStoredVerificationProfiles(updated);
      setProfiles(updated);

      showToast(`🏛️ Faculty Sign-Off issued for "${selectedItem.shop_name}"! Queued for Admin final sign-off.`);
      setReviewerNotes("");
    } catch (err: any) {
      showToast(`❌ Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Stage 2: Admin Final Sign-Off & Storefront Unlock
  const handleAdminApproval = async () => {
    if (!selectedItem) return;

    setIsProcessing(true);

    try {
      const notes = reviewerNotes || "Platform Admin approved: Payment protection clearing & chamber compliance confirmed. Storefront unlocked.";
      const res = await fetch("/api/seller/verify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedItem.user_id,
          verification_status: "admin_approved",
          reviewer_notes: notes,
          review_stage: "admin",
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to grant Admin final approval.");
      }

      const current = getStoredVerificationProfiles();
      const updated = current.map((p) =>
        p.user_id === selectedItem.user_id
          ? {
              ...p,
              verification_status: "admin_approved" as const,
              admin_approved_at: new Date().toISOString(),
              reviewed_at: new Date().toISOString(),
              notes,
            }
          : p
      );
      saveStoredVerificationProfiles(updated);
      setProfiles(updated);

      showToast(`👑 Final Admin Approval granted! Storefront & product listing unlocked for "${selectedItem.shop_name}".`);
      setReviewerNotes("");
    } catch (err: any) {
      showToast(`❌ Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedItem) return;

    setIsProcessing(true);

    try {
      const notes = reviewerNotes || "Verification rejected: Invalid credentials or unreadable documentation.";
      const res = await fetch("/api/seller/verify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedItem.user_id,
          verification_status: "rejected",
          reviewer_notes: notes,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to update verification status.");
      }

      const current = getStoredVerificationProfiles();
      const updated = current.map((p) =>
        p.user_id === selectedItem.user_id
          ? {
              ...p,
              verification_status: "rejected" as const,
              reviewed_at: new Date().toISOString(),
              notes,
            }
          : p
      );
      saveStoredVerificationProfiles(updated);
      setProfiles(updated);

      showToast(`❌ Application rejected for "${selectedItem.shop_name}". Applicant notified to resubmit.`);
      setReviewerNotes("");
    } catch (err: any) {
      showToast(`❌ Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const isFullyApproved =
    selectedItem?.verification_status === "admin_approved" ||
    selectedItem?.verification_status === "approved";

  const isVerifierApproved =
    selectedItem?.verification_status === "verifier_approved";

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-fade-in-up border border-gray-700">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                Auditor &amp; Governance Center
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <Lock size={12} /> Strict Zero-Leak RLS Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Two-Stage Institutional Verification Portal
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Accredited university verifiers endorse prototypes, followed by platform admin final approval before storefronts open.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuditMode("verifier")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  auditMode === "verifier"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                🏛️ Faculty Verifier Mode
              </button>
              <button
                type="button"
                onClick={() => setAuditMode("admin")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  auditMode === "admin"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                👑 Platform Admin Mode
              </button>
            </div>

            <button
              type="button"
              onClick={() => setNotificationTrayOpen(!notificationTrayOpen)}
              className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <Mail size={14} className="text-indigo-600" />
              <span>Verifier Alerts ({profiles.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dispatched Verifier Notification Drawer */}
      {notificationTrayOpen && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-white rounded-2xl border border-indigo-100 p-4 shadow-sm space-y-3 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-2">
                <Send size={14} className="text-indigo-600" />
                Automated Institutional Verifier Notifications Dispatched
              </span>
              <button
                onClick={() => setNotificationTrayOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {profiles.slice(0, 3).map((p) => (
                <div key={p.id} className="p-3 bg-gray-50 rounded-xl text-xs space-y-1 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <strong className="text-gray-900 truncate max-w-[150px]">{p.shop_name}</strong>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                      DELIVERED
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">
                    To: {p.verifier_email || "auditor.innovations@uom.lk"}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Dispatched: {new Date(p.submitted_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Split-Screen Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column (5 cols): Split-Screen Queue List ── */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Clock size={16} className="text-indigo-600" />
                Review Queue ({filteredProfiles.length})
              </h3>
              <div className="flex flex-wrap items-center gap-1">
                {(["all", "pending", "verifier_approved", "admin_approved"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold capitalize transition-colors cursor-pointer ${
                      filterStatus === st
                        ? "bg-indigo-600 text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {st === "admin_approved" ? "Admin Approved" : st === "verifier_approved" ? "Verifier Approved" : st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredProfiles.map((item) => {
                const isSelected = item.user_id === selectedItem?.user_id;
                const isItemApproved = item.verification_status === "admin_approved" || item.verification_status === "approved";
                const isItemVerifierApproved = item.verification_status === "verifier_approved";

                return (
                  <div
                    key={item.user_id}
                    onClick={() => setSelectedUserId(item.user_id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? "bg-indigo-50/60 border-indigo-300 shadow-sm ring-1 ring-indigo-200"
                        : "bg-white border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-xs font-black text-gray-900 block truncate">
                          {item.shop_name}
                        </span>
                        <span className="text-[11px] text-indigo-700 font-semibold block">
                          {item.applicant_name}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                          isItemApproved
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : isItemVerifierApproved
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : item.verification_status === "rejected"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {isItemApproved ? "Admin Approved" : isItemVerifierApproved ? "Verifier Approved" : item.verification_status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="truncate max-w-[180px]">{item.institution_or_business}</span>
                      <span className="font-mono text-gray-400 font-bold">{maskNic(item.nic_number)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-100/80">
                      <span>{item.district} District</span>
                      <span className="flex items-center gap-1">
                        <Mail size={10} /> {item.verifier_email?.split("@")[1] || "mrt.ac.lk"}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredProfiles.length === 0 && (
                <div className="p-8 text-center text-xs text-gray-400 space-y-1">
                  <p>No seller profiles matching filter.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column (7 cols): Split-Screen Active Review ── */}
          {selectedItem ? (
            <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
              {/* File Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                    <Store size={14} /> Application #{selectedItem.id || selectedItem.user_id}
                  </span>
                  <h2 className="text-xl font-black text-gray-900 mt-1">
                    {selectedItem.shop_name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Creator: <strong className="text-gray-700">{selectedItem.applicant_name}</strong> · Category: {selectedItem.shop_category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${
                      isFullyApproved
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : isVerifierApproved
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : selectedItem.verification_status === "rejected"
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    Stage: {isFullyApproved ? "Storefront Unlocked (Admin Approved)" : isVerifierApproved ? "Verifier Signed Off" : "Pending Verifier"}
                  </span>
                </div>
              </div>

              {/* Two-Stage Progress Bar Banner */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Two-Stage Verification Pipeline Status</span>
                  <span className="text-indigo-600 font-mono text-[11px]">
                    {isFullyApproved ? "Stage 2 of 2 Complete" : isVerifierApproved ? "Stage 1 of 2 Complete" : "Stage 0 of 2"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div
                    className={`p-3 rounded-xl border flex items-center gap-2 ${
                      isVerifierApproved || isFullyApproved
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : "bg-white border-gray-200 text-gray-500"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isVerifierApproved || isFullyApproved ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isVerifierApproved || isFullyApproved ? "✓" : "1"}
                    </div>
                    <div>
                      <strong className="block text-[11px]">1. Verifier Sign-Off</strong>
                      <span className="text-[10px] opacity-80">
                        {isVerifierApproved || isFullyApproved ? "Faculty Certified" : "Pending Audit"}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-xl border flex items-center gap-2 ${
                      isFullyApproved
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : "bg-white border-gray-200 text-gray-500"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isFullyApproved ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isFullyApproved ? "✓" : "2"}
                    </div>
                    <div>
                      <strong className="block text-[11px]">2. Admin Final Approval</strong>
                      <span className="text-[10px] opacity-80">
                        {isFullyApproved ? "Storefront Unlocked" : "Awaiting Verifier"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Redaction Box */}
              <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-[#0F1120] text-white p-5 space-y-3 border border-gray-800">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                  <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    Zero-Leak Academic Redaction Layer
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    RLS CERTIFIED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700">
                    <span className="text-gray-400 block text-[10px] uppercase">Protected Applicant NIC</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {maskNic(selectedItem.nic_number)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700">
                    <span className="text-gray-400 block text-[10px] uppercase">Affiliated Institution</span>
                    <span className="text-indigo-300 font-bold text-xs truncate block">
                      {selectedItem.institution_or_business}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700">
                    <span className="text-gray-400 block text-[10px] uppercase">District &amp; Location</span>
                    <span className="text-gray-200 font-bold text-xs">
                      {selectedItem.district} District
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700">
                    <span className="text-gray-400 block text-[10px] uppercase">Alert Dispatched To</span>
                    <span className="text-indigo-300 font-bold text-xs truncate block">
                      {selectedItem.verifier_email || "auditor.innovations@uom.lk"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Document Preview Split-Screen Section ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <FileCheck size={16} className="text-indigo-600" />
                    KYC Verification Proof Document ({selectedItem.document_type?.replace("_", " ").toUpperCase() || "CREDENTIAL"})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setDocumentModalOpen(true)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye size={13} /> Expand Preview
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-gray-200 border border-gray-300 shrink-0 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedItem.document_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"}
                      alt="Verification document proof"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div
                      onClick={() => setDocumentModalOpen(true)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold cursor-pointer"
                    >
                      <Eye size={16} className="mr-1" /> View Full
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 font-bold text-gray-900">
                      <span>Proof Document Verified:</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {selectedItem.document_type === "br_certificate" ? "BR Form 1 Certificate" : "University Student ID Card"}
                      </span>
                    </div>
                    <p className="text-gray-500 leading-relaxed">
                      {selectedItem.notes || "Official enrollment document stamped with department header."}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Submitted on: {new Date(selectedItem.submitted_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Product & Prototype Gallery Review (From Onboarding) ── */}
              {selectedItem.product_draft && (
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                      <Store size={14} className="text-indigo-600" />
                      Submitted Marketplace Innovation: &quot;{selectedItem.product_draft.title}&quot;
                    </span>
                    <span className="font-mono text-xs font-black text-emerald-700 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                      Rs. {Number(selectedItem.product_draft.price || 0).toLocaleString()} (7-Day Payment Protection)
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2">
                    {selectedItem.product_draft.story}
                  </p>

                  {/* Prototype Image Gallery */}
                  {Array.isArray(selectedItem.product_draft.images) && selectedItem.product_draft.images.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                        Prototype Inspection Gallery ({selectedItem.product_draft.images.length} images)
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedItem.product_draft.images.slice(0, 3).map((img: any, idx: number) => (
                          <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-200 h-20 bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt={img.name || "Prototype photo"} className="w-full h-full object-cover" />
                            {img.isPrimary && (
                              <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                Cover
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4-Point Institutional Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900">
                    4-Point Institutional Verification Checklist
                  </h4>
                  <span className="text-xs text-gray-500 font-semibold">
                    {Object.values(checklist).filter(Boolean).length}/4 Checked
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      id: "identity",
                      label: "Institutional Student / SME Registration Proof",
                      desc: `Verified against official Sri Lankan registry of ${selectedItem.institution_or_business}.`,
                    },
                    {
                      id: "prototype",
                      label: "Prototype / Innovation Technical Credibility",
                      desc: `Verified innovation alignment with ${selectedItem.shop_category} domain.`,
                    },
                    {
                      id: "faculty",
                      label: "Faculty Department / Chamber Recommendation Endorsement",
                      desc: "Academic supervisor or divisional chamber recommendation undertaking confirmed.",
                    },
                    {
                      id: "escrowAgreement",
                      label: "7-Day Payment Protection & Dispute Undertaking",
                      desc: "Applicant compliance with Innoversity standardized commercial buyer safety terms.",
                    },
                  ].map((item) => {
                    const isChecked = checklist[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleChecklist(item.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? "bg-emerald-50/50 border-emerald-200"
                            : "bg-gray-50 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <button type="button" className="mt-0.5 text-emerald-600 shrink-0">
                          {isChecked ? (
                            <CheckSquare size={18} className="text-emerald-600" />
                          ) : (
                            <Square size={18} className="text-gray-400" />
                          )}
                        </button>
                        <div className="text-xs">
                          <strong className={`block ${isChecked ? "text-emerald-950 font-bold" : "text-gray-800"}`}>
                            {item.label}
                          </strong>
                          <p className="text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Auditor Notes Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Auditor Decision Notes (Recorded in Audit Trail)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Approved: ITUM Faculty records matched. Endorsement badge issued."
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                />
              </div>

              {/* Two-Stage Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
                {/* Stage 1: Verifier Sign-off */}
                {!isVerifierApproved && !isFullyApproved && (
                  <button
                    id="verifier-signoff-btn"
                    onClick={handleVerifierSignOff}
                    disabled={isProcessing}
                    className="w-full sm:flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle size={15} />
                    <span>1. Issue Verifier Faculty Sign-Off</span>
                  </button>
                )}

                {/* Stage 2: Admin Final Approval */}
                <button
                  id="admin-approval-btn"
                  onClick={handleAdminApproval}
                  disabled={isProcessing || isFullyApproved}
                  className={`w-full sm:flex-1 py-3.5 rounded-xl text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                    isFullyApproved
                      ? "bg-emerald-600 opacity-80 cursor-default"
                      : "bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200"
                  }`}
                >
                  <Award size={15} />
                  <span>
                    {isFullyApproved
                      ? "✓ Admin Approved (Storefront Active)"
                      : "2. Grant Admin Approval & Unlock Storefront"}
                  </span>
                </button>

                {/* Reject Button */}
                <button
                  id="verifier-reject-btn"
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <XCircle size={15} />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-400">
              <p>No seller profile selected from queue.</p>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Document Modal */}
      {documentModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  Document Preview: {selectedItem.shop_name}
                </h3>
                <span className="text-xs text-gray-500">
                  {selectedItem.document_type?.replace("_", " ").toUpperCase()} · {selectedItem.institution_or_business}
                </span>
              </div>
              <button
                onClick={() => setDocumentModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto rounded-2xl bg-gray-100 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedItem.document_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"}
                alt="Document preview full"
                className="max-h-[55vh] object-contain rounded-xl shadow-md"
              />
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
              <span>Masked NIC: <strong className="text-indigo-700 font-mono">{maskNic(selectedItem.nic_number)}</strong></span>
              <button
                onClick={() => setDocumentModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
