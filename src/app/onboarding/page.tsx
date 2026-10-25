"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  UploadCloud,
  FileCheck,
  Building2,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  Lock,
  ArrowRight,
  Eye,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { maskNic } from "@/lib/supabase";
import { SRI_LANKAN_INSTITUTIONS } from "@/lib/mock-data";

const SRI_LANKAN_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

export default function SellerOnboardingPage() {
  const router = useRouter();

  // Form states
  const [applicantType, setApplicantType] = useState<"student" | "sme">("student");
  const [institution, setInstitution] = useState<string>("University of Moratuwa");
  const [district, setDistrict] = useState<string>("Colombo");
  const [facultyDepartment, setFacultyDepartment] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [registrationOrIndexNo, setRegistrationOrIndexNo] = useState("");
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; full_name: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("innoversity_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCurrentUser(parsed);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File exceeds 10MB limit. Please upload a smaller PDF or image.");
        return;
      }
      setDocumentName(file.name);
      // Generate a data URL or simulated cloud storage URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentUrl(reader.result as string || `https://storage.innoversity.lk/kyc/${file.name}`);
      };
      reader.readAsDataURL(file);
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!nicNumber.trim()) {
      setErrorMessage("Please enter your NIC number.");
      return;
    }

    if (!documentName && !documentUrl) {
      setErrorMessage("Please upload your verification document (Student ID or BR Certificate).");
      return;
    }

    setLoading(true);

    try {
      const institutionName =
        applicantType === "sme"
          ? `BR Verified SME (${institution === "BR Verified SMEs" ? "Registered Entity" : institution})`
          : institution;

      const payload = {
        user_id: currentUser?.id || `user-seller-${Date.now()}`,
        institution_or_business: institutionName,
        district,
        nic_number: nicNumber,
        document_url: documentUrl || `https://storage.innoversity.lk/kyc/doc-${Date.now()}.pdf`,
        notes: `Department/Index: ${registrationOrIndexNo || "N/A"} - ${facultyDepartment || "Undergraduate"}`,
      };

      const res = await fetch("/api/seller/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit KYC documentation.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during verification submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between text-xs text-gray-500">
          <Link href="/seller/dashboard" className="hover:text-indigo-600 transition-colors">
            ← Return to Seller Studio
          </Link>
          <span className="flex items-center gap-1 font-semibold text-emerald-600">
            <ShieldCheck size={14} /> Tier-1 Institutional KYC
          </span>
        </div>

        {/* Success View */}
        {isSubmitted ? (
          <div className="bg-white rounded-3xl border border-emerald-100 p-8 sm:p-12 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Application Received · Status: Pending Review
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                KYC Verification Submitted!
              </h1>
              <p className="text-sm text-gray-600 max-w-lg mx-auto">
                Your credentials have been securely queued for institutional audit by accredited faculty verifiers at{" "}
                <span className="font-bold text-gray-900">{institution}</span>.
              </p>
            </div>

            {/* Application Summary Box */}
            <div className="bg-gray-50 rounded-2xl p-5 text-left border border-gray-100 text-xs space-y-2.5 max-w-md mx-auto">
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Applicant:</span>
                <span className="font-semibold text-gray-900">{currentUser?.full_name || "Applicant"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Institution:</span>
                <span className="font-semibold text-gray-900">{institution}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">District:</span>
                <span className="font-semibold text-gray-900">{district}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Protected NIC:</span>
                <span className="font-mono font-bold text-indigo-700">{maskNic(nicNumber)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Review Window:</span>
                <span className="font-semibold text-emerald-700">12 – 24 Hours</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/seller/dashboard")}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Go to Seller Studio</span>
                <ArrowRight size={16} />
              </button>
              <Link
                href="/verifiers"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-all"
              >
                Inspect Auditor Queue
              </Link>
            </div>
          </div>
        ) : (
          /* Form Card */
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xl space-y-8">
            {/* Header Banner */}
            <div className="border-b border-gray-100 pb-6">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    Seller KYC Verification
                  </h1>
                  <p className="text-xs text-gray-500">
                    Sri Lanka University &amp; SME Institutional Verification Portal
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                To protect commercial buyers and issue your certified institutional badge, all creators must verify their university enrollment or registered SME business status.
              </p>
            </div>

            {/* Form Error */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Creator Type Radio Toggle */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  1. Creator Classification
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setApplicantType("student");
                      if (institution === "BR Verified SMEs") {
                        setInstitution("University of Moratuwa");
                      }
                    }}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      applicantType === "student"
                        ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap size={16} className="text-indigo-600" />
                      <strong className="text-sm font-bold text-gray-900">
                        Undergraduate / Student Inventor
                      </strong>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Verify with Student ID Card or Academic Enrollment Letter from a Sri Lankan University.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setApplicantType("sme");
                      setInstitution("BR Verified SMEs");
                    }}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      applicantType === "sme"
                        ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 size={16} className="text-indigo-600" />
                      <strong className="text-sm font-bold text-gray-900">
                        Registered SME / Startup
                      </strong>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Verify with Sri Lankan Business Registration (BR) certificate from Divisional Secretariat.
                    </p>
                  </button>
                </div>
              </div>

              {/* Institution and District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Building2 size={14} className="text-indigo-600" />
                    {applicantType === "student" ? "Sri Lankan Institution" : "Affiliated Chamber / Body"}
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
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin size={14} className="text-indigo-600" />
                    District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                  >
                    {SRI_LANKAN_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist} District
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* NIC & Student Index / BR No */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>National Identity Card (NIC)</span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Lock size={10} /> Zero-Leak Masking
                    </span>
                  </label>
                  <div className="relative">
                    <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 200112345678 or 991234567V"
                      value={nicNumber}
                      onChange={(e) => setNicNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                    />
                  </div>
                  {nicNumber && (
                    <div className="mt-1.5 text-[11px] text-gray-500 flex items-center gap-1.5">
                      <span>Stored on Innoversity as:</span>
                      <span className="font-mono font-bold text-indigo-700 px-1.5 py-0.5 rounded bg-indigo-50">
                        {maskNic(nicNumber)}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    {applicantType === "student" ? "Student Index / Reg No." : "BR Number (PV/W/etc.)"}
                  </label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={applicantType === "student" ? "e.g. 21/IT/0482 or EN2048" : "e.g. PV-00284712"}
                      value={registrationOrIndexNo}
                      onChange={(e) => setRegistrationOrIndexNo(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Department / Subfield */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Department / Academic Faculty or Business Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dept of Electronic & Telecommunication Engineering / Embedded Systems"
                  value={facultyDepartment}
                  onChange={(e) => setFacultyDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                />
              </div>

              {/* File Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>
                    Upload Verification Document ({applicantType === "student" ? "Student ID / Enrollment Letter" : "BR Certificate"})
                  </span>
                  <span className="text-[11px] text-gray-400 font-normal">Max 10MB (PDF, PNG, JPG)</span>
                </label>

                <div className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl p-6 text-center transition-colors bg-gray-50/50 relative">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 shadow-xs">
                      <UploadCloud size={24} />
                    </div>
                    {documentName ? (
                      <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200">
                        <FileCheck size={16} />
                        <span>{documentName} (Ready to submit)</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-gray-800">
                          Click to browse or drag and drop your document
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Valid documents: University Student ID (Front &amp; Back), Dean&apos;s Enrollment Letter, or Form 1 BR Certificate.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 4-Point Sri Lankan Verification Guarantee Notice */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck size={16} className="text-emerald-700" />
                  <span>The Innoversity 4-Point Verification Standard</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Institutional registry check</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Academic supervisor confirmation</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Masked NIC fraud elimination</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>LKR Escrow payout authorization</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Securing and submitting documents...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Submit for Institutional Audit</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
