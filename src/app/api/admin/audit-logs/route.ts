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
    if (
      err?.digest === "HANGING_PROMISE_REJECTION" ||
      err?.digest === "NEXT_PRERENDER_INTERRUPTED" ||
      err?.message?.includes("bail out of prerendering") ||
      err?.message?.includes("During prerendering")
    ) {
      throw err;
    }
    console.error("[API_ERROR] GET /api/admin/audit-logs:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

