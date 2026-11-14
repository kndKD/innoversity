import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ user: null });
    }

    // Read real profile from Prisma PostgreSQL
    let profile = null;
    try {
      profile = await prisma.profile.findUnique({
        where: { id: user.id },
      });
    } catch (dbErr) {
      console.error("Error reading profile from Prisma:", dbErr);
    }

    const role = (profile?.role || user.user_metadata?.role || "BUYER").toUpperCase();
    const fullName =
      profile?.fullName ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "User";

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName,
        role,
        district: profile?.district || null,
        phone: profile?.phone || null,
        createdAt: profile?.createdAt || user.created_at,
      },
    });
  } catch (error: any) {
    if (
      error?.digest === "HANGING_PROMISE_REJECTION" ||
      error?.message?.includes("During prerendering")
    ) {
      throw error;
    }
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json({ user: null });
  }
}

