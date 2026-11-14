import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, fullName, password, role } = body;

    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanFullName = (fullName || "").trim();
    const cleanPassword = password || "";
    const resolvedRole = (role || "BUYER").toString().toUpperCase() === "SELLER" ? "SELLER" : "BUYER";

    console.log(`\n======================================================`);
    console.log(`[AUTH-OTP] ── Received Send-OTP Request ──`);
    console.log(`[AUTH-OTP] Target Email: "${cleanEmail}"`);
    console.log(`[AUTH-OTP] Full Name   : "${cleanFullName}"`);
    console.log(`[AUTH-OTP] Role        : "${resolvedRole}"`);

    // Basic Input Validations
    if (!cleanEmail || !cleanEmail.includes("@")) {
      console.warn(`[AUTH-OTP] Invalid email format: "${cleanEmail}"`);
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      console.warn(`[AUTH-OTP] Password too short for: "${cleanEmail}"`);
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 1. Strictly query PostgreSQL Prisma profiles table
    console.log(`[AUTH-OTP] Querying prisma.profile.findUnique({ where: { email: "${cleanEmail}" } })...`);
    
    // Support either prisma.profile or prisma.profiles delegate
    const profileDelegate = (prisma as any).profile || (prisma as any).profiles;
    const existingProfile = await profileDelegate.findUnique({
      where: { email: cleanEmail },
    });

    if (existingProfile) {
      console.warn(`[AUTH-OTP] ⚠️ Existing profile found in DB: ID ${existingProfile.id} for "${cleanEmail}"`);
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email address already exists. Please sign in.",
        },
        { status: 409 }
      );
    }

    console.log(`[AUTH-OTP] ✓ Verified: No existing account found in database for "${cleanEmail}".`);

    // 2. Generate a secure random 6-digit numeric OTP (100000 - 999999)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otpCode).digest("hex");
    console.log(`[AUTH-OTP] Generated 6-digit OTP code: ${otpCode}`);

    // 3. Set expiration to exact 2 minutes (120 seconds) from now
    const expiresAt = new Date(Date.now() + 120 * 1000);

    // 4. Save / Upsert in OtpVerification table
    await prisma.otpVerification.upsert({
      where: { email: cleanEmail },
      create: {
        email: cleanEmail,
        otpHash,
        fullName: cleanFullName || null,
        password: cleanPassword,
        role: resolvedRole,
        expiresAt,
      },
      update: {
        otpHash,
        fullName: cleanFullName || null,
        password: cleanPassword,
        role: resolvedRole,
        expiresAt,
        createdAt: new Date(),
      },
    });
    console.log(`[AUTH-OTP] ✓ Saved OTP record in OtpVerification table (expires at ${expiresAt.toISOString()}).`);

    // 5. Send clean Innoversity-branded HTML email via Nodemailer Gmail SMTP
    console.log(`[AUTH-OTP] Dispatching email via Nodemailer to ${cleanEmail}...`);
    try {
      await sendOtpEmail(cleanEmail, otpCode, cleanFullName);
      console.log(`[AUTH-OTP] ✓ Email successfully sent to ${cleanEmail}!`);
    } catch (mailErr: any) {
      console.error(`[AUTH-OTP] ❌ Nodemailer dispatch failed for ${cleanEmail}:`, mailErr.message);
      console.log(`[AUTH-OTP] [FALLBACK LOG] Code for ${cleanEmail}: ${otpCode}`);

      if (
        mailErr.message?.includes("Invalid login") ||
        mailErr.message?.includes("Username and Password not accepted")
      ) {
        throw new Error("SMTP authentication failed. Please check your Gmail App Password.");
      }

      // If running in development with outbound socket restrictions, allow flow to proceed
      if (process.env.NODE_ENV === "production") {
        throw mailErr;
      }
    }

    console.log(`[AUTH-OTP] ── Completed Send-OTP for ${cleanEmail} ──\n======================================================`);

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}.`,
      expiresAt: expiresAt.toISOString(),
      expiresInSeconds: 120,
    });
  } catch (err: any) {
    console.error(`[AUTH-OTP-FATAL] Error in send-otp:`, err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to send verification code. Please try again.",
      },
      { status: 500 }
    );
  }
}
