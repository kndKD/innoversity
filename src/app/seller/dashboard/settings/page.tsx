"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Store,
  Building2,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Save,
  ExternalLink,
  UploadCloud,
  FileCheck,
  Lock,
  ArrowRight,
  User,
} from "lucide-react";
import {
  getStoredVerificationProfiles,
  upsertVerificationProfile,
  subscribeToVerification,
  VerificationItem,
} from "@/lib/verification-store";
import { maskNic } from "@/lib/supabase";
import { SRI_LANKAN_INSTITUTIONS } from "@/lib/mock-data";

export default function SellerSettingsPage() {
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; full_name: string } | null>(null);
  const [sellerProfile, setSellerProfile] = useState<VerificationItem | null>(null);

  // Form states
  const [shopName, setShopName] = useState("Moratuwa IoT Dynamics");
  const [shopCategory, setShopCategory] = useState("IoT & Hardware");
  const [shopBio, setShopBio] = useState("Precision agricultural IoT sensor nodes and poultry incubators tested at ITUM Moratuwa.");
  const [institution, setInstitution] = useState("University of Moratuwa (ITUM)");
  const [district, setDistrict] = useState("Moratuwa");
  const [payoutBank, setPayoutBank] = useState("Commercial Bank of Ceylon");
  const [payoutAccount, setPayoutAccount] = useState("8920192841");

  // Status
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("innoversity_user");
      let uId = "usr-kasun-05";
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setCurrentUser(parsed);
          uId = parsed.id;
        } catch {
          // ignore
        }
      }

      // Load profile
      const profiles = getStoredVerificationProfiles();
      const current = profiles.find((p) => p.user_id === uId) || profiles[0];
      if (current) {
        setSellerProfile(current);
        setShopName(current.shop_name);
        setShopCategory(current.shop_category);
        setShopBio(current.shop_bio || "");
        setInstitution(current.institution_or_business);
        setDistrict(current.district);
      }
    }

    const unsubscribe = subscribeToVerification((profiles) => {
      const uId = currentUser?.id || "usr-kasun-05";
      const match = profiles.find((p) => p.user_id === uId) || profiles[0];
      if (match) {
        setSellerProfile(match);
      }
    });

    return () => unsubscribe();
  }, [currentUser?.id]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const uId = currentUser?.id || sellerProfile?.user_id || "usr-kasun-05";
    const updated = upsertVerificationProfile({
      user_id: uId,
      shop_name: shopName,
      shop_category: shopCategory,
      shop_bio: shopBio,
      institution_or_business: institution,
      district,
    });

    setSellerProfile(updated);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const status = sellerProfile?.verification_status || "approved";

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link href="/seller/dashboard" className="hover:text-indigo-600 transition-colors">
                Seller Studio
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-semibold">Settings &amp; KYC</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Shop &amp; Verification Settings
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage your innovation storefront credentials, institutional audit badge, and protected payouts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/seller/dashboard"
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/onboarding"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5"
            >
              <UploadCloud size={14} /> Update KYC Proof
            </Link>
          </div>
        </div>

        {/* ── Status Card ── */}
        <div
          className={`rounded-3xl border p-6 sm:p-8 shadow-sm transition-all ${
            status === "approved"
              ? "bg-gradient-to-br from-emerald-500/10 via-white to-emerald-50/40 border-emerald-200"
              : status === "pending"
              ? "bg-gradient-to-br from-amber-500/10 via-white to-amber-50/40 border-amber-200"
              : "bg-gradient-to-br from-red-500/10 via-white to-red-50/40 border-red-200"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  status === "approved"
                    ? "bg-emerald-600 text-white"
                    : status === "pending"
                    ? "bg-amber-500 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {status === "approved" ? (
                  <ShieldCheck size={28} />
                ) : status === "pending" ? (
                  <Clock size={28} />
                ) : (
                  <AlertCircle size={28} />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {status === "approved"
                      ? "✓ Verified Creator Active"
                      : status === "pending"
                      ? "⏳ Verification Under Review"
                      : "❌ Verification Requires Action"}
                  </span>
                  <span className="text-xs text-gray-500">Tier-1 Institutional Audit</span>
                </div>
                <h3 className="text-xl font-black text-gray-900">
                  {status === "approved"
                    ? `Endorsed by ${sellerProfile?.institution_or_business || institution}`
                    : `Application Queued at ${sellerProfile?.institution_or_business || institution}`}
                </h3>
                <p className="text-xs text-gray-600 max-w-xl leading-relaxed">
                  {status === "approved"
                    ? "Your listings and shop profile dynamically display the certified green Verified Creator badge. Buyers can purchase with 100% confidence."
                    : status === "pending"
                    ? "Faculty verifiers from your institution are currently inspecting your student/SME documents in the Split-Screen Auditor Queue. Review typically completes within 12–24 hours."
                    : `Verification was rejected. Notes: ${sellerProfile?.notes || "Document unreadable or invalid institution credentials"}. Please re-upload proof.`}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <Link
                href="/verifiers"
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-800 text-center transition-all flex items-center justify-center gap-1.5"
              >
                <span>Auditor Portal</span>
                <ExternalLink size={13} />
              </Link>
              <Link
                href="/innovations"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white text-center transition-all shadow-sm"
              >
                View Marketplace Presence
              </Link>
            </div>
          </div>
        </div>

        {/* ── Settings Form ── */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Store size={20} className="text-indigo-600" />
                Storefront &amp; Business Profile
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Customize how your innovation studio appears to commercial procurement buyers.
              </p>
            </div>

            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle size={13} /> Changes Saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Shop / Lab Name
              </label>
              <div className="relative">
                <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Primary Category
              </label>
              <input
                type="text"
                value={shopCategory}
                onChange={(e) => setShopCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Studio Bio &amp; Pitch
            </label>
            <textarea
              rows={3}
              value={shopBio}
              onChange={(e) => setShopBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Endorsing Institution
              </label>
              <select
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
              >
                {SRI_LANKAN_INSTITUTIONS.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                District Location
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
              />
            </div>
          </div>

          {/* ── Payout Bank Details ── */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-600" />
                Payout Settlement Account (Sri Lanka)
              </h3>
              <p className="text-xs text-gray-500">
                LKR milestone payouts are auto-transferred here once buyers clear the 7-day inspection window.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Designated Bank
                </label>
                <select
                  value={payoutBank}
                  onChange={(e) => setPayoutBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium bg-white text-gray-900"
                >
                  <option>Commercial Bank of Ceylon</option>
                  <option>Bank of Ceylon (BOC)</option>
                  <option>Hatton National Bank (HNB)</option>
                  <option>People&apos;s Bank</option>
                  <option>Sampath Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Account Number</span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Lock size={10} /> Encrypted
                  </span>
                </label>
                <input
                  type="text"
                  value={payoutAccount}
                  onChange={(e) => setPayoutAccount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold bg-white text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save size={15} />
              <span>{isSaving ? "Saving..." : "Save Storefront Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
