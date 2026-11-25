import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Admin session cleared.",
      redirect: "/admin",
    });

    response.cookies.set(ADMIN_COOKIE_NAME, "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0),
      maxAge: 0,
    });

    return response;
  } catch (err: any) {
    console.error("[API_ERROR] POST /api/admin/auth/logout:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

