"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Truck,
  EyeOff,
  Clock,
  CheckCircle,
  FileText,
  Building,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Globe,
} from "lucide-react";

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24">
      {/* Hero Header */}
      <section className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> Trust Architecture
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            How Innoversity Works
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Sri Lanka&rsquo;s first multi-tier innovation platform combining university verification,
            privacy-first credentials, and an automated Pay Safely 7-day safe holding protection engine.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Link
              href="/innovations"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all"
            >
              Explore Innovations
            </Link>
            <Link
              href="/list-innovation"
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-sm transition-all"
            >
              List an Innovation
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars Interactive Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Pillar 1: Privacy-First Verification */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              01
            </div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Zero Information Leaks
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Privacy-First Academic &amp; SME Verification
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Every innovator submits student credentials (e.g. ITUM Moratuwa, Colombo, SLIIT) or
              Department of Registrar of Companies Business Registration (BR). Our system masks sensitive
              National Identity Card (NIC) data to <code className="bg-gray-100 px-2 py-0.5 rounded text-emerald-800 font-bold">XXXXXX-XXX-4821</code>.
            </p>
            <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                <span>Phone numbers, personal emails &amp; bank accounts hidden at API/RLS row level</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                <span>Institutional faculty or chamber verifiers validate prototypes without accessing personal PII</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                <span>Badges assigned only after 4-point verification checklist passes</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-gray-900 to-[#0F1120] rounded-3xl p-6 sm:p-8 text-white border border-gray-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-xs font-mono text-gray-400">api/verifiers/credentials</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-400 border border-emerald-700/50">
                RLS PROTECTED
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-gray-800/60 border border-gray-700 flex justify-between items-center">
                <span className="text-gray-400">Seller NIC:</span>
                <span className="text-emerald-400 font-bold">XXXXXX-XXX-4821</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-800/60 border border-gray-700 flex justify-between items-center">
                <span className="text-gray-400">Direct Phone:</span>
                <span className="text-amber-400 flex items-center gap-1 font-bold">
                  <EyeOff size={13} /> 🔒 Hidden at API/RLS Level
                </span>
              </div>
              <div className="p-3 rounded-xl bg-gray-800/60 border border-gray-700 flex justify-between items-center">
                <span className="text-gray-400">Bank Details:</span>
                <span className="text-amber-400 flex items-center gap-1 font-bold">
                  <EyeOff size={13} /> 🔒 Hidden at API/RLS Level
                </span>
              </div>
              <div className="p-3 rounded-xl bg-gray-800/60 border border-gray-700 flex justify-between items-center">
                <span className="text-gray-400">Verification Institution:</span>
                <span className="text-indigo-300 font-bold">University of Moratuwa (ITUM)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: Pay Safely 7-Day Safe Holding Protection */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 bg-amber-50/70 rounded-3xl p-6 sm:p-8 border border-amber-200/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <Clock size={16} /> Pay Safely 7-Day Auto-Release Protection
              </span>
              <span className="text-xs font-mono font-bold text-amber-900 bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                T-07:00:00:00
              </span>
            </div>

            <div className="space-y-3 text-xs text-amber-900">
              <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                <strong className="block text-gray-900">Step 1: Protected Deposit Vaulted</strong>
                <p className="text-gray-500">Buyer pays online. Funds are held in our secure safe holding deposit account.</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                <strong className="block text-gray-900">Step 2: Courier Confirmation</strong>
                <p className="text-gray-500">Seller dispatches via Domex or SL Post. Tracking updates automatically.</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                <strong className="block text-gray-900">Step 3: 7-Day Inspection Countdown</strong>
                <p className="text-gray-500">Once delivered, the buyer has 7 full days to inspect and test the hardware or goods.</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                <strong className="block text-gray-900">Step 4: Auto-Release or Dispute Freeze</strong>
                <p className="text-gray-500">Buyer confirms or timer reaches zero → funds auto-released to seller. Raising dispute freezes the timer.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              02
            </div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              Financial Security
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Pay Safely 7-Day Safe Holding Protection
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              No buyer wants to transfer money directly into personal bank accounts for custom student prototypes.
              And student creators should never face chargebacks or non-paying buyers.
            </p>
            <p className="text-sm leading-relaxed text-gray-600">
              Our automated Pay Safely protection ensures buyer peace of mind while guaranteeing student innovators
              get paid without friction once their creation is delivered.
            </p>
          </div>
        </div>

        {/* Pillar 3: Domestic & Export Logistics */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              03
            </div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Island-wide &amp; Global Shipping
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Integrated Courier Logistics (Domex &amp; SL Post)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Seamless delivery across all 25 districts of Sri Lanka. Sellers generate pre-formatted
              airway bills directly from the Seller Studio with integrated Domex door-to-door pickup.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-[#F8F7FF] border border-indigo-100">
                <Truck className="text-indigo-600 mb-2" size={20} />
                <strong className="block text-gray-900 font-bold mb-1">Domestic Delivery</strong>
                <p className="text-gray-500">1-3 business days island-wide. Real-time webhook tracking integrated with Pay Safely protection.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8F7FF] border border-indigo-100">
                <Globe className="text-indigo-600 mb-2" size={20} />
                <strong className="block text-gray-900 font-bold mb-1">Export Ready</strong>
                <p className="text-gray-500">Certified for Matara pure Alba cinnamon, tea, and packaged electronics export.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#080911] rounded-3xl p-8 text-white border border-[#1E2240] shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-gray-300">Supported Delivery Integrations</h4>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#0F1120] border border-[#1E2240] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                    DX
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">Domex Courier Express</h5>
                    <p className="text-xs text-gray-500">Doorstep pickup in Western, Central &amp; Southern Provinces</p>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">Active Integration</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0F1120] border border-[#1E2240] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-sm">
                    SLP
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">Sri Lanka Post (Registered)</h5>
                    <p className="text-xs text-gray-500">Covering remote and rural agricultural districts</p>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">Active Integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6 pt-8">
        <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
          Ready to join Sri Lanka&rsquo;s verified innovation ecosystem?
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/list-innovation"
            className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-200 transition-all"
          >
            Start as a Seller
          </Link>
          <Link
            href="/verifiers"
            className="px-8 py-4 rounded-2xl bg-white border border-gray-200 hover:border-indigo-300 text-gray-800 font-bold text-sm shadow-sm transition-all"
          >
            Access Verifier Portal
          </Link>
        </div>
      </section>
    </div>
  );
}
