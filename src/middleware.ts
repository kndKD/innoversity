import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { parseAdminSessionCookie, ADMIN_COOKIE_NAME } from "@/lib/admin-edge";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://innoversity-project.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_development";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const pathname = request.nextUrl.pathname;

  // ── 1. Dedicated High-Security Admin Portal Protection ─────────────────────
  // A. Protect Admin APIs (except /api/admin/auth/*)
  if (pathname.startsWith("/api/admin")) {
    if (!pathname.startsWith("/api/admin/auth")) {
      const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
      const adminSession = adminCookie ? parseAdminSessionCookie(adminCookie) : null;

      if (!adminSession) {
        return NextResponse.json(
          { success: false, error: "Access denied. Valid admin 2FA session required." },
          { status: 401 }
        );
      }
    }
  }

  // B. Protect Admin Dashboard UI
  if (pathname.startsWith("/admin/dashboard")) {
    const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const adminSession = adminCookie ? parseAdminSessionCookie(adminCookie) : null;

    if (!adminSession) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // C. Auto-redirect logged-in admin from /admin login page directly to /admin/dashboard
  if (pathname === "/admin") {
    const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const adminSession = adminCookie ? parseAdminSessionCookie(adminCookie) : null;

    if (adminSession) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // ── 2. Buyer Route Protection ──────────────────────────────────────────────
  if (pathname.startsWith("/buyer")) {
    let isAuthenticated = false;

    // 1. Check Supabase Auth user session
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }

    // 2. Check unified innoversity_session cookie
    if (!isAuthenticated) {
      const sessionCookie = request.cookies.get("innoversity_session")?.value;
      if (sessionCookie) {
        try {
          const parsed = JSON.parse(sessionCookie);
          if (parsed && parsed.id) {
            isAuthenticated = true;
          }
        } catch {}
      }
    }

    if (!isAuthenticated) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/signin";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/buyer/:path*",
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
