"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Terminal,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  // Authentication Steps: 'CREDENTIALS' | 'OTP'
  const [step, setStep] = useState<"CREDENTIALS" | "OTP">("CREDENTIALS");

  // Form states
  const [email, setEmail] = useState("innoversity98@gmail.com");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // UI status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 2FA Timer State (120 seconds = 2 minutes)
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Timer Countdown Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft]);

  // Format MM:SS
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Step 1: Submit Credentials
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Invalid admin credentials or access denied.");
        setLoading(false);
        return;
      }

      // Transition to 2FA OTP Step
      setStep("OTP");
      setTimeLeft(120);
      setIsTimerActive(true);
      setSuccessMessage(data.message || "2FA verification code dispatched to your admin email.");
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    } catch (err: any) {
      setErrorMessage("Network error communicating with Admin Security Service.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste handling
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(digits.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    const cleanChar = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = cleanChar;
    setOtp(newOtp);

    // Auto advance to next input
    if (cleanChar && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify 2FA OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: fullOtp }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to verify 2FA code.");
        setLoading(false);
        return;
      }

      setSuccessMessage("2FA Identity Verified! Launching Command Center...");

      // Perform direct location redirect so cookies are strictly honored
      setTimeout(() => {
        window.location.href = data.redirect || "/admin/dashboard";
      }, 500);
    } catch (err) {
      setErrorMessage("Failed to verify code with Admin Security Service.");
      setLoading(false);
    }
  };

  // Resend 2FA Code
  const handleResendOtp = async () => {
    if (isTimerActive && timeLeft > 0) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Could not resend 2FA code.");
        return;
      }

      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(120);
      setIsTimerActive(true);
      setSuccessMessage("A fresh 6-digit verification code has been dispatched.");
      otpInputRefs.current[0]?.focus();
    } catch (err) {
      setErrorMessage("Network error resending code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-gray-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans select-none">
      {/* Background Matrix/Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Security Header Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 text-[11px] font-mono font-bold tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Restricted System · Tier 0 Gate
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0D121D] rounded-[10px] flex items-center justify-center text-emerald-400">
                <Terminal size={20} />
              </div>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white font-mono">
              INNOVERSITY<span className="text-emerald-400">.ADMIN</span>
            </h1>
          </div>

          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Decentralized Governance &amp; Institutional Oversight Command Center. Manual direct entry only.
          </p>
        </div>

        {/* Security Notification Messages */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 shadow-lg">
            <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-mono">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5 shadow-lg">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-mono">{successMessage}</span>
          </div>
        )}

        {/* ── Glassmorphism Form Container ──────────────────────────────────── */}
        <div className="bg-[#0E1422]/90 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-7 shadow-2xl shadow-black/80 space-y-6">
          {step === "CREDENTIALS" ? (
            /* STEP 1: CREDENTIALS */
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800/80 text-xs">
                <span className="font-mono text-gray-400 font-semibold flex items-center gap-1.5">
                  <KeyRound size={14} className="text-indigo-400" />
                  Primary Authentication
                </span>
                <span className="px-2 py-0.5 rounded bg-gray-800 text-[10px] font-mono text-gray-300">
                  Step 1 of 2
                </span>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold text-gray-300 uppercase tracking-wider">
                  Admin Identifier (Email)
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@innoversity.lk"
                    className="w-full pl-10 pr-4 py-3 bg-[#080B11] border border-gray-800 rounded-xl text-xs font-mono font-medium text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold text-gray-300 uppercase tracking-wider">
                  Master Security Key
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-[#080B11] border border-gray-800 rounded-xl text-xs font-mono font-medium text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-mono font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin text-white" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Authorize Command Access</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <span className="text-[10px] font-mono text-gray-500 flex items-center justify-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  SHA-256 + 2FA Mandatory on all admin accounts
                </span>
              </div>
            </form>
          ) : (
            /* STEP 2: 2FA OTP VERIFICATION */
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800/80 text-xs">
                <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldAlert size={14} />
                  2-Factor Authorization (2FA)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                  Step 2 of 2
                </span>
              </div>

              <div className="space-y-2 text-center">
                <p className="text-xs text-gray-300 font-mono">
                  Enter the 6-digit authorization code dispatched to:
                </p>
                <div className="px-3 py-1.5 rounded-lg bg-[#080B11] border border-gray-800 font-mono text-xs text-indigo-300 max-w-fit mx-auto">
                  {email}
                </div>
              </div>

              {/* 6-Digit OTP Box Grid */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={idx === 0 ? 6 : 1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-14 bg-[#080B11] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-center font-mono text-xl font-bold text-white rounded-xl outline-none transition-all"
                  />
                ))}
              </div>

              {/* Countdown Timer Row */}
              <div className="flex items-center justify-between px-1 text-xs font-mono">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Clock size={13} className={isTimerActive ? "text-amber-400" : "text-red-400"} />
                  {isTimerActive ? (
                    <>
                      Expires in:{" "}
                      <span className="font-bold text-amber-300">{formatTimer(timeLeft)}</span>
                    </>
                  ) : (
                    <span className="text-red-400 font-bold">2FA Code Expired</span>
                  )}
                </span>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isTimerActive && timeLeft > 0}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold disabled:opacity-40 disabled:hover:text-indigo-400 cursor-pointer transition-colors"
                >
                  Resend Code
                </button>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || (!isTimerActive && timeLeft === 0)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin text-white" />
                    <span>Validating 2FA Authorization...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Verify 2FA &amp; Launch Command Center</span>
                  </>
                )}
              </button>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep("CREDENTIALS");
                    setOtp(["", "", "", "", "", ""]);
                    setErrorMessage(null);
                  }}
                  className="text-[11px] font-mono text-gray-500 hover:text-gray-300 underline"
                >
                  ← Return to credential verification
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Audit Disclaimer */}
        <div className="text-center space-y-1">
          <p className="text-[10px] font-mono text-gray-600">
            CONFIDENTIAL · All session activities, IP handshakes, and role alterations are logged in Innoversity Immutable Audit Trail.
          </p>
        </div>
      </div>
    </div>
  );
}

