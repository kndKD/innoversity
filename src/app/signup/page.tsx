"use client";

import { useState, useEffect, useRef } from "react";
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
  Building,
  KeyRound,
  Clock,
  RotateCw,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Logo } from "@/components/logo";

const OTP_EXPIRY_SECONDS = 120; // 2 minutes

export default function SignUpPage() {
  const router = useRouter();

  // Form State
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Flow State: "form" | "otp"
  const [step, setStep] = useState<"form" | "otp">("form");

  // OTP State: 6 digits
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(OTP_EXPIRY_SECONDS);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  // Status & UI State
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ── 2-Minute Countdown Timer ──────────────────────────────────────────────
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // ── Step 1: Submit Sign Up Form -> Call /api/auth/send-otp ─────────────────
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
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
      const targetRole = role === "seller" ? "SELLER" : "BUYER";

      console.log("[SIGNUP-SUBMIT] Requesting OTP for:", cleanEmail, "Role:", targetRole);

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          fullName: cleanName,
          password,
          role: targetRole,
        }),
      });

      const data = await res.json();
      console.log("[SIGNUP-SUBMIT] API response:", data);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send verification code.");
      }

      // Switch to 6-Digit OTP verification screen
      setStep("otp");
      setTimeLeft(data.expiresInSeconds || OTP_EXPIRY_SECONDS);
      setIsTimerActive(true);
      setOtpDigits(["", "", "", "", "", ""]);
      setSuccessMessage(data.message || `A 6-digit verification code has been sent to ${cleanEmail}.`);

      // Auto-focus first OTP input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      console.error("[SIGNUP-SUBMIT-ERROR]", err);
      setErrorMessage(err.message || "Failed to initiate registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP Input Handlers ───────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const updated = [...otpDigits];
      updated[index] = "";
      setOtpDigits(updated);
      return;
    }

    const char = cleaned.slice(-1);
    const updated = [...otpDigits];
    updated[index] = char;
    setOtpDigits(updated);

    if (index < 5 && char) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const updated = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasted[i] || "";
    }
    setOtpDigits(updated);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // ── Resend New OTP Action -> Call /api/auth/send-otp ───────────────────────
  const handleResendOtp = async () => {
    if (timeLeft > 0 || resending) return;

    setResending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = fullName.trim();
      const targetRole = role === "seller" ? "SELLER" : "BUYER";

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          fullName: cleanName,
          password,
          role: targetRole,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to resend verification code.");
      }

      // Reset timer to 2 minutes
      setTimeLeft(data.expiresInSeconds || OTP_EXPIRY_SECONDS);
      setIsTimerActive(true);
      setOtpDigits(["", "", "", "", "", ""]);
      setSuccessMessage("A fresh 6-digit verification code has been dispatched to your email.");
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend verification OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  // ── Step 2: Verify OTP & Create Real Account -> Call /api/auth/verify-otp ─
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const otpCode = otpDigits.join("").trim();
    if (otpCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit OTP code.");
      return;
    }

    if (timeLeft <= 0) {
      setErrorMessage("This verification code has expired. Please click 'Resend New OTP' below.");
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      console.log("[VERIFY-OTP] Submitting 6-digit verification code for:", cleanEmail);

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          otp: otpCode,
        }),
      });

      const data = await res.json();
      console.log("[VERIFY-OTP] Response from /api/auth/verify-otp:", data);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "OTP verification failed. Please double check the code.");
      }

      // Clear any legacy demo cookies / local storage
      if (typeof window !== "undefined") {
        document.cookie =
          "innoversity_demo_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        localStorage.removeItem("innoversity_user");
      }

      // Show success toast & redirect strictly to /signin
      setSuccessMessage("Account verified! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/signin?verified=true");
      }, 1000);
    } catch (err: any) {
      console.error("[VERIFY-OTP-ERROR]", err);
      setErrorMessage(err.message || "OTP verification failed. Please double check the code.");
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
            {step === "otp" ? "Verify Your Email" : "Create Your Account"}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {step === "otp"
              ? `Enter the 6-digit security code sent to ${email}`
              : "Join Sri Lanka's verified innovation marketplace with institutional trust"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-7 sm:p-9 shadow-xl space-y-6">
          {/* Feedback Alerts */}
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

          {/* ── STEP 1: Registration Form ─────────────────────────────────── */}
          {step === "form" ? (
            <>
              {/* Role Selection Cards */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                  Select Your Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
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
                      placeholder={role === "buyer" ? "e.g. Ruwan Jayasinghe" : "e.g. Kasun Perera"}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900 bg-white"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900 bg-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Password Fields */}
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

                {/* Trust Notice */}
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 flex items-start gap-2">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    A 6-digit confirmation code will be dispatched to your email with a 2-minute expiration window to confirm your account identity.
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
                      <span>Sending OTP Verification...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Email Verification</span>
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
            </>
          ) : (
            /* ── STEP 2: 6-Digit Email OTP Verification ────────────────────────── */
            <div className="space-y-6">
              {/* Back to form link */}
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setIsTimerActive(false);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Change email or details ({email})</span>
              </button>

              {/* Security Icon & Explainer */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 mx-auto">
                  <KeyRound size={26} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Enter Verification Code</h2>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  We sent a 6-digit confirmation code to{" "}
                  <span className="font-bold text-gray-800">{email}</span>. Please enter it below.
                </p>
              </div>

              {/* 6-Digit Boxes */}
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        disabled={loading || timeLeft <= 0}
                        className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-black rounded-2xl border transition-all text-gray-900 bg-white focus:outline-none ${
                          timeLeft <= 0
                            ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
                            : digit
                            ? "border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20"
                            : "border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                        }`}
                      />
                    ))}
                  </div>

                  {/* 2-Minute Countdown Display */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs">
                    <Clock
                      size={14}
                      className={timeLeft <= 30 ? "text-rose-500 animate-pulse" : "text-gray-400"}
                    />
                    {timeLeft > 0 ? (
                      <span className="text-gray-600">
                        Code expires in:{" "}
                        <span
                          className={`font-mono font-bold ${
                            timeLeft <= 30 ? "text-rose-600" : "text-indigo-600"
                          }`}
                        >
                          {formatTimer(timeLeft)}
                        </span>
                      </span>
                    ) : (
                      <span className="font-semibold text-rose-600">
                        Code expired (00:00). Please request a new OTP.
                      </span>
                    )}
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={loading || timeLeft <= 0 || otpDigits.join("").length !== 6}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying 6-Digit Code...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Verify OTP &amp; Complete Registration</span>
                    </>
                  )}
                </button>

                {/* Resend New OTP Section */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={timeLeft > 0 || resending}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all ${
                      timeLeft > 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                    }`}
                  >
                    <RotateCw size={13} className={resending ? "animate-spin" : ""} />
                    <span>
                      {resending
                        ? "Dispatching new OTP..."
                        : timeLeft > 0
                        ? `Resend available in ${formatTimer(timeLeft)}`
                        : "Resend New OTP"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}
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
