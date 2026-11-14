import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

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

    // Try Supabase server client signInWithPassword first
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!error && data.user) {
        const profile = await prisma.profile.findUnique({
          where: { id: data.user.id },
        });

        return NextResponse.json({
          success: true,
          user: {
            id: data.user.id,
            email: data.user.email,
            fullName: profile?.fullName || data.user.user_metadata?.full_name || "User",
            role: (profile?.role || data.user.user_metadata?.role || "BUYER").toUpperCase(),
          },
        });
      }
    } catch {
      // Fallback to Prisma database lookup if Supabase cloud is not configured
    }

    // Database fallback
    const profile = await prisma.profile.findUnique({
      where: { email: cleanEmail },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName || "User",
        role: (profile.role || "BUYER").toUpperCase(),
      },
    });
  } catch (err: any) {
    console.error("Sign in API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to authenticate." },
      { status: 500 }
    );
  }
}

