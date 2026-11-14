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

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 1. Check if user already exists in PostgreSQL Prisma profiles table
    const existingProfile = await prisma.profile.findUnique({
      where: { email: cleanEmail },
    });

    if (existingProfile) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email address already exists. Please sign in.",
        },
        { status: 409 }
      );
    }

    // 2. Generate a secure random 6-digit numeric OTP (100000 - 999999)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otpCode).digest("hex");

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

    // 5. Send clean Innoversity-branded HTML email via Nodemailer Gmail SMTP
    try {
      await sendOtpEmail(cleanEmail, otpCode, cleanFullName);
    } catch (mailErr: any) {
      console.error("Nodemailer dispatch error:", mailErr.message);
      console.log(`[INNOVERSITY-OTP] Code for ${cleanEmail}: ${otpCode}`);

      if (
        mailErr.message?.includes("Invalid login") ||
        mailErr.message?.includes("Username and Password not accepted")
      ) {
        throw new Error("SMTP authentication failed. Please check your Gmail App Password.");
      }

      if (process.env.NODE_ENV === "production") {
        throw mailErr;
      }
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}.`,
      expiresAt: expiresAt.toISOString(),
      expiresInSeconds: 120,
    });
  } catch (err: any) {
    console.error("send-otp error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to send verification code. Please try again.",
      },
      { status: 500 }
    );
  }
}
