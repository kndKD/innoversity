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
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

    const logs = await prisma.adminAuditLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, logs });
  } catch (err: any) {
    console.error("[ADMIN-LOGS-GET-ERROR]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

