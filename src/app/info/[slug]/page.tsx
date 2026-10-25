"use client";

import { useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Truck,
  HelpCircle,
  FileText,
  Mail,
  AlertTriangle,
  Briefcase,
  BookOpen,
  DollarSign,
  ChevronRight,
  CheckCircle,
  Send,
  Building,
  Sparkles,
} from "lucide-react";

interface InfoContent {
  title: string;
  badge: string;
  tagline: string;
  icon: any;
  body: React.ReactNode;
}

function DynamicInfoPageContent() {
  const params = useParams();
  const slug = (params?.slug as string) || "help-centre";

  // State for interactive forms
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });

  // State for interactive fee calculator on /info/pricing
  const [calcPrice, setCalcPrice] = useState(15000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const getPageContent = (s: string): InfoContent => {
    switch (s) {
      case "verification-process":
        return {
          title: "Institutional Verification Process",
          badge: "Trust Architecture",
          tagline: "How university faculties and chambers endorse authentic prototypes.",
          icon: ShieldCheck,
          body: (
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed text-sm">
                Every innovation on Innoversity undergoes rigorous multi-point validation before earning the Verified badge.
                Undergraduate inventions from University of Moratuwa (ITUM), University of Colombo, SLIIT, and NSBM are verified
                by academic mentors, while SME innovations are audited through official Business Registration (BR) records.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    step: "1. Identity & Affiliation",
                    desc: "Student ID or BR Form 1 submitted. Sensitive NIC details are automatically masked to XXXXXX-XXX-4821.",
                  },
                  {
                    step: "2. Working Prototype Proof",
                    desc: "Lab logs, circuit schematics, or organic test certificates are uploaded for inspection.",
                  },
                  {
                    step: "3. Faculty Endorsement",
                    desc: "Official institutional mentor or department head signs off on the technical claims.",
                  },
                  {
                    step: "4. Escrow Adherence",
                    desc: "Seller pledges adherence to the 7-day auto-release customer satisfaction guarantee.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#F8F7FF] border border-indigo-100 space-y-1.5">
                    <strong className="text-sm font-black text-indigo-900 block">{item.step}</strong>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs leading-relaxed">
                <strong>Student Guarantee:</strong> Verification is 100% free for all enrolled university students in Sri Lanka.
              </div>
            </div>
          ),
        };

      case "escrow-guide":
        return {
          title: "The 7-Day Auto-Release Escrow Guide",
          badge: "Buyer & Seller Protection",
          tagline: "Understand how your payments are held securely in independent trust.",
          icon: Lock,
          body: (
            <div className="space-y-6 text-sm text-gray-600">
              <p className="leading-relaxed">
                Innoversity does not immediately transfer funds to sellers when an order is placed.
                Instead, funds remain locked in an accredited Sri Lankan escrow account until Domex Courier confirms delivery.
              </p>

              <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-3">
                <h4 className="font-bold text-amber-900 text-base flex items-center gap-2">
                  <Lock size={18} /> The 4 Escrow Rules
                </h4>
                <ul className="space-y-2 text-xs text-amber-950">
                  <li>• <strong>Rule 1:</strong> Funds are locked immediately upon checkout. No seller has access to card or account numbers.</li>
                  <li>• <strong>Rule 2:</strong> Delivery is authenticated via Domex / SL Post API webhooks.</li>
                  <li>• <strong>Rule 3:</strong> 7-day inspection window starts the moment the parcel is received.</li>
                  <li>• <strong>Rule 4:</strong> Auto-release executes after 7 days unless a dispute is filed.</li>
                </ul>
              </div>

              <p className="leading-relaxed">
                If the item arrives defective or does not match faculty specifications, raising a dispute freezes the countdown timer instantly.
              </p>
            </div>
          ),
        };

      case "pricing":
        const studentFee = Math.round(calcPrice * 0.05);
        const studentPayout = calcPrice - studentFee;
        return {
          title: "Transparent Pricing & Calculator",
          badge: "Fair Economics",
          tagline: "Zero upfront fees for university students. Pay only when you make a sale.",
          icon: DollarSign,
          body: (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-indigo-50/60 border border-indigo-200 space-y-3">
                  <span className="text-xs font-bold text-indigo-700 uppercase">Student Innovators</span>
                  <h3 className="text-2xl font-black text-indigo-900">0% Upfront Listing Fee</h3>
                  <p className="text-xs text-indigo-800 leading-relaxed">
                    5% flat transaction fee upon completed escrow release. Covers payment gateway and courier tracking webhook costs.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200 space-y-3">
                  <span className="text-xs font-bold text-gray-500 uppercase">Registered SMEs</span>
                  <h3 className="text-2xl font-black text-gray-900">7.5% Success Fee</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Includes commercial buyer invoicing, export customs documentation assistance, and priority courier pickup.
                  </p>
                </div>
              </div>

              {/* Interactive Fee Calculator */}
              <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-900 text-sm">Interactive Earnings Simulator:</h4>
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                    <span>Item Selling Price (Rs.):</span>
                    <span className="font-mono text-indigo-600 text-sm">Rs. {calcPrice.toLocaleString("en-LK")}</span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={100000}
                    step={500}
                    value={calcPrice}
                    onChange={(e) => setCalcPrice(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Listing Fee</span>
                    <strong className="text-emerald-600 font-bold">Rs. 0 (FREE)</strong>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Escrow &amp; Gateway (5%)</span>
                    <strong className="text-gray-700 font-bold">Rs. {studentFee.toLocaleString("en-LK")}</strong>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <span className="text-indigo-600 block text-[10px]">Net Innovator Payout</span>
                    <strong className="text-indigo-700 font-black text-sm">Rs. {studentPayout.toLocaleString("en-LK")}</strong>
                  </div>
                </div>
              </div>
            </div>
          ),
        };

      case "delivery-partners":
        return {
          title: "Island-wide Delivery Partners",
          badge: "Logistics Network",
          tagline: "Connecting 25 districts with reliable parcel and freight fulfillment.",
          icon: Truck,
          body: (
            <div className="space-y-6">
              <p className="text-gray-600 text-sm leading-relaxed">
                Innoversity partners directly with Sri Lanka&rsquo;s leading courier services to ensure hardware prototypes,
                agricultural formulations, and student inventions reach buyers securely with tracking.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                    DX
                  </div>
                  <h4 className="font-black text-gray-900 text-base">Domex Courier Express</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Automated airway bill generation with doorstep pickup in Colombo, Kandy, Galle, Moratuwa, and Gampaha.
                    1-2 business days delivery.
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center text-sm">
                    SLP
                  </div>
                  <h4 className="font-black text-gray-900 text-base">Sri Lanka Post Registered</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Connecting deep agricultural and rural communities across Jaffna, Matara, Kurunegala, and Badulla.
                    Economical 2-4 day recorded service.
                  </p>
                </div>
              </div>
            </div>
          ),
        };

      case "blog":
        return {
          title: "Innoversity Insights & Stories",
          badge: "Innovation Journal",
          tagline: "Spotlights on Sri Lankan student inventors, university research, and SME exports.",
          icon: BookOpen,
          body: (
            <div className="space-y-4">
              {[
                {
                  title: "How ITUM Undergrads Built an IoT Sensor for Paddy Moisture",
                  date: "October 20, 2026",
                  author: "Dr. L. Samaraweera",
                  summary: "A behind-the-scenes look at how the Moratuwa student team deployed 40 units across Anuradhapura farms.",
                },
                {
                  title: "From Matara to Global Kitchens: The Alba Cinnamon Journey",
                  date: "October 14, 2026",
                  author: "Innoversity Editorial",
                  summary: "How BR-verified smallholder cooperatives are bypassing middlemen through escrow-backed direct orders.",
                },
                {
                  title: "Why Hardware Creators in Sri Lanka Need Escrow Protection",
                  date: "October 02, 2026",
                  author: "Finance & Legal Desk",
                  summary: "Eliminating payment fraud and chargebacks for makers and electronics hobbyists.",
                },
              ].map((article, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-gray-100 hover:border-indigo-200 shadow-sm transition-all space-y-2">
                  <span className="text-[11px] font-semibold text-indigo-600">{article.date} · {article.author}</span>
                  <h4 className="font-black text-gray-900 text-base">{article.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{article.summary}</p>
                </div>
              ))}
            </div>
          ),
        };

      case "careers":
        return {
          title: "Work with Innoversity",
          badge: "Join Our Team",
          tagline: "Build Sri Lanka&rsquo;s most transformative technology and academic marketplace.",
          icon: Briefcase,
          body: (
            <div className="space-y-6">
              <p className="text-gray-600 text-sm leading-relaxed">
                We are a distributed team headquartered in Colombo, collaborating with student engineering societies
                and university incubators island-wide.
              </p>

              <div className="space-y-3">
                {[
                  { role: "Full-Stack Engineer (Next.js / Node / PostgreSQL)", type: "Full-time · Colombo / Remote" },
                  { role: "University Campus Ambassador (UoM / UoC / SLIIT / NSBM)", type: "Part-time Student Stipend" },
                  { role: "Escrow Operations & Dispute Arbitrator", type: "Full-time · Legal & Commercial Desk" },
                ].map((job, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div>
                      <strong className="text-sm font-black text-gray-900 block">{job.role}</strong>
                      <span className="text-xs text-gray-500">{job.type}</span>
                    </div>
                    <a
                      href="mailto:careers@innoversity.lk?subject=Application"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center transition-all shrink-0"
                    >
                      Apply Now
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ),
        };

      case "privacy-policy":
        return {
          title: "Privacy-First Policy (Zero-Leak)",
          badge: "Data Governance",
          tagline: "How we protect student NIC numbers, bank details, and personal data.",
          icon: Lock,
          body: (
            <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
              <p>
                Innoversity is architected under strict Privacy-by-Design principles to protect Sri Lankan university students
                and local SME founders from harassment, identity theft, or unauthorized data scraping.
              </p>
              <h4 className="font-bold text-sm text-gray-900 pt-2">1. NIC Masking at Row-Level Security</h4>
              <p>
                National Identity Card (NIC) numbers provided for verification are strictly masked to <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono font-bold text-gray-800">XXXXXX-XXX-4821</code>.
                Unmasked identification documents are encrypted with AES-256 and only accessible to accredited faculty mentors during audit.
              </p>
              <h4 className="font-bold text-sm text-gray-900 pt-2">2. Zero Contact Exposure</h4>
              <p>
                Personal telephone numbers, residential addresses, and direct bank account numbers are never exposed to public storefronts or unauthorized third parties.
              </p>
            </div>
          ),
        };

      case "terms-of-service":
        return {
          title: "Terms of Service & Escrow Agreement",
          badge: "Legal Framework",
          tagline: "Standardized contract terms under the laws of Sri Lanka.",
          icon: FileText,
          body: (
            <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
              <p>
                By using Innoversity.lk, buyers, student sellers, and verifiers agree to comply with these terms, governing marketplace listings,
                escrow handling, and dispute resolution.
              </p>
              <h4 className="font-bold text-sm text-gray-900 pt-2">1. Escrow Auto-Release Covenant</h4>
              <p>
                Buyers agree that payments vaulted for confirmed consignments will automatically release to the seller 7 calendar days after delivery
                confirmation, unless a dispute is filed prior to timer expiry.
              </p>
              <h4 className="font-bold text-sm text-gray-900 pt-2">2. Intellectual Property Protection</h4>
              <p>
                All student inventions, research papers, and circuit diagrams remain 100% the intellectual property of the respective students and university creators.
              </p>
            </div>
          ),
        };

      case "report-an-issue":
        return {
          title: "Report an Issue or Dispute",
          badge: "Resolution Desk",
          tagline: "Submit broken listings, delivery discrepancies, or payment questions.",
          icon: AlertTriangle,
          body: (
            <div className="space-y-6">
              {formSubmitted ? (
                <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                    ✓
                  </div>
                  <h4 className="font-black text-emerald-900 text-lg">Ticket Logged Successfully</h4>
                  <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                    Your report has been assigned reference <strong>#TKT-{Math.floor(100000 + Math.random() * 900000)}</strong>.
                    Our arbitration desk will contact you within 4 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                        placeholder="e.g. Ruwan Silva"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                        placeholder="ruwan@domain.lk"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Issue Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white"
                    >
                      <option value="escrow">Escrow Payment Hold Question</option>
                      <option value="courier">Domex / Courier Tracking Problem</option>
                      <option value="verification">Verification Badge Inaccuracy</option>
                      <option value="bug">Technical Bug or Error on Website</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Details of Problem</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please specify Order ID, link, or error details..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={15} /> Submit Urgent Report
                  </button>
                </form>
              )}
            </div>
          ),
        };

      case "contact-us":
      case "help-centre":
      default:
        return {
          title: s === "contact-us" ? "Contact Innoversity Support" : "Help Centre & Support Desk",
          badge: "24/7 Operations",
          tagline: "We're here to assist buyers, student innovators, and university faculty.",
          icon: HelpCircle,
          body: (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                  <span className="text-indigo-600 font-bold block mb-1">Email Support</span>
                  <a href="mailto:support@innoversity.lk" className="text-gray-900 font-semibold hover:underline">
                    support@innoversity.lk
                  </a>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                  <span className="text-indigo-600 font-bold block mb-1">Escrow Mediation</span>
                  <a href="mailto:escrow@innoversity.lk" className="text-gray-900 font-semibold hover:underline">
                    escrow@innoversity.lk
                  </a>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                  <span className="text-indigo-600 font-bold block mb-1">Colombo Office</span>
                  <p className="text-gray-700 font-semibold">
                    Racecourse Promenade, Colombo 07
                  </p>
                </div>
              </div>

              {formSubmitted ? (
                <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                    ✓
                  </div>
                  <h4 className="font-black text-emerald-900 text-lg">Message Received!</h4>
                  <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                    Thanks for reaching out! A member of our support team will respond to your email within 2-4 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                        placeholder="e.g. Nilmini Jayawardena"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                        placeholder="nilmini@gmail.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Inquiry regarding ITUM Paddy Sensor purchase"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you today?"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={15} /> Send Message to Innoversity Team
                  </button>
                </form>
              )}
            </div>
          ),
        };
    }
  };

  const page = getPageContent(slug);
  const PageIcon = page.icon;

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight size={13} />
            <span className="text-gray-500">Information Hub</span>
            <ChevronRight size={13} />
            <span className="font-bold text-indigo-600 capitalize">{slug.replace(/-/g, " ")}</span>
          </div>

          <div className="flex items-start gap-4 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <PageIcon size={24} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                {page.badge}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-0.5">
                {page.title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {page.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm">
          {page.body}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/innovations"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            ← Return to Innovations Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DynamicInfoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-gray-400">Loading information...</div>}>
      <DynamicInfoPageContent />
    </Suspense>
  );
}
