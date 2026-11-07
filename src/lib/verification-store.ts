"use client";

import { DbSellerProfile, VerificationStatus } from "./supabase";

export interface VerificationItem extends DbSellerProfile {
  id: string;
  applicant_name: string;
  applicant_email?: string;
  shop_name: string;
  shop_category: string;
  shop_bio?: string;
  document_preview_url?: string;
  document_type?: string;
  verifier_approved_at?: string | null;
  admin_approved_at?: string | null;
  verifier_email?: string | null;
  notification_sent_at?: string | null;
  product_draft?: any;
}

const STORAGE_KEY = "innoversity_verification_store_v2";
const EVENT_NAME = "innoversity_verification_changed";

// Default initial seller profiles for seamless local demo & review
export const initialSellerProfiles: VerificationItem[] = [
  {
    id: "sp-001",
    user_id: "usr-chamara-01",
    applicant_name: "Chamara Dissanayake",
    applicant_email: "c.dissanayake@itum.mrt.ac.lk",
    shop_name: "Lanka Solar Dynamics",
    shop_category: "AgriTech",
    shop_bio: "Automated solar-powered irrigation controllers and precision sensors built at University of Moratuwa.",
    institution_or_business: "University of Moratuwa",
    district: "Colombo",
    verification_status: "pending",
    nic_number: "2001****4821",
    document_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    document_type: "student_id",
    submitted_at: "2026-10-20T08:30:00Z",
    verifier_email: "auditor.innovations@uom.lk",
    notification_sent_at: "2026-10-20T08:31:00Z",
    notes: "Dept of Electronic Engineering · Reg 21/IT/0482 · Supervisor Endorsement Included",
  },
  {
    id: "sp-002",
    user_id: "usr-dilini-02",
    applicant_name: "Dilini Kumarihami",
    applicant_email: "dilini@ayurlanka.lk",
    shop_name: "AyurGreen Naturals Sri Lanka",
    shop_category: "Health & Wellness",
    shop_bio: "Organic Ceylon herbal formulations & zero-chemical mosquito repellent coils.",
    institution_or_business: "BR Verified SMEs",
    district: "Gampaha",
    verification_status: "verifier_approved",
    nic_number: "1994****9034",
    document_url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    document_type: "br_certificate",
    submitted_at: "2026-10-21T11:15:00Z",
    verifier_approved_at: "2026-10-22T09:40:00Z",
    verifier_email: "chamber.registry@commerce.gov.lk",
    notification_sent_at: "2026-10-21T11:16:00Z",
    notes: "Business Reg PV-00284712 · Chamber Verifier signed off. Awaiting final Admin sign-off.",
  },
  {
    id: "sp-003",
    user_id: "usr-ashan-03",
    applicant_name: "Ashan Wickramaratne",
    applicant_email: "ashan.w@sliit.lk",
    shop_name: "TagSync Retail IoT",
    shop_category: "IoT & Hardware",
    shop_bio: "Wireless e-ink shelf tags and cloud stock synchronization hardware for local retailers.",
    institution_or_business: "SLIIT",
    district: "Colombo",
    verification_status: "pending",
    nic_number: "2000****1173",
    document_url: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=800&q=80",
    document_type: "student_id",
    submitted_at: "2026-10-22T14:45:00Z",
    verifier_email: "faculty.board@sliit.lk",
    notification_sent_at: "2026-10-22T14:46:00Z",
    notes: "Faculty of Computing · Lab Prototype tested with 3 Colombo supermarkets",
  },
  {
    id: "sp-004",
    user_id: "usr-priya-04",
    applicant_name: "Priya Navaratnam",
    applicant_email: "priya.n@sci.cmb.ac.lk",
    shop_name: "Ceylon Blue Botanicals",
    shop_category: "Food & Beverage",
    shop_bio: "Concentrated Butterfly Pea flower extracts and natural antioxidant food colorings.",
    institution_or_business: "University of Colombo",
    district: "Colombo",
    verification_status: "admin_approved",
    nic_number: "2002****6652",
    document_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    document_type: "student_id",
    submitted_at: "2026-10-18T09:00:00Z",
    verifier_approved_at: "2026-10-19T10:00:00Z",
    admin_approved_at: "2026-10-19T14:30:00Z",
    reviewed_at: "2026-10-19T14:30:00Z",
    notes: "Faculty of Science & Admin certified. Marketplace storefront fully unlocked.",
  },
  {
    id: "sp-005",
    user_id: "usr-kasun-05",
    applicant_name: "Kasun Perera",
    applicant_email: "k.perera@itum.mrt.ac.lk",
    shop_name: "Moratuwa IoT Dynamics",
    shop_category: "IoT & Hardware",
    shop_bio: "Automated humidity & temperature poultry incubators and agricultural sensors.",
    institution_or_business: "University of Moratuwa (ITUM)",
    district: "Moratuwa",
    verification_status: "admin_approved",
    nic_number: "2001****3891",
    document_url: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=800&q=80",
    document_type: "student_id",
    submitted_at: "2026-10-15T08:00:00Z",
    verifier_approved_at: "2026-10-16T10:00:00Z",
    admin_approved_at: "2026-10-16T12:00:00Z",
    reviewed_at: "2026-10-16T12:00:00Z",
    notes: "ITUM Faculty Verified & Admin Certified · Escrow payouts unlocked",
  },
];

// Helper to get all profiles from localStorage or fallback
export function getStoredVerificationProfiles(): VerificationItem[] {
  if (typeof window === "undefined") {
    return initialSellerProfiles;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSellerProfiles));
      return initialSellerProfiles;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialSellerProfiles;
  } catch (e) {
    console.error("Error reading verification store:", e);
    return initialSellerProfiles;
  }
}

// Helper to save profiles into localStorage and dispatch custom event
export function saveStoredVerificationProfiles(profiles: VerificationItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: profiles }));
  } catch (e) {
    console.error("Error saving verification store:", e);
  }
}

// Add or update a seller verification profile
export function upsertVerificationProfile(profile: Partial<VerificationItem> & { user_id: string }): VerificationItem {
  const current = getStoredVerificationProfiles();
  const existingIndex = current.findIndex(
    (p) => p.user_id === profile.user_id || (profile.shop_name && p.shop_name.toLowerCase() === profile.shop_name.toLowerCase())
  );

  let updatedItem: VerificationItem;

  if (existingIndex >= 0) {
    updatedItem = {
      ...current[existingIndex],
      ...profile,
      verification_status: profile.verification_status || current[existingIndex].verification_status || "pending",
    };
    current[existingIndex] = updatedItem;
  } else {
    updatedItem = {
      id: profile.id || `sp-${Date.now()}`,
      user_id: profile.user_id,
      applicant_name: profile.applicant_name || "Applicant Creator",
      applicant_email: profile.applicant_email,
      shop_name: profile.shop_name || "Innoversity Innovation Studio",
      shop_category: profile.shop_category || "IoT & Hardware",
      shop_bio: profile.shop_bio || "",
      institution_or_business: profile.institution_or_business || "University of Moratuwa",
      district: profile.district || "Colombo",
      verification_status: profile.verification_status || "pending",
      nic_number: profile.nic_number || "2001****9999",
      document_url: profile.document_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      document_type: profile.document_type || "student_id",
      submitted_at: profile.submitted_at || new Date().toISOString(),
      verifier_email: profile.verifier_email || "auditor.innovations@uom.lk",
      notification_sent_at: new Date().toISOString(),
      notes: profile.notes || "Submitted via Seller Onboarding",
    };
    current.unshift(updatedItem);
  }

  saveStoredVerificationProfiles(current);
  return updatedItem;
}

// Check if a seller is fully approved by BOTH Verifier AND Admin
export function isSellerFullyApproved(identifier?: {
  userId?: string;
  sellerName?: string;
  shopName?: string;
}): boolean {
  if (!identifier) return false;

  const profiles = getStoredVerificationProfiles();

  if (identifier.userId) {
    const match = profiles.find((p) => p.user_id === identifier.userId);
    if (match) {
      return match.verification_status === "admin_approved" || match.verification_status === "approved";
    }
  }

  const nameToMatch = (identifier.sellerName || identifier.shopName || "").toLowerCase().trim();
  if (nameToMatch) {
    const match = profiles.find(
      (p) =>
        p.applicant_name.toLowerCase().trim() === nameToMatch ||
        p.shop_name.toLowerCase().trim() === nameToMatch
    );
    if (match) {
      return match.verification_status === "admin_approved" || match.verification_status === "approved";
    }
  }

  return false;
}

// Backward-compatible check for verified badge
export function isSellerVerified(identifier?: {
  userId?: string;
  sellerName?: string;
  shopName?: string;
  institution?: string;
}): boolean {
  return isSellerFullyApproved(identifier);
}

// Check if a seller is allowed to create products on marketplace
export function canSellerListProducts(identifier?: {
  userId?: string;
  role?: string;
  sellerName?: string;
  shopName?: string;
}): { allowed: boolean; reason?: string; stage?: VerificationStatus } {
  if (!identifier) {
    return { allowed: false, reason: "Unauthenticated" };
  }

  if (identifier.role && identifier.role !== "seller") {
    return {
      allowed: false,
      reason: "Buyer accounts cannot list products. Please register as a verified Creator/Seller.",
    };
  }

  const details = getSellerVerificationDetails(identifier);
  if (!details) {
    return {
      allowed: false,
      reason: "No KYC application found. Complete onboarding first.",
      stage: "pending",
    };
  }

  if (details.verification_status === "admin_approved" || details.verification_status === "approved") {
    return { allowed: true, stage: details.verification_status };
  }

  if (details.verification_status === "verifier_approved") {
    return {
      allowed: false,
      reason: "Verifier Sign-off complete! Awaiting Platform Admin final approval before storefront opens.",
      stage: "verifier_approved",
    };
  }

  if (details.verification_status === "rejected") {
    return {
      allowed: false,
      reason: `Verification rejected: ${details.notes || "Invalid documentation"}. Please re-submit in Onboarding.`,
      stage: "rejected",
    };
  }

  return {
    allowed: false,
    reason: "Your KYC application is currently queued under Institutional Verifier review.",
    stage: "pending",
  };
}

// Get the verification details of a specific seller
export function getSellerVerificationDetails(identifier?: {
  userId?: string;
  sellerName?: string;
  shopName?: string;
}): VerificationItem | null {
  if (!identifier) return null;
  const profiles = getStoredVerificationProfiles();

  if (identifier.userId) {
    const found = profiles.find((p) => p.user_id === identifier.userId);
    if (found) return found;
  }

  const nameToMatch = (identifier.sellerName || identifier.shopName || "").toLowerCase().trim();
  if (nameToMatch) {
    const found = profiles.find(
      (p) =>
        p.applicant_name.toLowerCase().trim() === nameToMatch ||
        p.shop_name.toLowerCase().trim() === nameToMatch
    );
    if (found) return found;
  }

  return null;
}

// Pipeline stage human-readable descriptors
export function getVerificationPipelineInfo(status?: VerificationStatus) {
  switch (status) {
    case "admin_approved":
    case "approved":
      return {
        stepNumber: 3,
        label: "Admin Approved",
        badgeText: "✓ Fully Verified Creator",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        description: "Storefront active, product listing unlocked, and 7-day escrow payouts authorized.",
      };
    case "verifier_approved":
      return {
        stepNumber: 2,
        label: "Under Admin Final Sign-Off",
        badgeText: "🏛️ Verifier Signed Off · Admin Pending",
        color: "text-blue-700 bg-blue-50 border-blue-200",
        description: "Accredited Faculty Verifier has certified student credentials. Awaiting final Admin governance approval.",
      };
    case "rejected":
      return {
        stepNumber: 1,
        label: "Requires Resubmission",
        badgeText: "❌ Verification Rejected",
        color: "text-red-700 bg-red-50 border-red-200",
        description: "Documents could not be validated. Please check auditor notes and upload valid institutional proof.",
      };
    case "pending":
    default:
      return {
        stepNumber: 1,
        label: "Under Verifier Review",
        badgeText: "⏳ Awaiting Verifier Audit",
        color: "text-amber-800 bg-amber-50 border-amber-200",
        description: "Application submitted and encrypted. Automated notification dispatched to institutional auditor.",
      };
  }
}

// Subscribe to verification changes in React components
export function subscribeToVerification(callback: (profiles: VerificationItem[]) => void) {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent<VerificationItem[]>;
    callback(custom.detail || getStoredVerificationProfiles());
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getStoredVerificationProfiles());
    }
  };

  window.addEventListener(EVENT_NAME, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(EVENT_NAME, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
