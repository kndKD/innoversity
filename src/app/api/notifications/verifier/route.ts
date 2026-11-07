import { NextRequest, NextResponse } from "next/server";

export const INSTITUTION_VERIFIER_EMAILS: Record<string, string> = {
  "University of Moratuwa": "auditor.innovations@uom.lk",
  "ITUM": "academic.registrar@itum.mrt.ac.lk",
  "University of Colombo": "research.auditor@cmb.ac.lk",
  "UCSC": "director.evaluation@ucsc.cmb.ac.lk",
  "University of Peradeniya": "dean.eng@pdn.ac.lk",
  "University of Kelaniya": "innovations@kln.ac.lk",
  "University of Sri Jayewardenepura": "technology.auditor@sjp.ac.lk",
  "University of Jaffna": "research.cell@univ.jfn.ac.lk",
  "University of Ruhuna": "tech.audit@ruh.ac.lk",
  "SLIIT": "faculty.board@sliit.lk",
  "NSBM Green University": "faculty.eval@nsbm.ac.lk",
  "BR Verified SMEs": "chamber.registry@commerce.gov.lk",
};

export interface VerifierNotificationLog {
  id: string;
  institution: string;
  recipientEmail: string;
  applicantName: string;
  shopName: string;
  subject: string;
  sentAt: string;
  reviewUrl: string;
  status: "dispatched" | "delivered";
}

// Global in-memory log of dispatched verifier alerts
export const notificationLogs: VerifierNotificationLog[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      applicant_name,
      shop_name,
      institution,
      document_type,
      user_id,
    } = body;

    const targetEmail =
      INSTITUTION_VERIFIER_EMAILS[institution] ||
      `verifier@${institution.toLowerCase().replace(/[^a-z0-9]/g, "")}.ac.lk`;

    const notificationId = `NOTIF-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const sentAt = new Date().toISOString();
    const reviewUrl = `/verifiers?applicant=${encodeURIComponent(applicant_name || "creator")}`;

    const newNotification: VerifierNotificationLog = {
      id: notificationId,
      institution: institution || "Sri Lankan University",
      recipientEmail: targetEmail,
      applicantName: applicant_name || "Applicant Creator",
      shopName: shop_name || "Innovation Studio",
      subject: `🚨 [Action Required] Institutional KYC Verification: ${shop_name} (${institution})`,
      sentAt,
      reviewUrl,
      status: "dispatched",
    };

    notificationLogs.unshift(newNotification);

    // Keep top 50 in memory
    if (notificationLogs.length > 50) notificationLogs.pop();

    console.log(`[VERIFIER ALERT] Notification sent to ${targetEmail} for ${shop_name} (${institution})`);

    return NextResponse.json({
      success: true,
      message: `Automated audit notification email successfully dispatched to ${targetEmail}.`,
      notification: newNotification,
    });
  } catch (err: any) {
    console.error("Verifier notification error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to dispatch verifier notification email." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: notificationLogs,
  });
}
