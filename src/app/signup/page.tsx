"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  GraduationCap,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Building,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Logo } from "@/components/logo";

export default function SignUpPage() {
  const router = useRouter();

  const [role, setRole] = useState<"buyer" | "seller">("seller");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 1. Direct API registration
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create account.");
      }

      // 2. Also register client-side session if Supabase is active
      if (isSupabaseConfigured()) {
        try {
          await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
            options: {
              data: {
                full_name: fullName.trim(),
                role,
              },
            },
          });
        } catch (supaErr) {
          console.warn("Client Supabase signUp handled:", supaErr);
        }
      }

      // Save user session in localStorage for local state continuity
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "innoversity_user",
          JSON.stringify({
            id: result.user?.id || "usr-" + Date.now(),
            email: email.trim().toLowerCase(),
            full_name: fullName.trim(),
            role,
          })
        );
      }

      setSuccessMessage(
        role === "seller"
          ? "Account created! Proceeding to Institutional KYC Verification..."
          : "Account created! Redirecting to Buyer Dashboard..."
      );

      // Route according to role
      setTimeout(() => {
        if (role === "seller") {
          router.push("/onboarding");
        } else {
          router.push("/buyer/dashboard");
        }
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-24 pb-20 flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link href="/" className="inline-flex items-center justify-center group">
              <Logo className="w-8 h-8 text-indigo-600" textColor="text-slate-900" showText={true} />
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Join Sri Lanka&apos;s verified innovation marketplace with institutional trust
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-7 sm:p-9 shadow-xl space-y-6">
          {/* Role Selection Cards */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
              Select Your Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Seller / Creator */}
              <button
                type="button"
                onClick={() => setRole("seller")}
                className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                  role === "seller"
                    ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      role === "seller" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <GraduationCap size={18} />
                  </div>
                  {role === "seller" && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      Selected
                    </span>
                  )}
                </div>
                <div className="font-bold text-sm text-gray-900">Student / SME Seller</div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  List campus inventions, IT solutions, and earn through secured escrow.
                </p>
              </button>

              {/* Commercial Buyer */}
              <button
                type="button"
                onClick={() => setRole("buyer")}
                className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                  role === "buyer"
                    ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      role === "buyer" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <User size={18} />
                  </div>
                  {role === "buyer" && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      Selected
                    </span>
                  )}
                </div>
                <div className="font-bold text-sm text-gray-900">Commercial Buyer</div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Procure verified inventions with 7-day milestone inspection escrow.
                </p>
              </button>
            </div>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2">
              <span className="font-bold">Error:</span> {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder={role === "seller" ? "e.g. Kasun Perera" : "e.g. Ruwan Jayasinghe"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address
                {role === "seller" && (
                  <span className="text-[11px] font-normal text-indigo-600 ml-1.5">
                    (.ac.lk university email recommended)
                  </span>
                )}
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder={
                    role === "seller"
                      ? "kasun@itum.mrt.ac.lk or your@email.com"
                      : "procurement@company.lk"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min. 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Role Notice */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 flex items-start gap-2">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {role === "seller"
                  ? "Sellers are required to complete a fast 2-minute KYC verification (Student ID or BR Certificate) to unlock listings."
                  : "Buyers can immediately deposit into 7-day escrow, track courier dispatches, and request institutional inspections."}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <Link href="/signin" className="font-semibold text-indigo-600 hover:text-indigo-800">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Footnote */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" /> Masked NIC Protection
          </span>
          <span className="flex items-center gap-1.5">
            <Lock size={14} className="text-indigo-600" /> Bank-Grade Escrow
          </span>
          <span className="flex items-center gap-1.5">
            <Building size={14} className="text-purple-600" /> Verified Faculties
          </span>
        </div>
      </div>
    </div>
  );
}
