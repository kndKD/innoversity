"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function ListInnovationPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    sellerType: "student", // "student" | "sme"
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const maskedNicPreview = formData.nic.length >= 4
    ? `XXXXXX-XXX-${formData.nic.slice(-4)}`
    : "XXXXXX-XXX-4821";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} /> Seller Studio Onboarding
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            List Your Innovation
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Get institutionally verified, build buyer trust with 7-day escrow, and reach buyers nationwide.
          </p>

          {/* Stepper Progress */}
          <div className="flex items-center justify-center gap-3 pt-6 max-w-md mx-auto">
            {[
              { num: 1, label: "Verification" },
              { num: 2, label: "Innovation Story" },
              { num: 3, label: "Escrow & Price" },
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

      {/* Main Wizard Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm">
          {submitted ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                Application Submitted for Verification!
              </h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Your innovation <strong>&ldquo;{formData.title || "IoT Soil Moisture Sensor"}&rdquo;</strong> has been routed to the{" "}
                <span className="font-semibold text-indigo-600">{formData.institution}</span> verifier queue.
                Your NIC is masked to <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-emerald-700">{maskedNicPreview}</code>.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href="/seller/dashboard"
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition-all"
                >
                  Go to Seller Dashboard
                </Link>
                <Link
                  href="/innovations"
                  className="px-6 py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all"
                >
                  Browse Marketplace
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Verification Credentials */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-in-up">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      Step 1: Institutional Verification &amp; Privacy Shield
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Choose whether you are listing as an accredited university student or registered SME.
                    </p>
                  </div>

                  {/* Seller Type Selector */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, sellerType: "student" })}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                        formData.sellerType === "student"
                          ? "bg-indigo-50/60 border-indigo-500 text-indigo-900 shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <GraduationCap size={20} className="text-indigo-600" />
                      <div>
                        <strong className="block text-sm font-bold">University Student</strong>
                        <span className="text-[11px] text-gray-500">Free verification for undergraduates &amp; postgrads</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, sellerType: "sme" })}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                        formData.sellerType === "sme"
                          ? "bg-indigo-50/60 border-indigo-500 text-indigo-900 shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <Building size={20} className="text-indigo-600" />
                      <div>
                        <strong className="block text-sm font-bold">BR Verified SME</strong>
                        <span className="text-[11px] text-gray-500">Registered Sri Lankan business (ROC / DS)</span>
                      </div>
                    </button>
                  </div>

                  {/* Institution Select */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      {formData.sellerType === "student" ? "University / Faculty" : "Verification Entity"}
                    </label>
                    <select
                      id="seller-institution-select"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      className="w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-[#F8F7FF] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                    >
                      <optgroup label="🏛️ National Universities">
                        <option value="University of Moratuwa">University of Moratuwa</option>
                        <option value="ITUM">ITUM (Institute of Technology, University of Moratuwa)</option>
                        <option value="University of Colombo">University of Colombo</option>
                        <option value="UCSC">UCSC (University of Colombo School of Computing)</option>
                        <option value="University of Peradeniya">University of Peradeniya</option>
                        <option value="University of Kelaniya">University of Kelaniya</option>
                        <option value="University of Sri Jayewardenepura">University of Sri Jayewardenepura</option>
                        <option value="University of Jaffna">University of Jaffna</option>
                        <option value="University of Ruhuna">University of Ruhuna</option>
                        <option value="Eastern University">Eastern University</option>
                        <option value="South Eastern University">South Eastern University</option>
                        <option value="Rajarata University">Rajarata University</option>
                        <option value="Sabaragamuwa University">Sabaragamuwa University</option>
                        <option value="Wayamba University">Wayamba University</option>
                        <option value="Uva Wellassa University">Uva Wellassa University</option>
                        <option value="Open University">Open University</option>
                        <option value="Gampaha Wickramarachchi University">Gampaha Wickramarachchi University</option>
                        <option value="Vavuniya University">Vavuniya University</option>
                      </optgroup>
                      <optgroup label="🎓 Higher Educational Institutes &amp; Technical Colleges">
                        <option value="NIBM">NIBM (National Institute of Business Management)</option>
                        <option value="SLIATE/ATIs">SLIATE / ATIs (Advanced Technological Institutes)</option>
                        <option value="Ocean University">Ocean University of Sri Lanka</option>
                        <option value="Technical Colleges">Technical Colleges (DTET Sri Lanka)</option>
                        <option value="SLIIT">SLIIT</option>
                        <option value="NSBM Green University">NSBM Green University</option>
                      </optgroup>
                      <optgroup label="🏢 Small &amp; Medium Enterprises">
                        <option value="BR Verified SMEs">BR Verified SMEs (Chamber Endorsed)</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* NIC & Masking Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        National Identity Card (NIC)
                      </label>
                      <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        placeholder="e.g. 199924518210 or 992451821V"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Lock size={12} /> Public / Verifier Masked View
                      </label>
                      <div className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-mono font-bold">
                        {maskedNicPreview}
                      </div>
                    </div>
                  </div>

                  {/* Upload placeholder */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      {formData.sellerType === "student" ? "Upload Student ID Card / Letter" : "Upload Business Registration (BR Form 1)"}
                    </label>
                    <div className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl p-6 text-center bg-gray-50/50 cursor-pointer transition-colors">
                      <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-xs font-bold text-gray-700">Click to upload document or PDF</p>
                      <p className="text-[11px] text-gray-400 mt-1">PDF, JPG, PNG up to 10MB (Encrypted storage)</p>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center gap-2"
                    >
                      Next: Innovation Story <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Innovation Story & Specs */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in-up">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      Step 2: Tell the Story Behind Your Innovation
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Buyers support genuine creators. Share the problem you identified in Sri Lanka and how you built the solution.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Product Title
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="AgriTech">AgriTech</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Food & Beverage">Food & Beverage</option>
                        <option value="Productivity">Productivity</option>
                        <option value="Health & Wellness">Health & Wellness</option>
                        <option value="IoT & Hardware">IoT & Hardware</option>
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Moratuwa">Moratuwa</option>
                        <option value="Colombo">Colombo</option>
                        <option value="Kandy">Kandy</option>
                        <option value="Matara">Matara</option>
                        <option value="Galle">Galle</option>
                        <option value="Gampaha">Gampaha</option>
                        <option value="Jaffna">Jaffna</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      The Story Behind This Innovation
                    </label>
                    <textarea
                      name="story"
                      rows={4}
                      value={formData.story}
                      onChange={handleChange}
                      placeholder="What motivated you to develop this? What was the research process? Who helped in testing?"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      onClick={() => setStep(3)}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center gap-2"
                    >
                      Next: Pricing &amp; Escrow <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Pricing & Escrow Setup */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-in-up">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">
                      Step 3: Pricing &amp; Escrow Setup
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Set fair pricing in Sri Lankan Rupees (Rs.) and configure the buyer inspection window.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Price per Unit (Rs. / LKR)
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
                      <option value="7">7 Days (Standard for prototypes &amp; hardware)</option>
                      <option value="10">10 Days (Recommended for agricultural formulations)</option>
                      <option value="14">14 Days (Extended for high-complexity test systems)</option>
                    </select>
                    <p className="text-[11px] text-amber-700">
                      Funds are released automatically into your bank account after delivery once this window expires without disputes.
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Domex">Domex Courier (Integrated Airway Bill Generation)</option>
                      <option value="SLPost">Sri Lanka Post Registered Parcel</option>
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
                      className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-200 transition-all flex items-center gap-2"
                    >
                      {isSubmitting ? "Submitting Application…" : "Submit Innovation for Verification"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
