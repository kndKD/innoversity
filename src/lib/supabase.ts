import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

// User and Seller types
export type UserRole = "buyer" | "seller" | "verifier" | "admin";
export type VerificationStatus =
  | "pending"
  | "verifier_approved"
  | "admin_approved"
  | "approved"
  | "rejected";

export interface DbUser {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  created_at: string;
  updated_at?: string;
}

export interface DbSellerProfile {
  id?: string;
  user_id: string;
  shop_name?: string;
  shop_category?: string;
  shop_bio?: string;
  applicant_name?: string;
  institution_or_business: string;
  district: string;
  verification_status: VerificationStatus;
  nic_number: string; // Masked for privacy
  document_url: string;
  document_type?: string;
  submitted_at: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  verifier_approved_at?: string | null;
  admin_approved_at?: string | null;
  verifier_email?: string | null;
  notification_sent_at?: string | null;
  notes?: string | null;
}

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://innoversity-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_development";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    Boolean(url) &&
    Boolean(anonKey) &&
    !(url && url.includes("your-project-id")) &&
    !(anonKey && anonKey.includes("dummy_anon_key"))
  );
};

// Singleton Supabase browser/client using @supabase/ssr to persist cookies in document.cookie
export const createBrowserSupabase = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey);

export const supabase: SupabaseClient = createBrowserSupabase();

// Admin client for server-side operations (bypasses RLS with service role key if available)
export const getSupabaseAdmin = (): SupabaseClient => {
  const key = supabaseServiceRoleKey || supabaseAnonKey;
  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

/**
 * Utility to mask Sri Lankan National Identity Card (NIC) numbers.
 * Supports both old 9-digit + letter (e.g. 991234567V -> 99*****67V)
 * and new 12-digit format (e.g. 200112345678 -> 2001****5678).
 */
export function maskNic(nic: string): string {
  if (!nic) return "";
  const cleaned = nic.trim().toUpperCase();

  // If already masked (contains X or *), return as is
  if (cleaned.includes("X") || cleaned.includes("*")) {
    return cleaned;
  }

  if (cleaned.length === 10) {
    // Old NIC: 9 digits + letter (e.g. 991234567V)
    return `${cleaned.slice(0, 2)}*****${cleaned.slice(7)}`;
  } else if (cleaned.length === 12) {
    // New NIC: 12 digits (e.g. 200112345678)
    return `${cleaned.slice(0, 4)}****${cleaned.slice(8)}`;
  } else if (cleaned.length > 4) {
    const keepStart = Math.min(2, Math.floor(cleaned.length / 4));
    const keepEnd = Math.min(2, Math.floor(cleaned.length / 4));
    const maskLength = cleaned.length - keepStart - keepEnd;
    return `${cleaned.slice(0, keepStart)}${"*".repeat(maskLength)}${cleaned.slice(cleaned.length - keepEnd)}`;
  }

  return cleaned;
}
