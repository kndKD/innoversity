"use client";

import { useState } from "react";
import Link from "next/link";
import { Share2, ExternalLink, Globe, Mail, Check, X } from "lucide-react";

const footerLinks = [
  {
    heading: "Marketplace",
    links: [
      { label: "Browse Innovations", href: "/innovations" },
      { label: "IT Solutions & Services", href: "/innovations?category=IT+Solutions+%26+Services" },
      { label: "AgriTech", href: "/innovations?category=AgriTech" },
      { label: "Electronics", href: "/innovations?category=Electronics" },
      { label: "Food & Beverage", href: "/innovations?category=Food+%26+Beverage" },
      { label: "Productivity", href: "/innovations?category=Productivity" },
    ],
  },
  {
    heading: "Sellers",
    links: [
      { label: "List Your Product", href: "/list-innovation" },
      { label: "Verification Process", href: "/info/verification-process" },
      { label: "Pay Safely Guide", href: "/info/escrow-guide" },
      { label: "Seller Dashboard", href: "/seller/dashboard" },
      { label: "Pricing", href: "/info/pricing" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Verifier Portal", href: "/verifiers" },
      { label: "Delivery Partners", href: "/info/delivery-partners" },
      { label: "Blog", href: "/info/blog" },
      { label: "Careers", href: "/info/careers" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Centre", href: "/info/help-centre" },
      { label: "Contact Us", href: "/info/contact-us" },
      { label: "Privacy Policy", href: "/info/privacy-policy" },
      { label: "Terms of Service", href: "/info/terms-of-service" },
      { label: "Report an Issue", href: "/info/report-an-issue" },
    ],
  },
];

const socialLinks = [
  { id: "share", icon: Share2, label: "Share Innoversity", action: "share" },
  { id: "linkedin", icon: ExternalLink, label: "LinkedIn", href: "https://linkedin.com/company/innoversity-lk" },
  { id: "web", icon: Globe, label: "Official Web", href: "https://innoversity.lk" },
  { id: "email", icon: Mail, label: "Contact Mail", href: "mailto:hello@innoversity.lk" },
];

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleSocialClick = (e: React.MouseEvent, s: typeof socialLinks[0]) => {
    if (s.action === "share") {
      e.preventDefault();
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(window.location.origin);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <footer
      className="bg-[#080911] text-gray-400 relative"
      aria-label="Site footer"
    >
      {/* Toast Notification */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in-up">
          <Check size={16} /> Marketplace link copied to clipboard!
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top: logo + description + link columns */}
        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 border-b border-[#1E2240]">
          {/* Brand column */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
                <span className="text-white font-black text-sm">IV</span>
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Innoversity
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              Sri Lanka&rsquo;s Verified Innovation Marketplace — connecting student
              and SME innovators with buyers safely via institutional verification and 7-day safe holding protection.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 font-medium">Follow us:</span>
              {socialLinks.map((s) => (
                <a
                  key={s.id}
                  href={s.href || "#"}
                  onClick={(e) => handleSocialClick(e, s)}
                  aria-label={s.label}
                  title={s.label}
                  className="w-8 h-8 rounded-lg bg-[#0F1120] border border-[#1E2240] flex items-center justify-center text-gray-500 hover:text-indigo-400 hover:border-indigo-800 transition-all duration-200"
                  target={s.href?.startsWith("http") ? "_blank" : undefined}
                  rel={s.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-white tracking-widest uppercase">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-indigo-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            &copy; 2026 Innoversity (Pvt) Ltd. Registered in Colombo, Sri Lanka.
          </p>
          <p className="text-xs text-gray-700">
            Prices displayed in <span className="text-gray-500 font-medium">LKR (Rs.)</span> · Protected by Pay Safely (Safe Holding Protection)
          </p>
        </div>
      </div>
    </footer>
  );
}
