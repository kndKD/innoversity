"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Building,
  GraduationCap,
  FileText,
  DollarSign,
  Package,
  Image as ImageIcon,
  X,
  AlertCircle,
  Clock,
  Eye,
  Store,
  CheckSquare,
  User,
  ShoppingBag,
} from "lucide-react";
import {
  getStoredVerificationProfiles,
  subscribeToVerification,
  canSellerListProducts,
  getVerificationPipelineInfo,
  VerificationItem,
} from "@/lib/verification-store";
import { maskNic } from "@/lib/supabase";

interface UploadedImage {
  id: string;
  name: string;
  size: string;
  url: string;
  isPrimary: boolean;
}

const SAMPLE_PROTOTYPE_PHOTOS: UploadedImage[] = [
  {
    id: "img-proto-1",
    name: "iot_board_circuit_rev2.jpg",
    size: "2.4 MB",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    isPrimary: true,
  },
  {
    id: "img-proto-2",
    name: "sensor_probe_field_test.jpg",
    size: "3.1 MB",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    isPrimary: false,
  },
  {
    id: "img-proto-3",
    name: "enclosure_packaging_prototype.jpg",
    size: "1.8 MB",
    url: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=800&q=80",
    isPrimary: false,
  },
];

export default function ListInnovationPage() {
  const router = useRouter();

  // User and RBAC state
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; full_name: string; role: string } | null>(null);
  const [sellerProfile, setSellerProfile] = useState<VerificationItem | null>(null);
  const [isGated, setIsGated] = useState<boolean>(false);
  const [gateReason, setGateReason] = useState<string>("");
  const [gateStage, setGateStage] = useState<string>("pending");
  const [isBuyer, setIsBuyer] = useState<boolean>(false);

  // Form State
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  // Gallery State (Step 2 requirement)
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);

  const [formData, setFormData] = useState({
    sellerType: "student",
    institution: "University of Moratuwa",
    nic: "992451821V",
    studentIdFile: "itum_student_card_verified.pdf",
    brNumber: "PV-89214-LK",
    title: "",
    category: "AgriTech",
    district: "Moratuwa",
    story: "",
    technicalSpecs: "",
    price: "14800",
    escrowDays: "7",
    courier: "Domex",
  });

  // Verify RBAC and Verification Gating
  useEffect(() => {
    let userRole = "seller";
    let userId = "usr-kasun-05";

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("innoversity_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCurrentUser(parsed);
          userRole = parsed.role || "seller";
          userId = parsed.id;
        } catch {
          // ignore
        }
      }
    }

    if (userRole === "buyer") {
      setIsBuyer(true);
      return;
    }

    const profiles = getStoredVerificationProfiles();
    const current = profiles.find((p) => p.user_id === userId) || profiles[0];
    setSellerProfile(current || null);

    const check = canSellerListProducts({
      userId,
      role: userRole,
      sellerName: current?.applicant_name,
      shopName: current?.shop_name,
    });

    if (!check.allowed) {
      setIsGated(true);
      setGateReason(check.reason || "Verification required.");
      setGateStage(check.stage || "pending");
    } else {
      setIsGated(false);
    }

    const unsubscribe = subscribeToVerification((updatedList) => {
      const match = updatedList.find((p) => p.user_id === userId) || updatedList[0];
      if (match) {
        setSellerProfile(match);
        const recheck = canSellerListProducts({
          userId,
          role: userRole,
          sellerName: match.applicant_name,
          shopName: match.shop_name,
        });
        if (!recheck.allowed) {
          setIsGated(true);
          setGateReason(recheck.reason || "Verification required.");
          setGateStage(recheck.stage || "pending");
        } else {
          setIsGated(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStepError(null);
  };

  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImgs: UploadedImage[] = [];

    Array.from(files).forEach((file, index) => {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      const reader = new FileReader();
      reader.onloadend = () => {
        const item: UploadedImage = {
          id: `img-${Date.now()}-${index}`,
          name: file.name,
          size: sizeMb,
          url: reader.result as string,
          isPrimary: galleryImages.length === 0 && newImgs.length === 0,
        };
        setGalleryImages((prev) => [...prev, item]);
      };
      reader.readAsDataURL(file);
    });

    setStepError(null);
  };

  const handleAddSampleGallery = () => {
    setGalleryImages(SAMPLE_PROTOTYPE_PHOTOS);
    setStepError(null);
  };

  const handleRemoveImage = (id: string) => {
    setGalleryImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleSetPrimary = (id: string) => {
    setGalleryImages((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      }))
    );
  };

  const handleStep2Next = () => {
    if (!formData.title.trim()) {
      setStepError("Please provide an innovation title.");
      return;
    }
    if (galleryImages.length === 0) {
      setStepError("Product Images / Prototype Gallery is required! Please upload at least 1 clear photo of your innovation so commercial buyers can inspect it.");
      return;
    }
    setStepError(null);
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  // ── 1. GATED VIEW FOR BUYERS ──
  if (isBuyer) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] pt-24 pb-24 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
            <Lock size={32} />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
              Role Restricted · Buyer Account
            </span>
            <h1 className="text-2xl font-black text-gray-900">
              Listing Access Restricted
            </h1>
            <p className="text-xs text-gray-600 leading-relaxed">
              You are signed in with a <strong>Commercial Buyer</strong> account. Listing innovations and opening storefronts is strictly reserved for verified Sri Lankan university student creators and registered SMEs.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-left space-y-2 text-gray-600">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <ShoppingBag size={15} className="text-indigo-600" />
              <span>Buyer Permissions Active:</span>
            </div>
            <p>✓ Browse verified inventions &amp; order through 7-day escrow.</p>
            <p>✓ Track domestic courier consignments via Domex.</p>
            <p>✓ Inspect products &amp; authorize milestone releases.</p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/buyer/dashboard"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all text-center"
            >
              Go to Buyer Escrow Dashboard
            </Link>
            <Link
              href="/signup"
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs transition-all text-center"
            >
              Register as Student / SME Seller
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. GATED VIEW FOR UNAPPROVED SELLERS (Status Tracking Waiting Screen) ──
  if (isGated) {
    const pipelineInfo = getVerificationPipelineInfo(sellerProfile?.verification_status || (gateStage as any));

    return (
      <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-amber-200/80 p-8 sm:p-10 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Lock size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Verification Gated
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">
                    Product Listing Locked
                  </h1>
                </div>
              </div>
              <span className="text-xs text-gray-400 font-mono">
                #{sellerProfile?.id || "KYC-REVIEW"}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              To guarantee zero fraud for commercial buyers and protect patented Sri Lankan university prototypes, sellers can only list active products on the marketplace <strong>after both Verifier sign-off and Admin final approval</strong>.
            </p>

            {/* ── Real-Time 3-Step Verification Pipeline Stepper ── */}
            <div className="bg-[#F8F7FF] rounded-2xl p-5 border border-indigo-100/80 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span className="flex items-center gap-1.5">
                  <Clock size={15} className="text-indigo-600" />
                  Real-Time Verification Tracking Pipeline
                </span>
                <span className="text-indigo-700 font-mono text-[11px]">
                  Step {pipelineInfo.stepNumber} of 3
                </span>
              </div>

              <div className="space-y-3">
                {/* Step 1: Submission */}
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-bold text-gray-900">
                      <span>1. Application Submitted &amp; Masked</span>
                      <span className="text-[10px] text-emerald-700">Completed</span>
                    </div>
                    <p className="text-gray-500 text-[11px]">
                      Student ID / BR credentials encrypted under zero-leak protocols. Automated alert dispatched to verifier.
                    </p>
                  </div>
                </div>

                {/* Step 2: Verifier Sign-off */}
                <div className="flex items-start gap-3 text-xs">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      pipelineInfo.stepNumber >= 2
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-500 text-white animate-pulse"
                    }`}
                  >
                    {pipelineInfo.stepNumber > 2 ? "✓" : "2"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-bold text-gray-900">
                      <span>2. Faculty Verifier Audit ({sellerProfile?.institution_or_business || "University"})</span>
                      <span
                        className={`text-[10px] font-bold ${
                          pipelineInfo.stepNumber >= 2 ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        {pipelineInfo.stepNumber >= 2 ? "Verifier Signed Off" : "In Progress"}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[11px]">
                      Accredited university auditors inspect technical specs and student enrollment.
                    </p>
                  </div>
                </div>

                {/* Step 3: Admin Final Sign-off */}
                <div className="flex items-start gap-3 text-xs">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      pipelineInfo.stepNumber >= 3 ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    3
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-bold text-gray-900">
                      <span>3. Platform Admin Final Sign-Off &amp; Listing Unlock</span>
                      <span className="text-[10px] text-gray-400">
                        {pipelineInfo.stepNumber >= 3 ? "Approved" : "Pending Verifier"}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[11px]">
                      Chamber registry checks, escrow banking clearance, and verified creator badge issuance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current status alert */}
            <div className={`p-4 rounded-2xl border text-xs ${pipelineInfo.color}`}>
              <strong className="block font-bold">{pipelineInfo.badgeText}</strong>
              <p className="mt-0.5">{pipelineInfo.description}</p>
              {sellerProfile?.notes && (
                <p className="mt-1.5 font-mono text-[11px] opacity-90 border-t border-current/20 pt-1">
                  Notes: {sellerProfile.notes}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/seller/dashboard"
                className="w-full sm:flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center shadow-md shadow-indigo-200 transition-all"
              >
                Go to Seller Studio Dashboard
              </Link>
              <Link
                href="/verifiers"
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5"
              >
                <span>Inspect Auditor Portal</span>
                <Eye size={13} />
              </Link>
              <Link
                href="/onboarding"
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs text-center transition-all"
              >
                Update Documents
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 3. APPROVED SELLER PRODUCT CREATION VIEW ──
  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <ShieldCheck size={14} />
            <span>Verified Creator Authorized · {sellerProfile?.shop_name || "Innovation Studio"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            List Your Innovation
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Create verified product listings, showcase multiple prototype gallery photos, and activate 7-day buyer escrow.
          </p>

          {/* Stepper Progress */}
          <div className="flex items-center justify-center gap-3 pt-6 max-w-md mx-auto">
            {[
              { num: 1, label: "Verification Proof" },
              { num: 2, label: "Story & Photo Gallery" },
              { num: 3, label: "Pricing & Escrow" },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= s.num
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step > s.num ? "✓" : s.num}
                </div>
                <span className={`text-xs font-semibold ${step >= s.num ? "text-gray-900" : "text-gray-400"}`}>
                  {s.label}
                </span>
                {s.num < 3 && <div className="w-8 h-0.5 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submitted ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900">
                Innovation Successfully Listed!
              </h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                &ldquo;{formData.title || "Your Innovation"}&rdquo; is now active on the Innoversity Marketplace with your verified {formData.institution} badge.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/innovations"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200"
              >
                View in Marketplace
              </Link>
              <Link
                href="/seller/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs"
              >
                Go to Seller Studio
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xl">
            {stepError && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-shake">
                <AlertCircle size={18} className="shrink-0 text-red-500" />
                <span>{stepError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* STEP 1: Institutional Verification Record */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-in-up">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-black text-gray-900">
                      Step 1: Institutional Verification Details
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Confirm the institutional accreditation attached to this innovation listing.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-emerald-950">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck size={16} className="text-emerald-600" />
                        Accredited Endorsement
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] uppercase">
                        Admin Certified
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-900 pt-1">
                      <div>Institution: <strong>{sellerProfile?.institution_or_business || formData.institution}</strong></div>
                      <div>District: <strong>{sellerProfile?.district || formData.district} District</strong></div>
                      <div>Masked Identity: <strong className="font-mono">{maskNic(sellerProfile?.nic_number || formData.nic)}</strong></div>
                      <div>Shop Origin: <strong>{sellerProfile?.shop_name || "Campus Studio"}</strong></div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Listing Entity Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, sellerType: "student" })}
                        className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                          formData.sellerType === "student"
                            ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20"
                            : "border-gray-200"
                        }`}
                      >
                        <GraduationCap size={18} className="text-indigo-600" />
                        <div>
                          <strong className="block text-xs font-bold text-gray-900">Student Creator</strong>
                          <span className="text-[10px] text-gray-500">University Project</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, sellerType: "sme" })}
                        className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                          formData.sellerType === "sme"
                            ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20"
                            : "border-gray-200"
                        }`}
                      >
                        <Building size={18} className="text-indigo-600" />
                        <div>
                          <strong className="block text-xs font-bold text-gray-900">Registered SME</strong>
                          <span className="text-[10px] text-gray-500">Divisional Chamber</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer"
                    >
                      Next: Prototype Photos &amp; Story <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Innovation Story & Required Product Photo Gallery */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-black text-gray-900">
                      Step 2: Tell the Story &amp; Upload Prototype Photos
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Upload high-res photos of your working prototype so commercial buyers can clearly inspect design, soldering, and packaging.
                    </p>
                  </div>

                  {/* Product Title */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. IoT Paddy Moisture Sensor & Automatic Aerator"
                      className="w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-[#F8F7FF] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      required
                    />
                  </div>

                  {/* Category & District */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="AgriTech">AgriTech</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Food & Beverage">Food & Beverage</option>
                        <option value="Productivity">Productivity</option>
                        <option value="Health & Wellness">Health & Wellness</option>
                        <option value="IoT & Hardware">IoT & Hardware</option>
                        <option value="IT Solutions & Services">IT Solutions &amp; Services</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        District Origin
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Moratuwa">Moratuwa</option>
                        <option value="Colombo">Colombo</option>
                        <option value="Gampaha">Gampaha</option>
                        <option value="Kandy">Kandy</option>
                        <option value="Matara">Matara</option>
                        <option value="Galle">Galle</option>
                        <option value="Jaffna">Jaffna</option>
                      </select>
                    </div>
                  </div>

                  {/* ── REQUIRED PRODUCT IMAGES / PROTOTYPE GALLERY UPLOAD ── */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon size={16} className="text-indigo-600" />
                        <span>Product Images / Prototype Gallery *</span>
                        <span className="text-red-500 font-bold">(Required)</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddSampleGallery}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles size={13} /> Insert Sample Prototype Photos
                      </button>
                    </div>

                    {/* Dropzone */}
                    <div className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl p-6 text-center bg-gray-50/60 relative transition-all">
                      <input
                        type="file"
                        multiple
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleMultipleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 shadow-xs">
                          <Upload size={22} />
                        </div>
                        <p className="text-xs font-bold text-gray-800">
                          Click to select multiple photos or drag and drop
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Upload high-res PNG, JPG, or WEBP photos (Circuit, Enclosure, Field Testing, Dimensions).
                        </p>
                      </div>
                    </div>

                    {/* Image Gallery Grid */}
                    {galleryImages.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-bold text-gray-700">
                          Uploaded Photos ({galleryImages.length}):
                        </span>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {galleryImages.map((img) => (
                            <div
                              key={img.id}
                              className={`relative rounded-2xl border overflow-hidden bg-gray-100 group shadow-xs ${
                                img.isPrimary ? "ring-2 ring-indigo-600 border-indigo-400" : "border-gray-200"
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img.url}
                                alt={img.name}
                                className="w-full h-28 object-cover group-hover:scale-105 transition-transform"
                              />

                              {/* Badges and action bar */}
                              <div className="absolute top-2 left-2 flex items-center gap-1">
                                {img.isPrimary ? (
                                  <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow-xs">
                                    ★ Cover Photo
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimary(img.id)}
                                    className="px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                                  >
                                    Set Cover
                                  </button>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveImage(img.id)}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-sm"
                                title="Delete image"
                              >
                                <X size={12} />
                              </button>

                              <div className="p-2 bg-white text-[10px] text-gray-600 flex items-center justify-between border-t border-gray-100">
                                <span className="truncate max-w-[120px] font-medium">{img.name}</span>
                                <span className="text-gray-400">{img.size}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Story textarea */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      The Story Behind This Innovation
                    </label>
                    <textarea
                      name="story"
                      rows={3}
                      value={formData.story}
                      onChange={handleChange}
                      placeholder="What motivated you to develop this? What was the research process? Who tested the prototype?"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 flex items-center gap-1.5"
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleStep2Next}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer"
                    >
                      Next: Pricing &amp; Escrow <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Pricing & Escrow Setup */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-in-up">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-black text-gray-900">
                      Step 3: Pricing &amp; Escrow Setup
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Configure unit pricing in Sri Lankan Rupees (Rs.) and your 7-day buyer inspection escrow terms.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Price per Unit (Rs. / LKR) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">
                        Rs.
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-[#F8F7FF] text-base font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock size={14} /> Escrow Auto-Release Window
                    </label>
                    <select
                      name="escrowDays"
                      value={formData.escrowDays}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-bold text-amber-900"
                    >
                      <option value="7">7 Days (Standard for hardware prototypes &amp; devices)</option>
                      <option value="10">10 Days (Recommended for agricultural formulations)</option>
                      <option value="14">14 Days (Extended for high-complexity test systems)</option>
                    </select>
                    <p className="text-[11px] text-amber-700">
                      Funds are held in Commercial Bank escrow and transferred into your account 7 days post-delivery.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Primary Delivery Carrier
                    </label>
                    <select
                      name="courier"
                      value={formData.courier}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Domex">Domex Courier (Integrated Airway Bill Tracking)</option>
                      <option value="Pronto">Pronto Lanka Express</option>
                      <option value="CertCourier">Cert Lanka Express</option>
                    </select>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 flex items-center gap-1.5"
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-200 flex items-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Publishing to Marketplace...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} />
                          <span>Publish Verified Innovation</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
