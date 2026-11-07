-- ==============================================================================
-- INNOVERSITY — SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Sri Lanka's Verified Innovation Marketplace
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE (Linked with Supabase auth.users)
-- Stores role information ('buyer', 'seller', 'verifier', 'admin') and profile metadata
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'verifier', 'admin')),
  full_name TEXT NOT NULL,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 3. SELLER PROFILES & KYC VERIFICATION TABLE
-- Stores KYC identity verification data for Sri Lankan student inventors & SMEs
CREATE TABLE IF NOT EXISTS public.seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  shop_name TEXT,
  shop_category TEXT,
  shop_bio TEXT,
  applicant_name TEXT,
  institution_or_business TEXT NOT NULL,
  district TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (verification_status IN ('pending', 'verifier_approved', 'admin_approved', 'approved', 'rejected')),
  nic_number TEXT NOT NULL, -- Stored masked for privacy (e.g. 2001****5678 or XXXXXX-XXX-4821)
  document_url TEXT NOT NULL, -- URL to uploaded student ID / BR Certificate
  document_type TEXT, -- 'student_id' | 'enrollment_letter' | 'br_certificate'
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  verifier_approved_at TIMESTAMP WITH TIME ZONE,
  admin_approved_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.users(id),
  verifier_email TEXT,
  notification_sent_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_seller_profiles_status ON public.seller_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_user_id ON public.seller_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_institution ON public.seller_profiles(institution_or_business);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- POLICIES FOR public.users
-- ------------------------------------------------------------------------------

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to insert their own profile during registration
CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow Academic Verifiers and Admins to view all registered users
CREATE POLICY "Verifiers and admins can read all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('verifier', 'admin')
    )
  );

-- ------------------------------------------------------------------------------
-- POLICIES FOR public.seller_profiles
-- ------------------------------------------------------------------------------

-- 1. Sellers can view their own verification record
CREATE POLICY "Sellers can view own verification record"
  ON public.seller_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Sellers can insert their own KYC submission
CREATE POLICY "Sellers can submit own KYC application"
  ON public.seller_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Sellers can update their own profile if it's pending or rejected (resubmission)
CREATE POLICY "Sellers can update pending or rejected KYC"
  ON public.seller_profiles
  FOR UPDATE
  USING (
    auth.uid() = user_id 
    AND verification_status IN ('pending', 'rejected')
  );

-- 4. Academic Verifiers and Admins can view all verification submissions
-- This protects sensitive student documents while enabling accredited faculty review
CREATE POLICY "Verifiers can view all verification submissions"
  ON public.seller_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('verifier', 'admin')
    )
  );

-- 5. Academic Verifiers and Admins can update verification status (Approve / Reject)
CREATE POLICY "Verifiers can update verification status"
  ON public.seller_profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('verifier', 'admin')
    )
  );

-- ------------------------------------------------------------------------------
-- 5. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Innoversity Member'),
    COALESCE(new.raw_user_meta_data->>'role', 'buyer')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = timezone('utc'::text, now());

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 6. STORAGE BUCKET FOR KYC DOCUMENTS
-- ------------------------------------------------------------------------------
-- Note: Run in Supabase SQL editor or storage configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Authenticated users can upload to their own folder
CREATE POLICY "Sellers can upload KYC docs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'kyc-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage Policy: Users can read their own uploaded documents
CREATE POLICY "Sellers can read their own KYC docs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'kyc-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage Policy: Verifiers and Admins can read all KYC documents
CREATE POLICY "Verifiers can view all KYC docs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'kyc-documents'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('verifier', 'admin')
    )
  );

-- ------------------------------------------------------------------------------
-- 7. SEED DATA FOR DEMO & TESTING
-- ------------------------------------------------------------------------------
-- Sample institutions for reference:
-- 'University of Moratuwa', 'ITUM', 'University of Colombo', 'SLIIT', 'BR Verified SMEs'
