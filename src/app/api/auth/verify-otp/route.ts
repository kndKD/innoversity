import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanOtp = (otp || "").trim();

    if (!cleanEmail || !cleanOtp) {
      return NextResponse.json(
        { success: false, error: "Email and 6-digit OTP code are required." },
        { status: 400 }
      );
    }

    // 1. Fetch pending OTP record from Prisma using findFirst
    const record = await prisma.otpVerification.findFirst({
      where: { email: cleanEmail },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          error: "No pending verification code found for this email. Please request a new code.",
        },
        { status: 400 }
      );
    }

    // 2. Check 2-minute expiration (expiresAt)
    const now = new Date();
    if (now > new Date(record.expiresAt)) {
      return NextResponse.json(
        {
          success: false,
          error: "OTP expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    // 3. Verify 6-digit OTP hash match
    const submittedHash = crypto.createHash("sha256").update(cleanOtp).digest("hex");
    if (submittedHash !== record.otpHash) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid verification code. Please check and try again.",
        },
        { status: 400 }
      );
    }

    // 4. Create the real user in Supabase Auth (or retrieve existing UUID)
    let userId: string = "";

    if (isSupabaseConfigured()) {
      const supabaseAdmin = getSupabaseAdmin();
      try {
        const { data: adminUserData, error: adminError } =
          await supabaseAdmin.auth.admin.createUser({
            email: cleanEmail,
            password: record.password,
            email_confirm: true,
            user_metadata: {
              full_name: record.fullName,
              role: record.role,
            },
          });

        if (adminError) {
          // If the user was already created in Supabase Auth, fetch their ID and confirm
          const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = listData?.users?.find(
            (u) => u.email?.toLowerCase() === cleanEmail
          );

          if (existingUser) {
            userId = existingUser.id;
            await supabaseAdmin.auth.admin.updateUserById(userId, {
              password: record.password,
              email_confirm: true,
              user_metadata: {
                full_name: record.fullName,
                role: record.role,
              },
            });
          } else {
            // Attempt standard signUp
            const { data: signUpData, error: signUpError } =
              await supabaseAdmin.auth.signUp({
                email: cleanEmail,
                password: record.password,
                options: {
                  data: {
                    full_name: record.fullName,
                    role: record.role,
                  },
                },
              });

            if (signUpError) {
              console.error("Supabase signUp fallback error:", signUpError);
            }
            userId = signUpData.user?.id || crypto.randomUUID();
          }
        } else if (adminUserData.user) {
          userId = adminUserData.user.id;
        }
      } catch (authErr) {
        console.error("Supabase Auth admin createUser notice:", authErr);
        userId = crypto.randomUUID();
      }
    } else {
      userId = crypto.randomUUID();
    }

    if (!userId) {
      userId = crypto.randomUUID();
    }

    // 5. Immediately upsert the matching record into Prisma `profiles` table
    const profile = await prisma.profile.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: cleanEmail,
        fullName: record.fullName,
        role: record.role,
      },
      update: {
        email: cleanEmail,
        fullName: record.fullName,
        role: record.role,
      },
    });

    // 6. Ensure matching wallet exists with Rs. 0 initial balance
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
      console.warn("Wallet creation notice:", walletErr);
    }

    // 7. Delete the used OTP record from OtpVerification
    try {
      await prisma.otpVerification.deleteMany({
        where: { email: cleanEmail },
      });
    } catch (delErr) {
      console.warn("OTP cleanup notice:", delErr);
    }

    return NextResponse.json({
      success: true,
      message: "Account verified! Please sign in.",
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        role: profile.role,
      },
    });
  } catch (err: any) {
    console.error("verify-otp error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to verify code. Please try again.",
      },
      { status: 500 }
    );
  }
}

