import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 1. Pending KYC Count
    const pendingKycCount = await prisma.sellerProfile.count({
      where: {
        verificationStatus: { in: ["pending", "verifier_approved"] },
      },
    });

    const approvedKycCount = await prisma.sellerProfile.count({
      where: {
        verificationStatus: { in: ["admin_approved", "approved"] },
      },
    });

    // 2. Pending Innovations Count
    const pendingInnovationsCount = await prisma.product.count({
      where: { status: "pending" },
    });

    const totalActiveProducts = await prisma.product.count({
      where: { status: "active" },
    });

    // 3. Admin Team Count
    const adminTeamCount = await prisma.profile.count({
      where: {
        role: { in: ["SUPER_ADMIN", "ADMIN", "MODERATOR"] },
      },
    });

    // 4. Total Users
    const totalUsers = await prisma.profile.count();

    // 5. Recent Audit Logs (latest 10)
    const recentLogs = await prisma.adminAuditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      stats: {
        pendingKycCount,
        approvedKycCount,
        pendingInnovationsCount,
        totalActiveProducts,
        adminTeamCount,
        totalUsers,
      },
      recentLogs,
      admin: {
        id: session.userId,
        email: session.email,
        role: session.role,
        fullName: session.fullName,
      },
    });
  } catch (err: any) {
    console.error("[ADMIN-STATS-ERROR]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load dashboard statistics." },
      { status: 500 }
    );
  }
}

