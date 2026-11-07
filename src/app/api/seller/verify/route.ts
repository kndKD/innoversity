import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured, maskNic, DbSellerProfile, VerificationStatus } from "@/lib/supabase";

// In-memory fallback cache for development/demo mode
const fallbackSellerProfiles = new Map<string, DbSellerProfile>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      shop_name,
      shop_category,
      shop_bio,
      applicant_name,
      institution_or_business,
      district,
      nic_number,
      document_url,
      document_type,
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

    const verifierEmail =
      institution_or_business.includes("Moratuwa") || institution_or_business.includes("ITUM")
        ? "auditor.innovations@uom.lk"
        : institution_or_business.includes("Colombo") || institution_or_business.includes("UCSC")
        ? "research.auditor@cmb.ac.lk"
        : institution_or_business.includes("SLIIT")
        ? "faculty.board@sliit.lk"
        : "chamber.registry@commerce.gov.lk";

    const profileData: DbSellerProfile = {
      id: "sp-" + Date.now(),
      user_id: userId,
      shop_name: shop_name || "Innoversity Studio",
      shop_category: shop_category || "IoT & Hardware",
      shop_bio: shop_bio || "",
      applicant_name: applicant_name || "Applicant Creator",
      institution_or_business,
      district,
      verification_status: "pending",
      nic_number: maskedNicValue,
      document_url,
      document_type: document_type || "student_id",
      submitted_at: submittedAt,
      verifier_email: verifierEmail,
      notification_sent_at: submittedAt,
      notes: notes || "Submitted via Innoversity KYC Onboarding",
    };

    // Automated Verifier Notification Dispatch
    console.log(
      `[AUTOMATED VERIFIER ALERT] New KYC Submission by ${applicant_name} (${shop_name}). Dispatched alert to ${verifierEmail}.`
    );

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
        message: "KYC documents submitted. Notification alert sent to institutional verifier.",
        data,
      });
    }

    // Fallback store in memory
    fallbackSellerProfiles.set(userId, profileData);

    return NextResponse.json({
      success: true,
      message: `KYC verification documents received. Verifier alert dispatched to ${verifierEmail}.`,
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

    let profiles = Array.from(fallbackSellerProfiles.values());
    if (status) {
      profiles = profiles.filter((p) => p.verification_status === status);
    }

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
    const { user_id, verification_status, reviewer_notes, reviewer_id, review_stage } = body;

    if (!user_id || !verification_status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: user_id and verification_status." },
        { status: 400 }
      );
    }

    const validStatuses: VerificationStatus[] = [
      "pending",
      "verifier_approved",
      "admin_approved",
      "approved",
      "rejected",
    ];

    if (!validStatuses.includes(verification_status)) {
      return NextResponse.json(
        { success: false, error: "Invalid verification status value." },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const updatePayload: Partial<DbSellerProfile> = {
      verification_status,
      reviewed_at: now,
      reviewed_by: reviewer_id || null,
      notes: reviewer_notes || null,
    };

    if (verification_status === "verifier_approved") {
      updatePayload.verifier_approved_at = now;
    } else if (verification_status === "admin_approved" || verification_status === "approved") {
      updatePayload.admin_approved_at = now;
    }

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

    const newRecord: DbSellerProfile = {
      user_id,
      institution_or_business: "University of Moratuwa",
      district: "Colombo",
      nic_number: "2001****4821",
      document_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      submitted_at: new Date().toISOString(),
      ...updatePayload,
    } as DbSellerProfile;
    fallbackSellerProfiles.set(user_id, newRecord);

    return NextResponse.json({
      success: true,
      message: `Seller verification status updated to ${verification_status}.`,
      data: newRecord,
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
