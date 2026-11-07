"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  GraduationCap,
  ShieldCheck,
  Building,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Logo } from "@/components/logo";

type RoleType = "buyer" | "student" | "verifier" | "admin";

const demoRoles: {
  id: RoleType;
  title: string;
  badge: string;
  description: string;
  destination: string;
  icon: any;
  color: string;
  bg: string;
}[] = [
  {
    id: "buyer",
    title: "Commercial Buyer",
    badge: "Buyer Demo",
    description: "Inspect escrow orders, track Domex dispatches, and release funds upon inspection.",
    destination: "/buyer/dashboard",
    icon: User,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
  },
  {
    id: "student",
    title: "Student / SME Seller",
    badge: "Seller Studio",
    description: "Manage escrow wallet, view Rs. 58,100 pending balances, and submit KYC credentials.",
    destination: "/seller/dashboard",
    icon: GraduationCap,
    color: "text-indigo-600",
    bg: "bg-indigo-50 border-indigo-200",
  },
  {
    id: "verifier",
    title: "Academic Verifier",
    badge: "Faculty Auditor",
    description: "Inspect masked seller credentials, review student prototypes, and approve badges.",
    destination: "/verifiers",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
  },
  {
    id: "admin",
    title: "Platform Admin",
    badge: "System Governance",
    description: "Full governance, escrow dispute arbitration, and chamber registry controls.",
    destination: "/verifiers",
    icon: Building,
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
  },
];

export default function SignInPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"custom" | "demo">("custom");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDemoLogin = (role: RoleType, destination: string) => {
    setLoading(true);
    // Set mock local session
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "innoversity_user",
        JSON.stringify({
          id: `demo-${role}-${Date.now()}`,
          email: `${role}@innoversity.lk`,
          full_name:
            role === "student"
              ? "Kasun Perera"
              : role === "buyer"
              ? "Lanka Retail Chains Ltd"
              : "Dr. Nalin Wickramasinghe",
          role: role === "student" ? "seller" : role,
        })
      );
    }
    setTimeout(() => {
      router.push(destination);
    }, 350);
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured()) {
        // Real Supabase Auth login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        const user = data.user;
        const role = (user?.user_metadata?.role as string) || "buyer";

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "innoversity_user",
            JSON.stringify({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || "Member",
              role,
            })
          );
        }

        setSuccessMessage("Authentication successful! Redirecting...");

        // Route based on role
        if (role === "seller" || role === "student") {
          // Check KYC status
          try {
            const kycRes = await fetch(`/api/seller/verify?userId=${user.id}`);
            const kycData = await kycRes.json();
            if (kycData.success && kycData.data) {
              router.push("/seller/dashboard");
            } else {
              router.push("/onboarding");
            }
          } catch {
            router.push("/seller/dashboard");
          }
        } else if (role === "verifier" || role === "admin") {
          router.push("/verifiers");
        } else {
          router.push("/buyer/dashboard");
        }
      } else {
        // Fallback demo/development login
        const role = email.toLowerCase().includes("mrt") || email.toLowerCase().includes("student")
          ? "seller"
          : email.toLowerCase().includes("verifier")
          ? "verifier"
          : "buyer";

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "innoversity_user",
            JSON.stringify({
              id: "usr-" + Math.random().toString(36).substring(2, 8),
              email,
              full_name: email.split("@")[0],
              role,
            })
          );
        }

        setSuccessMessage("Signing in...");
        setTimeout(() => {
          if (role === "seller") router.push("/seller/dashboard");
          else if (role === "verifier") router.push("/verifiers");
          else router.push("/buyer/dashboard");
        }, 500);
      }
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

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "custom"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Email &amp; Password
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("demo")}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "demo"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ⚡ Instant Demo Profiles
            </button>
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

          {/* Standard Form */}
          {activeTab === "custom" ? (
            <form onSubmit={handleCustomLogin} className="space-y-4">
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
                  <span className="text-xs text-indigo-600 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
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
          ) : (
            /* Instant Demo Switcher */
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                Click any role to test live authenticated views:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {demoRoles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleDemoLogin(role.id, role.destination)}
                      disabled={loading}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer ${role.bg}`}
                    >
                      <div className={`p-2.5 rounded-xl bg-white shadow-sm shrink-0 ${role.color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-sm font-black text-gray-900">
                            {role.title}
                          </strong>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white shadow-xs text-gray-700">
                            {role.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {role.description}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 self-center shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
      </div>
    </div>
  );
}
