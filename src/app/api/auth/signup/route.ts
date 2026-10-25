import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured, UserRole } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name, role } = body;

    // Validation
    if (!email || !password || !full_name) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields (email, password, full name)." },
        { status: 400 }
      );
    }

    const validRoles: UserRole[] = ["buyer", "seller", "verifier", "admin"];
    const targetRole: UserRole = validRoles.includes(role) ? role : "buyer";

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Determine target redirect path
    const redirectUrl = targetRole === "seller" ? "/onboarding" : "/buyer/dashboard";

    // If Supabase is fully configured, perform real authentication registration
    if (isSupabaseConfigured()) {
      const supabaseAdmin = getSupabaseAdmin();

      // Sign up user with metadata
      const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role: targetRole,
          },
        },
      });

      if (authError) {
        return NextResponse.json(
          { success: false, error: authError.message },
          { status: 400 }
        );
      }

      if (authData.user) {
        // Ensure record is saved into public.users table
        const { error: dbError } = await supabaseAdmin
          .from("users")
          .upsert(
            {
              id: authData.user.id,
              email: authData.user.email!,
              full_name,
              role: targetRole,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

        if (dbError) {
          console.error("Error upserting public.users record:", dbError);
        }

        return NextResponse.json({
          success: true,
          message: "Account created successfully.",
          user: {
            id: authData.user.id,
            email: authData.user.email,
            full_name,
            role: targetRole,
          },
          session: authData.session,
          redirectUrl,
        });
      }
    }

    // Fallback mode (when Supabase credentials are not yet configured in local environment)
    const simulatedUserId = "usr-" + Math.random().toString(36).substring(2, 10);
    return NextResponse.json({
      success: true,
      message: "Account created in development/preview mode.",
      user: {
        id: simulatedUserId,
        email,
        full_name,
        role: targetRole,
      },
      session: {
        access_token: "simulated_token_" + Date.now(),
        user: { id: simulatedUserId, email },
      },
      redirectUrl,
      isDemoMode: true,
    });
  } catch (err: any) {
    console.error("Signup API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error occurred during registration." },
      { status: 500 }
    );
  }
}
