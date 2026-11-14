"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Building,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Logo } from "@/components/logo";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if redirected after successful email OTP verification
    if (searchParams.get("verified") === "true") {
      setSuccessMessage("Account verified! Please sign in.");
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured()) {
        // Strictly authenticate with Supabase Auth credentials
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          if (
            error.message.toLowerCase().includes("email not confirmed") ||
            error.message.toLowerCase().includes("not confirmed")
          ) {
            throw new Error(
              "Your email address has not been confirmed yet. Please verify your OTP code."
            );
          }
          throw new Error(error.message || "Invalid email or password.");
        }

        if (!data.user) {
          throw new Error("Unable to authenticate. Please try again.");
        }
      } else {
        // Local mode fallback via database
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, password }),
        });
        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.error || "Invalid email or password.");
        }
      }

      setSuccessMessage("Authentication successful! Redirecting...");

      // Fetch user role from database
      let targetRole = "BUYER";
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData?.user?.role) {
            targetRole = meData.user.role.toUpperCase();
          }
        }
      } catch {
        targetRole = "BUYER";
      }

      const redirectParam = searchParams.get("redirect");
      let destination = redirectParam;

      if (!destination) {
        if (targetRole === "SELLER") {
          destination = "/seller/dashboard";
        } else if (targetRole === "VERIFIER" || targetRole === "ADMIN") {
          destination = "/verifiers";
        } else {
          destination = "/buyer/dashboard";
        }
      }

      setTimeout(() => {
        router.push(destination!);
        router.refresh();
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in. Please verify your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24 flex items-center justify-center px-4">
      <div className="max-w-xl w-full mx-auto py-8">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <Link href="/" className="inline-flex items-center justify-center group">
                <Logo className="w-8 h-8 text-indigo-600" textColor="text-slate-900" showText={true} />
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Sign In to Innoversity
            </h1>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Access your verified innovation studio, buyer escrow dashboard, or institutional review queue.
            </p>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900 bg-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Innoversity</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer note & Signup link */}
          <div className="pt-4 border-t border-gray-100 flex flex-col items-center gap-2 text-xs text-gray-500">
            <p>
              Don&apos;t have an account yet?{" "}
              <Link href="/signup" className="font-bold text-indigo-600 hover:text-indigo-800">
                Register as Buyer or Seller
              </Link>
            </p>
            <p className="text-[11px] text-gray-400">
              Protected by Innoversity Zero-Leak Academic Auth ·{" "}
              <Link href="/info/privacy-policy" className="text-gray-500 underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
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

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
