import { bootstrapMainAdmin } from "../src/lib/admin-bootstrap";
import { prisma } from "../src/lib/prisma";
import { initialSellerProfiles } from "../src/lib/verification-store";

async function main() {
  console.log("🌱 Starting Innoversity database seed...");

  // 1. Bootstrap Main Super Admin
  const adminResult = await bootstrapMainAdmin();
  console.log(`✓ Main Admin status:`, adminResult);

  // 2. Seed initial SellerProfiles if none exist
  try {
    const existingSellerCount = await prisma.sellerProfile.count();
    if (existingSellerCount === 0) {
      console.log(`Seeding ${initialSellerProfiles.length} initial seller KYC profiles...`);
      for (const item of initialSellerProfiles) {
        await prisma.sellerProfile.upsert({
          where: { userId: item.user_id },
          create: {
            id: item.id || undefined,
            userId: item.user_id,
            shopName: item.shop_name,
            shopCategory: item.shop_category,
            shopBio: item.shop_bio,
            applicantName: item.applicant_name,
            institutionOrBusiness: item.institution_or_business,
            district: item.district,
            verificationStatus: item.verification_status,
            nicNumber: item.nic_number,
            documentUrl: item.document_url,
            documentType: item.document_type || "student_id",
            submittedAt: new Date(item.submitted_at || Date.now()),
            verifierEmail: item.verifier_email,
            notes: item.notes,
          },
          update: {
            applicantName: item.applicant_name,
            verificationStatus: item.verification_status,
          },
        });
      }
      console.log(`✓ Seeded ${initialSellerProfiles.length} seller KYC profiles.`);
    } else {
      console.log(`✓ Database already has ${existingSellerCount} seller KYC profiles.`);
    }
  } catch (err) {
    console.warn("Notice: SellerProfile seed warning (non-fatal):", err);
  }

  // 3. Log initial system seed in AdminAuditLog
  try {
    await prisma.adminAuditLog.create({
      data: {
        adminEmail: "system@innoversity.lk",
        action: "SYSTEM_SEED",
        targetType: "DATABASE",
        targetId: "BOOTSTRAP",
        details: "Database successfully seeded with SUPER_ADMIN and baseline seller KYC queue.",
      },
    });
  } catch (err) {
    console.warn("Audit log notice:", err);
  }

  console.log("🌱 Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

