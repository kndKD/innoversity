import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured, maskNic, DbSellerProfile } from "@/lib/supabase";

// In-memory fallback cache for development/demo mode
const fallbackSellerProfiles = new Map<string, DbSellerProfile>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      institution_or_business,
      district,
      nic_number,
      document_url,
      notes,
    } = body;

    // Validate required fields
    if (!institution_or_business || !district || !nic_number || !document_url) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required KYC fields: institution/business, district, NIC number, and document.",
        },
        { status: 400 }
      );
    }

    const maskedNicValue = maskNic(nic_number);
    const userId = user_id || "demo-seller-" + Math.random().toString(36).substring(2, 8);
    const submittedAt = new Date().toISOString();

    const profileData: DbSellerProfile = {
      user_id: userId,
      institution_or_business,
      district,
      verification_status: "pending",
      nic_number: maskedNicValue,
      document_url,
      submitted_at: submittedAt,
      notes: notes || "Submitted via Innoversity KYC Onboarding",
    };

    if (isSupabaseConfigured()) {
      const supabaseAdmin = getSupabaseAdmin();
      const { data, error } = await supabaseAdmin
        .from("seller_profiles")
        .upsert(
          {
            ...profileData,
          },
          { onConflict: "user_id" }
        )
        .select()
        .single();

      if (error) {
        console.error("Supabase seller_profiles insert error:", error);
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "KYC verification documents submitted successfully for faculty review.",
        data,
      });
    }

    // Fallback store in memory
    fallbackSellerProfiles.set(userId, profileData);

    return NextResponse.json({
      success: true,
      message: "KYC verification documents received (development mode).",
      data: profileData,
      isDemoMode: true,
    });
  } catch (err: any) {
    console.error("Seller verify POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit KYC verification." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    if (isSupabaseConfigured()) {
      const supabaseAdmin = getSupabaseAdmin();
      let query = supabaseAdmin.from("seller_profiles").select("*");

      if (userId) {
        query = query.eq("user_id", userId);
        const { data, error } = await query.single();
        if (error && error.code !== "PGRST116") {
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, data: data || null });
      }

      if (status) {
        query = query.eq("verification_status", status);
      }

      const { data, error } = await query.order("submitted_at", { ascending: false });
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, data: data || [] });
    }

    // Fallback mode
    if (userId) {
      const profile = fallbackSellerProfiles.get(userId) || null;
      return NextResponse.json({ success: true, data: profile, isDemoMode: true });
    }

    const profiles = Array.from(fallbackSellerProfiles.values());
    return NextResponse.json({ success: true, data: profiles, isDemoMode: true });
  } catch (err: any) {
    console.error("Seller verify GET error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to retrieve verification records." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, verification_status, reviewer_notes, reviewer_id } = body;

    if (!user_id || !verification_status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: user_id and verification_status." },
        { status: 400 }
      );
    }

    if (!["pending", "approved", "rejected"].includes(verification_status)) {
      return NextResponse.json(
        { success: false, error: "Invalid verification status value." },
        { status: 400 }
      );
    }

    const updatePayload = {
      verification_status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewer_id || null,
      notes: reviewer_notes || null,
    };

    if (isSupabaseConfigured()) {
      const supabaseAdmin = getSupabaseAdmin();
      const { data, error } = await supabaseAdmin
        .from("seller_profiles")
        .update(updatePayload)
        .eq("user_id", user_id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `Seller verification status updated to ${verification_status}.`,
        data,
      });
    }

    // Fallback mode
    const existing = fallbackSellerProfiles.get(user_id);
    if (existing) {
      const updated = { ...existing, ...updatePayload };
      fallbackSellerProfiles.set(user_id, updated);
      return NextResponse.json({
        success: true,
        message: `Seller verification status updated to ${verification_status} (demo mode).`,
        data: updated,
        isDemoMode: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Status updated in preview.",
      data: { user_id, ...updatePayload },
      isDemoMode: true,
    });
  } catch (err: any) {
    console.error("Seller verify PATCH error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update verification status." },
      { status: 500 }
    );
  }
}
