import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";

    let whereClause: any = {};
    if (filter === "pending") {
      whereClause = { verificationStatus: { in: ["pending", "verifier_approved"] } };
    } else if (filter === "approved") {
      whereClause = { verificationStatus: { in: ["admin_approved", "approved"] } };
    } else if (filter === "rejected") {
      whereClause = { verificationStatus: "rejected" };
    }

    const profiles = await prisma.sellerProfile.findMany({
      where: whereClause,
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json({ success: true, profiles });
  } catch (err: any) {
    console.error("[ADMIN-KYC-GET-ERROR]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { profileId, action, notes } = body;

    if (!profileId || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid parameters. Required: profileId, action ('approve' | 'reject')" },
        { status: 400 }
      );
    }

    const targetStatus = action === "approve" ? "admin_approved" : "rejected";
    const now = new Date();

    const updated = await prisma.sellerProfile.update({
      where: { id: profileId },
      data: {
        verificationStatus: targetStatus,
        reviewedAt: now,
        reviewedBy: session.email,
        adminApprovedAt: action === "approve" ? now : null,
        notes: notes || (action === "approve" ? "Approved by Innoversity Admin" : "Rejected by Innoversity Admin"),
      },
    });

    // Also update the matching Profile role to SELLER if approved
    if (action === "approve") {
      try {
        await prisma.profile.updateMany({
          where: { id: updated.userId },
          data: { role: "SELLER" },
        });
      } catch (roleErr) {
        console.warn("Notice: could not update Profile role:", roleErr);
      }
    }

    // Write to AdminAuditLog
    await prisma.adminAuditLog.create({
      data: {
        adminId: session.userId,
        adminEmail: session.email,
        action: action === "approve" ? "KYC_APPROVE" : "KYC_REJECT",
        targetType: "SELLER_KYC",
        targetId: profileId,
        details: `Seller ${updated.applicantName || profileId} (${updated.institutionOrBusiness}) status updated to '${targetStatus}'. Notes: ${notes || "None"}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Seller KYC application successfully ${action}d.`,
      profile: updated,
    });
  } catch (err: any) {
    console.error("[ADMIN-KYC-POST-ERROR]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

