import crypto from "crypto";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "innoversity_admin_2fa";
export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "MODERATOR"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

const ADMIN_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "innoversity-super-admin-high-security-key-2026";

export interface AdminSessionPayload {
  userId: string;
  email: string;
  role: string;
  fullName?: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Creates a cryptographically signed session token for the admin 2FA session.
 */
export function signAdminToken(payload: Omit<AdminSessionPayload, "issuedAt" | "expiresAt">): string {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + 8 * 60 * 60 * 1000; // 8 hours validity

  const fullPayload: AdminSessionPayload = {
    ...payload,
    issuedAt,
    expiresAt,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies a signed admin session token. Returns the payload if valid and unexpired.
 */
export function verifyAdminToken(token: string): AdminSessionPayload | null {
  if (!token || !token.includes(".")) return null;

  try {
    const [payloadBase64, providedSig] = token.split(".");
    const expectedSig = crypto
      .createHmac("sha256", ADMIN_SECRET)
      .update(payloadBase64)
      .digest("base64url");

    if (providedSig !== expectedSig) {
      return null;
    }

    const json = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const payload = JSON.parse(json) as AdminSessionPayload;

    if (Date.now() > payload.expiresAt) {
      return null;
    }

    const cleanRole = (payload.role || "").toUpperCase();
    if (!ADMIN_ROLES.includes(cleanRole as any)) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Extracts and verifies the admin session from a NextRequest or cookies object.
 */
export function getAdminSessionFromRequest(request: NextRequest): AdminSessionPayload | null {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Helper to check role permissions.
 */
export function isSuperAdmin(role: string): boolean {
  return (role || "").toUpperCase() === "SUPER_ADMIN";
}

export function isAdmin(role: string): boolean {
  const r = (role || "").toUpperCase();
  return r === "SUPER_ADMIN" || r === "ADMIN";
}

export function isStaff(role: string): boolean {
  const r = (role || "").toUpperCase();
  return ADMIN_ROLES.includes(r as any);
}

