import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signAdminToken, ADMIN_COOKIE_NAME, ADMIN_ROLES } from "@/lib/admin-auth";

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

    // 1. Fetch pending OTP record from Prisma
    const record = await prisma.otpVerification.findFirst({
      where: { email: cleanEmail },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          error: "No pending 2FA code found for this admin email. Please request a new code.",
        },
        { status: 400 }
      );
    }

    // 2. Check 2-minute expiration
    const now = new Date();
    if (now > new Date(record.expiresAt)) {
      return NextResponse.json(
        {
          success: false,
          error: "Verification code expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    // 3. Verify OTP hash
    const submittedHash = crypto.createHash("sha256").update(cleanOtp).digest("hex");
    if (submittedHash !== record.otpHash) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid 6-digit code. Please check and try again.",
        },
        { status: 400 }
      );
    }

    // 4. Verify Profile exists and has Admin Role
    const profile = await prisma.profile.findFirst({
      where: { email: cleanEmail },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Admin profile not found." },
        { status: 403 }
      );
    }

    const userRole = (profile.role || "").toUpperCase();
    if (!ADMIN_ROLES.includes(userRole as any)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized role for admin command center." },
        { status: 403 }
      );
    }

    // 5. Delete used OTP record to prevent replay attacks
    try {
      await prisma.otpVerification.delete({
        where: { id: record.id },
      });
    } catch (delErr) {
      console.warn("Notice: OTP deletion warning:", delErr);
    }

    // 6. Generate signed 8-hour Admin 2FA Token
    const adminToken = signAdminToken({
      userId: profile.id,
      email: cleanEmail,
      role: userRole,
      fullName: profile.fullName || "Innoversity Admin",
    });

    // 7. Prepare response and set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      redirect: "/admin/dashboard",
      admin: {
        id: profile.id,
        email: cleanEmail,
        fullName: profile.fullName,
        role: userRole,
      },
    });

    // HTTP-only high-security cookie for 2FA validation
    response.cookies.set(ADMIN_COOKIE_NAME, adminToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60, // 8 hours
    });

    // Also set unified innoversity_session cookie so general role detection also recognizes admin
    const sessionPayload = JSON.stringify({
      id: profile.id,
      email: cleanEmail,
      fullName: profile.fullName || "Innoversity Admin",
      role: userRole,
      isAdmin: true,
      timestamp: Date.now(),
    });

    response.cookies.set("innoversity_session", sessionPayload, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 8 * 60 * 60,
    });

    // 8. Record audit log
    try {
      await prisma.adminAuditLog.create({
        data: {
          adminId: profile.id,
          adminEmail: cleanEmail,
          action: "ADMIN_LOGIN_SUCCESS",
          targetType: "AUTH",
          targetId: profile.id,
          details: `Admin successfully authenticated via 2FA. Session granted (Role: ${userRole}).`,
        },
      });
    } catch (auditErr) {
      console.warn("Audit log notice:", auditErr);
    }

    console.log(`[ADMIN-2FA-SUCCESS] Admin session granted for ${cleanEmail} (Role: ${userRole})`);
    return response;
  } catch (err: any) {
    console.error("[ADMIN-VERIFY-OTP-FATAL] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to verify 2FA code." },
      { status: 500 }
    );
  }
}

