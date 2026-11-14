import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const MAIN_ADMIN_EMAIL = "innoversity98@gmail.com";
export const MAIN_ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || "Admin@Innoversity2026!";

/**
 * Ensures that the Main Admin (innoversity98@gmail.com) exists with role SUPER_ADMIN
 * in both Supabase Auth and the Prisma PostgreSQL `profiles` table.
 */
export async function bootstrapMainAdmin(): Promise<{
  success: boolean;
  userId: string;
  email: string;
  role: string;
  message: string;
}> {
  const cleanEmail = MAIN_ADMIN_EMAIL.toLowerCase();
  console.log(`[BOOTSTRAP-ADMIN] Checking Super Admin status for ${cleanEmail}...`);

  let userId: string = "";

  // 1. Check or Create in Supabase Auth
  if (isSupabaseConfigured()) {
    try {
      const supabaseAdmin = getSupabaseAdmin();
      const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

      if (!listError && listData?.users) {
        const existingAuthUser = listData.users.find(
          (u) => u.email?.toLowerCase() === cleanEmail
        );

        if (existingAuthUser) {
          userId = existingAuthUser.id;
          console.log(`[BOOTSTRAP-ADMIN] Found existing Supabase Auth user: ${userId}`);

          // Ensure user metadata role is SUPER_ADMIN
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            email_confirm: true,
            user_metadata: {
              role: "SUPER_ADMIN",
              full_name: "Innoversity Super Admin",
            },
          });
        }
      }

      // If user doesn't exist in Supabase Auth, create them
      if (!userId) {
        console.log(`[BOOTSTRAP-ADMIN] Creating Super Admin in Supabase Auth...`);
        const { data: createData, error: createError } =
          await supabaseAdmin.auth.admin.createUser({
            email: cleanEmail,
            password: MAIN_ADMIN_DEFAULT_PASSWORD,
            email_confirm: true,
            user_metadata: {
              role: "SUPER_ADMIN",
              full_name: "Innoversity Super Admin",
            },
          });

        if (createData?.user) {
          userId = createData.user.id;
          console.log(`[BOOTSTRAP-ADMIN] ✓ Super Admin created in Supabase Auth: ${userId}`);
        } else if (createError) {
          console.warn("[BOOTSTRAP-ADMIN] Supabase createUser notice:", createError.message);
        }
      }
    } catch (authErr) {
      console.warn("[BOOTSTRAP-ADMIN] Supabase admin call failed, proceeding to database upsert:", authErr);
    }
  }

  // Fallback UUID if Supabase was not configured or offline
  if (!userId) {
    // Check if profile already exists in DB to reuse its ID
    try {
      const existingDbProfile = await prisma.profile.findFirst({
        where: { email: cleanEmail },
      });
      if (existingDbProfile) {
        userId = existingDbProfile.id;
      }
    } catch (e) {
      console.warn("[BOOTSTRAP-ADMIN] DB profile lookup failed:", e);
    }
  }

  if (!userId) {
    userId = crypto.randomUUID();
  }

  // 2. Upsert in PostgreSQL Prisma `profiles` table
  try {
    const profile = await prisma.profile.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: cleanEmail,
        fullName: "Innoversity Super Admin",
        role: "SUPER_ADMIN",
      },
      update: {
        email: cleanEmail,
        fullName: "Innoversity Super Admin",
        role: "SUPER_ADMIN",
      },
    });

    console.log(`[BOOTSTRAP-ADMIN] ✓ Super Admin record ensured in Prisma: ID ${profile.id}, role: ${profile.role}`);

    return {
      success: true,
      userId: profile.id,
      email: cleanEmail,
      role: profile.role,
      message: "Super Admin bootstrapped successfully.",
    };
  } catch (dbErr: any) {
    console.error("[BOOTSTRAP-ADMIN] Prisma profile upsert error:", dbErr);
    return {
      success: false,
      userId,
      email: cleanEmail,
      role: "SUPER_ADMIN",
      message: dbErr.message || "Failed to upsert Super Admin profile.",
    };
  }
}

