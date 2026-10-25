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
  Sparkles,
  CheckCircle,
} from "lucide-react";

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
    description: "Browse verified inventions, order via 7-day escrow, and track courier dispatches.",
    destination: "/innovations",
    icon: User,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
  },
  {
    id: "student",
    title: "Student / SME Seller",
    badge: "Seller Studio",
    description: "Manage escrow wallet, view Rs. 58,100 pending balances, and attach Domex tracking.",
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
  const [activeTab, setActiveTab] = useState<"demo" | "custom">("demo");
  const [email, setEmail] = useState("k.perera@itum.mrt.ac.lk");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedRole, setSelectedRole] = useState<RoleType>("student");
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = (destination: string) => {
    setLoading(true);
    setTimeout(() => {
      router.push(destination);
    }, 400);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (selectedRole === "student") router.push("/seller/dashboard");
      else if (selectedRole === "verifier" || selectedRole === "admin") router.push("/verifiers");
      else router.push("/innovations");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24 flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
                <span className="text-white font-black text-sm">IV</span>
              </div>
              <span className="font-black text-xl text-gray-900 tracking-tight">
                Innoversity
              </span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Welcome to Innoversity
            </h1>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Select an instant demo profile or log in with your institutional university credentials.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl">
            <button
              onClick={() => setActiveTab("demo")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "demo"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ⚡ Instant Demo Role Switcher
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "custom"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Email &amp; Password Login
            </button>
          </div>

          {/* Instant Demo Switcher */}
          {activeTab === "demo" ? (
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                Click any role to test its live functional UI:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {demoRoles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleDemoLogin(role.destination)}
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
          ) : (
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Account Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as RoleType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold"
                >
                  <option value="student">Student / SME Innovator</option>
                  <option value="buyer">Corporate or Individual Buyer</option>
                  <option value="verifier">Faculty Academic Verifier</option>
                  <option value="admin">Platform Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Authenticating…" : "Sign In to Innoversity"}
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-gray-100 text-center text-xs text-gray-500">
            Protected by Innoversity Zero-Leak Academic Auth · <Link href="/info/privacy-policy" className="text-indigo-600 underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
