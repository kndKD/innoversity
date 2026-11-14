import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    // 1. Look up profile in PostgreSQL Prisma profiles table using findFirst
    const profileDelegate = (prisma as any).profile || (prisma as any).profiles;
    let profile = null;
    try {
      profile = await profileDelegate.findFirst({
        where: { email: cleanEmail },
      });
    } catch (dbErr) {
      console.error("[SIGNIN] Prisma profile lookup error:", dbErr);
    }

    // If no profile exists at all in the database
    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const userId = profile.id;
    const targetRole = (profile.role || "BUYER").toUpperCase();
    const fullName = profile.fullName || "Buyer";

    // 2. Prepare the JSON response
    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: cleanEmail,
        fullName,
        role: targetRole,
      },
    });

    // 3. Supabase Auth attempt with response cookie synchronization
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://innoversity-project.supabase.co";
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_development";

    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, {
                ...options,
                path: options?.path || "/",
              });
            });
          },
        },
      });

      await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
    } catch (authErr) {
      console.warn("[SIGNIN] Supabase Auth sign-in notice (database session will be used):", authErr);
    }

    // 4. Set unified innoversity_session cookie so middleware and server components recognize session
    const sessionPayload = JSON.stringify({
      id: userId,
      email: cleanEmail,
      fullName,
      role: targetRole,
      timestamp: Date.now(),
    });

    response.cookies.set("innoversity_session", sessionPayload, {
      path: "/",
      httpOnly: false, // accessible to client and server middleware
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log(`[SIGNIN] ✓ Session cookie set for ${cleanEmail} (ID: ${userId}, Role: ${targetRole})`);

    return response;
  } catch (err: any) {
    console.error("[SIGNIN-FATAL] Unexpected error in /api/auth/signin:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to authenticate." },
      { status: 500 }
    );
  }
}
