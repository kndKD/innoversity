export const ADMIN_COOKIE_NAME = "innoversity_admin_2fa";
export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "MODERATOR"] as const;

export interface EdgeAdminPayload {
  userId: string;
  email: string;
  role: string;
  fullName?: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Edge-compatible token parser for Next.js Middleware.
 * Decodes the base64url payload and verifies validity without importing Node 'crypto'.
 */
export function parseAdminSessionCookie(token: string | undefined): EdgeAdminPayload | null {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  try {
    const [payloadBase64, signature] = token.split(".");
    if (!payloadBase64 || !signature) {
      return null;
    }

    // Convert base64url to base64
    let base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    let jsonStr: string;
    if (typeof atob === "function") {
      jsonStr = atob(base64);
    } else if (typeof Buffer !== "undefined") {
      jsonStr = Buffer.from(base64, "base64").toString("utf-8");
    } else {
      return null;
    }

    const payload = JSON.parse(jsonStr) as EdgeAdminPayload;

    if (!payload.expiresAt || Date.now() > payload.expiresAt) {
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

