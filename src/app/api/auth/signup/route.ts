import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, fullName, full_name, role, password } = body;

    const resolvedFullName = (fullName || full_name || "").trim();
    const resolvedEmail = (email || "").trim().toLowerCase();
    const resolvedRole = (role || "BUYER").toString().toUpperCase() === "SELLER" ? "SELLER" : "BUYER";

    let userId = id;

    // If an existing Supabase Auth user ID was not provided:
    if (!userId) {
      if (isSupabaseConfigured() && password) {
        const supabaseAdmin = getSupabaseAdmin();
        const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
          email: resolvedEmail,
          password,
          options: {
            data: {
              full_name: resolvedFullName,
              role: resolvedRole,
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
          userId = authData.user.id;
        }
      } else {
        userId = crypto.randomUUID();
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Failed to establish a valid user ID for profile registration." },
        { status: 400 }
      );
    }

    // Sync / Upsert matching record into Prisma `profiles` table
    const profile = await prisma.profile.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: resolvedEmail || null,
        fullName: resolvedFullName || null,
        role: resolvedRole,
      },
      update: {
        email: resolvedEmail || undefined,
        fullName: resolvedFullName || undefined,
        role: resolvedRole,
      },
    });

    // Ensure wallet exists for this profile
    try {
      await prisma.wallet.upsert({
        where: { userId: profile.id },
        create: {
          userId: profile.id,
          balance: 0,
          pendingBalance: 0,
          totalEarned: 0,
        },
        update: {},
      });
    } catch (walletErr) {
      console.warn("Wallet init notice:", walletErr);
    }

    const redirectUrl = resolvedRole === "SELLER" ? "/onboarding" : "/buyer/dashboard";

    return NextResponse.json({
      success: true,
      message: "Account and profile successfully created.",
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        role: profile.role,
      },
      redirectUrl,
    });
  } catch (err: any) {
    console.error("Signup API error:", err);

    // Handle Prisma unique constraint violation (e.g. duplicate email)
    if (err.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists. Please sign in." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: err.message || "Internal server error occurred during registration." },
      { status: 500 }
    );
  }
}
