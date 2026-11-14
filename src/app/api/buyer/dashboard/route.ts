import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Please sign in." },
        { status: 401 }
      );
    }

    // 1. Fetch user's profile from Prisma
    let profile = null;
    try {
      profile = await prisma.profile.findUnique({
        where: { id: user.id },
      });
    } catch (profileErr) {
      console.error("Error reading profile in buyer dashboard API:", profileErr);
    }

    // 2. Fetch user's real orders from PostgreSQL Prisma table
    let orders: any[] = [];
    try {
      orders = await prisma.order.findMany({
        where: { buyerId: user.id },
        include: {
          product: {
            include: {
              seller: {
                select: {
                  fullName: true,
                  district: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (ordersErr) {
      console.error("Error reading orders in buyer dashboard API:", ordersErr);
    }

    // Calculate total in escrow (orders still pending or verified awaiting final inspection)
    const escrowOrders = orders.filter(
      (o) => o.paymentStatus === "pending" || o.paymentStatus === "verified" || o.paymentStatus === "in_escrow"
    );

    const totalInEscrow = escrowOrders.reduce(
      (sum, o) => sum + Number(o.totalAmount || 0),
      0
    );

    const formattedOrders = orders.map((o) => {
      const isCompleted = o.paymentStatus === "completed" || o.paymentStatus === "funds_released";
      const isInEscrow = !isCompleted;

      // Calculate days remaining (7-day window from order creation)
      const createdTime = new Date(o.createdAt).getTime();
      const elapsedDays = Math.floor((Date.now() - createdTime) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, 7 - elapsedDays);

      return {
        id: o.id,
        productTitle: o.product?.title || "Innovation Prototype Order",
        sellerName: o.product?.seller?.fullName || "Verified Campus Creator",
        institution: o.product?.seller?.district || "University Innovation Lab",
        amount: Number(o.totalAmount || 0),
        escrowStatus: isInEscrow ? "in_escrow" : "funds_released",
        deliveryStatus: isCompleted ? "delivered" : "in_inspection",
        trackingNumber: `DX-${o.id.substring(0, 8).toUpperCase()}`,
        courier: "Domex Courier Express",
        daysRemaining,
        orderDate: new Date(o.createdAt).toISOString().split("T")[0],
      };
    });

    const fullName =
      profile?.fullName ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Commercial Buyer";

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        email: user.email,
        fullName,
        role: profile?.role || "BUYER",
      },
      orders: formattedOrders,
      totalInEscrow,
      orderCount: formattedOrders.length,
    });
  } catch (error: any) {
    if (
      error?.digest === "HANGING_PROMISE_REJECTION" ||
      error?.message?.includes("During prerendering")
    ) {
      throw error;
    }
    console.error("GET /api/buyer/dashboard error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load buyer dashboard data." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, orderId } = body;

    if (action === "release_escrow" && orderId) {
      // Ensure order belongs to current buyer
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order || order.buyerId !== user.id) {
        return NextResponse.json(
          { success: false, error: "Order not found or permission denied." },
          { status: 404 }
        );
      }

      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: "completed" },
      });

      return NextResponse.json({
        success: true,
        message: "Escrow funds successfully released to seller.",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("POST /api/buyer/dashboard error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}

