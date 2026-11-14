import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromRequest, isSuperAdmin } from "@/lib/admin-auth";
import { MAIN_ADMIN_EMAIL } from "@/lib/admin-bootstrap";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // List all users with administrative roles
    const adminProfiles = await prisma.profile.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "ADMIN", "MODERATOR"] },
      },
      orderBy: { createdAt: "asc" },
    });

    const isCurrentSuperAdmin = isSuperAdmin(session.role) || session.email === MAIN_ADMIN_EMAIL.toLowerCase();

    return NextResponse.json({
      success: true,
      team: adminProfiles,
      isSuperAdmin: isCurrentSuperAdmin,
    });
  } catch (err: any) {
    console.error("[ADMIN-TEAM-GET-ERROR]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // STRICT RBAC: Only Super Admin (innoversity98@gmail.com) can manage the admin team
    const isCurrentSuperAdmin = isSuperAdmin(session.role) || session.email === MAIN_ADMIN_EMAIL.toLowerCase();
    if (!isCurrentSuperAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Permission denied. Only Super Admin (innoversity98@gmail.com) can manage admin roles.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, email, role, userId } = body;

    const cleanEmail = (email || "").trim().toLowerCase();

    // Protection rule: innoversity98@gmail.com can NEVER be demoted or revoked
    if (cleanEmail === MAIN_ADMIN_EMAIL.toLowerCase() && action === "revoke") {
      return NextResponse.json(
        { success: false, error: "The primary Super Admin account cannot be revoked." },
        { status: 400 }
      );
    }

    if (action === "promote") {
      if (!cleanEmail || !["ADMIN", "MODERATOR"].includes(role)) {
        return NextResponse.json(
          { success: false, error: "Please provide a valid email and target role (ADMIN or MODERATOR)." },
          { status: 400 }
        );
      }

      // 1. Check if profile exists
      let profile = await prisma.profile.findFirst({
        where: { email: cleanEmail },
      });

      if (!profile) {
        // Create profile if doesn't exist
        const newId = crypto.randomUUID();
        profile = await prisma.profile.create({
          data: {
            id: newId,
            email: cleanEmail,
            fullName: cleanEmail.split("@")[0].toUpperCase() + " (Staff)",
            role: role,
          },
        });
      } else {
        profile = await prisma.profile.update({
          where: { id: profile.id },
          data: { role: role },
        });
      }

      // Update Supabase Auth metadata if configured
      if (isSupabaseConfigured()) {
        try {
          const supabaseAdmin = getSupabaseAdmin();
          await supabaseAdmin.auth.admin.updateUserById(profile.id, {
            user_metadata: { role: role },
          });
        } catch {}
      }

      // Log in AdminAuditLog
      await prisma.adminAuditLog.create({
        data: {
          adminId: session.userId,
          adminEmail: session.email,
          action: "ROLE_ASSIGN",
          targetType: "USER_ROLE",
          targetId: profile.id,
          details: `User ${cleanEmail} promoted to '${role}' by Super Admin.`,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Successfully assigned ${role} role to ${cleanEmail}.`,
        profile,
      });
    }

    if (action === "revoke") {
      const targetId = userId;
      let targetProfile = null;

      if (targetId) {
        targetProfile = await prisma.profile.findUnique({ where: { id: targetId } });
      } else if (cleanEmail) {
        targetProfile = await prisma.profile.findFirst({ where: { email: cleanEmail } });
      }

      if (!targetProfile) {
        return NextResponse.json({ success: false, error: "Target profile not found." }, { status: 404 });
      }

      if (targetProfile.email?.toLowerCase() === MAIN_ADMIN_EMAIL.toLowerCase()) {
        return NextResponse.json(
          { success: false, error: "Cannot revoke permissions from the primary Super Admin account." },
          { status: 400 }
        );
      }

      const updated = await prisma.profile.update({
        where: { id: targetProfile.id },
        data: { role: "BUYER" },
      });

      if (isSupabaseConfigured()) {
        try {
          const supabaseAdmin = getSupabaseAdmin();
          await supabaseAdmin.auth.admin.updateUserById(targetProfile.id, {
            user_metadata: { role: "BUYER" },
          });
        } catch {}
      }

      // Log in AdminAuditLog
      await prisma.adminAuditLog.create({
        data: {
          adminId: session.userId,
          adminEmail: session.email,
          action: "ROLE_REVOKE",
          targetType: "USER_ROLE",
          targetId: targetProfile.id,
          details: `Admin privileges revoked for ${targetProfile.email} (demoted to BUYER).`,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Admin access revoked for ${targetProfile.email}.`,
        profile: updated,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    console.error("[ADMIN-TEAM-POST-ERROR]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

