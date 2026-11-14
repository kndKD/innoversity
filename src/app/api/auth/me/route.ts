import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    let authUserId: string | null = null;
    let authUserEmail: string | null = null;

    // 1. Try Supabase Auth session first
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        authUserId = user.id;
        authUserEmail = user.email || null;
      }
    } catch {}

    // 2. Check unified innoversity_session cookie fallback
    if (!authUserId) {
      const sessionCookie = request.cookies.get("innoversity_session")?.value;
      if (sessionCookie) {
        try {
          const parsed = JSON.parse(sessionCookie);
          if (parsed && parsed.id) {
            authUserId = parsed.id;
            authUserEmail = parsed.email || null;
          }
        } catch {}
      }
    }

    if (!authUserId) {
      return NextResponse.json({ user: null });
    }

    // 3. Read real profile from Prisma PostgreSQL
    const profileDelegate = (prisma as any).profile || (prisma as any).profiles;
    let profile = null;
    try {
      profile = await profileDelegate.findUnique({
        where: { id: authUserId },
      });
    } catch (dbErr) {
      console.error("[AUTH-ME] Error reading profile from Prisma:", dbErr);
    }

    const role = (profile?.role || "BUYER").toUpperCase();
    const fullName =
      profile?.fullName ||
      authUserEmail?.split("@")[0] ||
      "Buyer";

    return NextResponse.json({
      user: {
        id: authUserId,
        email: profile?.email || authUserEmail,
        fullName,
        role,
        district: profile?.district || null,
        phone: profile?.phone || null,
        createdAt: profile?.createdAt || new Date().toISOString(),
      },
    });
  } catch (error: any) {
    if (
      error?.digest === "HANGING_PROMISE_REJECTION" ||
      error?.digest === "NEXT_PRERENDER_INTERRUPTED" ||
      error?.message?.includes("bail out of prerendering") ||
      error?.message?.includes("During prerendering")
    ) {
      throw error;
    }
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json({ user: null });
  }
}
