"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  UploadCloud,
  FileCheck,
  Building2,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Store,
  Layers,
  Image as ImageIcon,
  DollarSign,
  Package,
  Truck,
  Clock,
  Eye,
  Trash2,
  Check,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Building,
} from "lucide-react";
import { maskNic } from "@/lib/supabase";
import { SRI_LANKAN_INSTITUTIONS } from "@/lib/mock-data";
import {
  upsertVerificationProfile,
  subscribeToVerification,
  getStoredVerificationProfiles,
  VerificationItem,
} from "@/lib/verification-store";

export const SRI_LANKAN_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

export const PRODUCT_CATEGORIES = [
  "IoT & Hardware",
  "IT Solutions & Services",
  "AgriTech",
  "Electronics",
  "Health & Wellness",
  "Food & Beverage",
  "EdTech",
  "Environment",
  "Productivity",
];

export const SRI_LANKAN_BANKS = [
  "Commercial Bank of Ceylon",
  "Sampath Bank",
  "Bank of Ceylon (BOC)",
  "Hatton National Bank (HNB)",
  "People's Bank",
  "Nations Trust Bank (NTB)",
  "Seylan Bank",
  "DFCC Bank",
];

export const COURIER_PARTNERS = [
  { id: "domex", name: "Domex Courier Express", note: "Recommended · Islandwide 1-3 Business Days", badge: "API Integrated" },
  { id: "certis", name: "Certis Lanka Courier", note: "Insured High-Value Hardware Deliveries", badge: "Insured" },
  { id: "prompt", name: "Prompt Express Sri Lanka", note: "Standard Islandwide Parcel Coverage", badge: "Standard" },
  { id: "campus_pickup", name: "Campus Lab / Direct Handover", note: "Direct collection from University Innovation Center", badge: "Zero Courier Fee" },
];

interface PrototypeImage {
  id: string;
  name: string;
  size: string;
  url: string;
  isPrimary: boolean;
}

const SAMPLE_PROTOTYPE_PHOTOS: PrototypeImage[] = [
  {
    id: "proto-1",
    name: "iot_control_unit_rev2.jpg",
    size: "2.4 MB",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    isPrimary: true,
  },
  {
    id: "proto-2",
    name: "telemetry_sensor_housing.jpg",
    size: "3.1 MB",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    isPrimary: false,
  },
  {
    id: "proto-3",
    name: "assembled_hardware_enclosure.jpg",
    size: "1.9 MB",
    url: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=800&q=80",
    isPrimary: false,
  },
];

export default function RebuiltSellerOnboardingPage() {
  const router = useRouter();

  // Multi-step progress (1: Verification Type & KYC, 2: Product & Innovation Details, 3: Pricing & Escrow Setup)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Authenticated user
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; full_name: string } | null>(null);

  // -------------------------------------------------------------
  // STEP 1 STATE: Verification Type & Institutional KYC
  // -------------------------------------------------------------
  const [verificationType, setVerificationType] = useState<"student" | "sme">("student");
  const [shopName, setShopName] = useState("");
  const [institution, setInstitution] = useState<string>("University of Moratuwa");
  const [facultyDepartment, setFacultyDepartment] = useState("");
  const [studentRegNumber, setStudentRegNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [brNumber, setBrNumber] = useState("");
  const [divisionalSecretariat, setDivisionalSecretariat] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [district, setDistrict] = useState<string>("Colombo");

  // Document upload state
  const [documentType, setDocumentType] = useState<"student_id" | "enrollment_letter" | "br_certificate">("student_id");
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);

  // -------------------------------------------------------------
  // STEP 2 STATE: Product & Innovation Details
  // -------------------------------------------------------------
  const [productTitle, setProductTitle] = useState("");
  const [productCategory, setProductCategory] = useState("IoT & Hardware");
  const [productDistrict, setProductDistrict] = useState("Colombo");
  const [innovationStory, setInnovationStory] = useState("");
  const [technicalSpecs, setTechnicalSpecs] = useState("");
  const [galleryImages, setGalleryImages] = useState<PrototypeImage[]>([]);

  // -------------------------------------------------------------
  // STEP 3 STATE: Pricing & Escrow Setup
  // -------------------------------------------------------------
  const [unitPrice, setUnitPrice] = useState<string>("58000");
  const [inventoryCount, setInventoryCount] = useState<string>("5");
  const [selectedCourier, setSelectedCourier] = useState<string>("domex");
  const [dispatchDays, setDispatchDays] = useState<string>("2-3 Business Days");
  const [bankName, setBankName] = useState<string>("Commercial Bank of Ceylon");
  const [bankBranch, setBankBranch] = useState<string>("Moratuwa Branch");
  const [bankAccountNo, setBankAccountNo] = useState<string>("8004921948");
  const [bankAccountName, setBankAccountName] = useState<string>("");
  const [acceptEscrowTerms, setAcceptEscrowTerms] = useState<boolean>(true);

  // -------------------------------------------------------------
  // GENERAL STATE & TRACKING
  // -------------------------------------------------------------
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [liveVerificationStatus, setLiveVerificationStatus] = useState<VerificationItem | null>(null);

  // Initialize user
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("innoversity_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCurrentUser(parsed);
          if (parsed.full_name) {
            setBankAccountName(parsed.full_name);
            if (!shopName) {
              setShopName(`${parsed.full_name.split(" ")[0]}'s Innovation Lab`);
            }
          }
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Subscribe to live verification changes so tracking updates in real-time
  useEffect(() => {
    const unsubscribe = subscribeToVerification((profiles) => {
      const userId = currentUser?.id;
      if (userId) {
        const found = profiles.find((p) => p.user_id === userId);
        if (found) setLiveVerificationStatus(found);
      }
    });
    return () => unsubscribe();
  }, [currentUser?.id]);

  // Handle KYC Document file selection
  const handleKycFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setErrorMessage("File exceeds 15MB limit. Please upload a smaller PDF or image.");
        return;
      }
      setDocumentName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setDocumentUrl(result || `https://storage.innoversity.lk/kyc/${file.name}`);
        if (file.type.startsWith("image/")) {
          setDocumentPreview(result);
        } else {
          setDocumentPreview("https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80");
        }
      };
      reader.readAsDataURL(file);
      setErrorMessage(null);
    }
  };

  // Quick preset KYC doc loader
  const handleLoadSampleKycDoc = () => {
    setDocumentName(verificationType === "student" ? "moratuwa_student_enrollment.pdf" : "br_certificate_pv00284.pdf");
    setDocumentUrl("https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80");
    setDocumentPreview("https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80");
    setErrorMessage(null);
  };

  // Step 2 Prototype Image Upload handler
  const handlePrototypeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImgs: PrototypeImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const id = `img-${Date.now()}-${i}`;
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      const objectUrl = URL.createObjectURL(file);

      newImgs.push({
        id,
        name: file.name,
        size: sizeMb,
        url: objectUrl,
        isPrimary: galleryImages.length === 0 && i === 0,
      });
    }

    setGalleryImages((prev) => [...prev, ...newImgs]);
    setErrorMessage(null);
  };

  const handleSetPrimaryImage = (id: string) => {
    setGalleryImages((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      }))
    );
  };

  const handleRemoveImage = (id: string) => {
    setGalleryImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleLoadSampleGallery = () => {
    setGalleryImages(SAMPLE_PROTOTYPE_PHOTOS);
    if (!productTitle) {
      setProductTitle("Smart IoT Automated Poultry Incubator (Telemetry Board Rev 2)");
    }
    if (!innovationStory) {
      setInnovationStory(
        "Designed and fabricated by engineering undergraduates at the University of Moratuwa. This IoT incubator combines precision dual-zone sensors with automated humidity control and SMS alerts for rural Sri Lankan poultry hatcheries."
      );
    }
    if (!technicalSpecs) {
      setTechnicalSpecs("• Dual DHT22 high-precision sensors\n• ESP32 WiFi & GSM fallback telemetry\n• 12V 5A uninterrupted battery backup\n• Islandwide cloud dashboard");
    }
    setErrorMessage(null);
  };

  // -------------------------------------------------------------
  // NAVIGATION & VALIDATION
  // -------------------------------------------------------------
  const validateStep1 = () => {
    if (!shopName.trim()) {
      setErrorMessage("Please enter an Innovation Shop or Business Name.");
      return false;
    }
    if (!nicNumber.trim()) {
      setErrorMessage("Please enter your National Identity Card (NIC) number for zero-leak verification.");
      return false;
    }
    if (verificationType === "student") {
      if (!institution) {
        setErrorMessage("Please select your affiliated Sri Lankan University.");
        return false;
      }
    } else {
      if (!brNumber.trim()) {
        setErrorMessage("Please provide your Business Registration (BR) number.");
        return false;
      }
    }
    if (!documentName && !documentUrl) {
      setErrorMessage("Please upload your institutional verification document or click 'Quick Sample Document'.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const validateStep2 = () => {
    if (!productTitle.trim()) {
      setErrorMessage("Please provide a title for your innovation or prototype.");
      return false;
    }
    if (!innovationStory.trim() || innovationStory.trim().length < 25) {
      setErrorMessage("Please provide an innovation story / problem description (minimum 25 characters).");
      return false;
    }
    if (galleryImages.length === 0) {
      setErrorMessage("Product Images / Prototype Gallery is required! Please upload at least 1 image or click 'Load Prototype Samples'.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const validateStep3 = () => {
    const priceNum = parseFloat(unitPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMessage("Please enter a valid unit price in Sri Lankan Rupees (Rs.).");
      return false;
    }
    if (!acceptEscrowTerms) {
      setErrorMessage("You must accept Innoversity's 7-Day Payment Protection Rules to proceed.");
      return false;
    }
    if (!bankAccountNo.trim() || !bankAccountName.trim()) {
      setErrorMessage("Please provide valid seller payout bank details for payout disbursement.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  // -------------------------------------------------------------
  // SUBMIT ONBOARDING & PRODUCT DETAILS
  // -------------------------------------------------------------
  const handleSubmitAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    setErrorMessage(null);

    const userId = currentUser?.id || `usr-seller-${Date.now()}`;
    const applicantName = currentUser?.full_name || (verificationType === "student" ? "Student Inventor" : "Business Founder");
    const maskedNicValue = maskNic(nicNumber);
    const effectiveDocUrl = documentUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80";

    const institutionOrBusiness =
      verificationType === "student"
        ? institution
        : `BR Verified SME (${businessName.trim() || shopName.trim()} · Reg: ${brNumber.trim()})`;

    const docType =
      verificationType === "student"
        ? documentType === "br_certificate"
          ? "student_id"
          : documentType
        : "br_certificate";

    const productDraft = {
      title: productTitle.trim(),
      category: productCategory,
      district: productDistrict,
      story: innovationStory.trim(),
      technicalSpecs: technicalSpecs.trim(),
      images: galleryImages,
      price: parseFloat(unitPrice) || 58000,
      inventory: parseInt(inventoryCount) || 5,
      courier: selectedCourier,
      dispatchDays,
      bankDetails: {
        bankName,
        branch: bankBranch,
        accountNumber: bankAccountNo,
        accountName: bankAccountName,
      },
      createdAt: new Date().toISOString(),
    };

    const notesSummary =
      verificationType === "student"
        ? `Faculty/Dept: ${facultyDepartment || "Undergraduate"} · Reg: ${studentRegNumber || "N/A"} · Initial Product: ${productTitle}`
        : `BR: ${brNumber} · Div Secretariat: ${divisionalSecretariat || district} · Initial Product: ${productTitle}`;

    const profilePayload = {
      user_id: userId,
      shop_name: shopName.trim(),
      shop_category: productCategory,
      shop_bio: innovationStory.slice(0, 150) + "...",
      applicant_name: applicantName,
      institution_or_business: institutionOrBusiness,
      district,
      nic_number: nicNumber,
      document_url: effectiveDocUrl,
      document_type: docType,
      notes: notesSummary,
    };

    try {
      // 1. Submit KYC to API & Supabase
      const res = await fetch("/api/seller/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilePayload),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to submit verification profile to database.");
      }

      // 2. Trigger automated Verifier Notification Email Pipeline
      try {
        await fetch("/api/notifications/verifier", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicant_name: applicantName,
            shop_name: shopName.trim(),
            institution: institutionOrBusiness,
            document_type: docType,
            user_id: userId,
          }),
        });
      } catch (notifErr) {
        console.warn("Verifier notification trigger logged:", notifErr);
      }

      // 3. Update client verification reactive store
      const updatedProfile = upsertVerificationProfile({
        user_id: userId,
        applicant_name: applicantName,
        applicant_email: currentUser?.email,
        shop_name: shopName.trim(),
        shop_category: productCategory,
        shop_bio: innovationStory.slice(0, 150) + "...",
        institution_or_business: institutionOrBusiness,
        district,
        nic_number: maskedNicValue,
        document_url: effectiveDocUrl,
        document_type: docType,
        verification_status: "pending",
        notes: notesSummary,
        product_draft: productDraft,
      });

      // 4. Save product draft locally to user's pending marketplace catalog
      if (typeof window !== "undefined") {
        try {
          const existingProductsRaw = localStorage.getItem("innoversity_user_products");
          const existingProducts = existingProductsRaw ? JSON.parse(existingProductsRaw) : [];
          existingProducts.unshift({
            id: `prod-${Date.now()}`,
            ...productDraft,
            shopName: shopName.trim(),
            sellerName: applicantName,
            institution: institutionOrBusiness,
            status: "pending_verification",
          });
          localStorage.setItem("innoversity_user_products", JSON.stringify(existingProducts));
        } catch {
          // ignore
        }
      }

      setLiveVerificationStatus(updatedProfile);
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while submitting your onboarding application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] pt-20 pb-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <Link href="/seller/dashboard" className="hover:text-indigo-600 transition-colors font-semibold flex items-center gap-1">
            <ArrowLeft size={13} /> Back to Seller Studio
          </Link>
          <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck size={14} className="text-emerald-600" /> Sri Lanka Institutional Trust Engine
          </span>
        </div>

        {/* ========================================================================= */}
        {/* VIEW A: REAL-TIME VERIFICATION TRACKING & MARKETPLACE LOCKING SCREEN */}
        {/* ========================================================================= */}
        {isSubmitted ? (
          <div className="bg-white rounded-3xl border border-indigo-100 p-6 sm:p-10 shadow-xl space-y-8 animate-fade-in">
            {/* Header & Status Banner */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <Clock size={32} className="animate-pulse" />
              </div>

              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                  {liveVerificationStatus?.verification_status === "admin_approved" || liveVerificationStatus?.verification_status === "approved"
                    ? "✓ Storefront Fully Approved"
                    : liveVerificationStatus?.verification_status === "verifier_approved"
                    ? "Stage 1 Passed · Pending Admin Sign-Off"
                    : "Stage 2: Institutional Verifier Audit In Progress"}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                  {liveVerificationStatus?.verification_status === "admin_approved" || liveVerificationStatus?.verification_status === "approved"
                    ? "🎉 Congratulations! Marketplace Storefront Unlocked"
                    : "KYC Documents & Innovation Draft Queued for Audit"}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
                  Application for <strong className="text-gray-900">{shopName}</strong> has been logged. An automated audit alert was dispatched to accredited verifiers at{" "}
                  <span className="font-bold text-indigo-700">{institution}</span>.
                </p>
              </div>
            </div>

            {/* Real-Time 3-Step Verification Pipeline Stepper */}
            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 space-y-4">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Real-Time Verification Pipeline
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1: Submission */}
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase">Step 1</span>
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">KYC &amp; Product Submitted</h3>
                  <p className="text-[11px] text-gray-500">
                    ID/BR documents securely stored and masked under zero-leak protocols.
                  </p>
                  <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Completed
                  </span>
                </div>

                {/* Step 2: Faculty Verifier Audit */}
                <div
                  className={`p-4 rounded-xl border space-y-2 transition-all ${
                    liveVerificationStatus?.verification_status === "verifier_approved" ||
                    liveVerificationStatus?.verification_status === "admin_approved" ||
                    liveVerificationStatus?.verification_status === "approved"
                      ? "bg-white border-emerald-200 shadow-2xs"
                      : "bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-700 uppercase">Step 2</span>
                    {liveVerificationStatus?.verification_status === "verifier_approved" ||
                    liveVerificationStatus?.verification_status === "admin_approved" ||
                    liveVerificationStatus?.verification_status === "approved" ? (
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold animate-pulse">
                        ⏳
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Faculty / Verifier Review</h3>
                  <p className="text-[11px] text-gray-500">
                    Dean &apos;s verifier review in progress at {institution}.
                  </p>
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                      liveVerificationStatus?.verification_status === "verifier_approved" ||
                      liveVerificationStatus?.verification_status === "admin_approved" ||
                      liveVerificationStatus?.verification_status === "approved"
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-amber-800 bg-amber-100"
                    }`}
                  >
                    {liveVerificationStatus?.verification_status === "verifier_approved" ||
                    liveVerificationStatus?.verification_status === "admin_approved" ||
                    liveVerificationStatus?.verification_status === "approved"
                      ? "Faculty Signed Off"
                      : "Audit In Progress"}
                  </span>
                </div>

                {/* Step 3: Admin Final Approval */}
                <div
                  className={`p-4 rounded-xl border space-y-2 transition-all ${
                    liveVerificationStatus?.verification_status === "admin_approved" ||
                    liveVerificationStatus?.verification_status === "approved"
                      ? "bg-white border-emerald-200 shadow-2xs"
                      : "bg-gray-100/60 border-gray-200 text-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-500 uppercase">Step 3</span>
                    {liveVerificationStatus?.verification_status === "admin_approved" ||
                    liveVerificationStatus?.verification_status === "approved" ? (
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    ) : (
                      <Lock size={15} className="text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Admin Clearance &amp; Unlock</h3>
                  <p className="text-[11px] text-gray-500">
                    Commercial Bank safe payout account activated and marketplace storefront published.
                  </p>
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                      liveVerificationStatus?.verification_status === "admin_approved" ||
                      liveVerificationStatus?.verification_status === "approved"
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-gray-500 bg-gray-200"
                    }`}
                  >
                    {liveVerificationStatus?.verification_status === "admin_approved" ||
                    liveVerificationStatus?.verification_status === "approved"
                      ? "Active Storefront"
                      : "Locked (Awaiting Verifier)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Marketplace Gating & Lock Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
              <Lock size={18} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Marketplace Storefront &amp; Product Listing Locked</strong>
                <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                  In accordance with Innoversity Trust Standards, your product <strong>&quot;{productTitle}&quot;</strong> and your public seller storefront remain locked from public purchasing until Stage 1 (Institutional Verifier) and Stage 2 (Platform Admin) approvals are finalized.
                </p>
              </div>
            </div>

            {/* Application Summary Box */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-xs space-y-2.5">
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Shop / Lab:</span>
                <span className="font-bold text-gray-900">{shopName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Affiliation:</span>
                <span className="font-semibold text-indigo-700">{institution}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Initial Product:</span>
                <span className="font-semibold text-gray-900">{productTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Unit Price &amp; Payment Protection:</span>
                <span className="font-mono font-bold text-emerald-700">Rs. {parseFloat(unitPrice || "0").toLocaleString()} (7-Day Payment Protection)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Zero-Leak Masked NIC:</span>
                <span className="font-mono font-bold text-indigo-700">{maskNic(nicNumber)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Automated Alert Dispatched:</span>
                <span className="font-semibold text-gray-700">auditor.innovations@uom.lk · Just now</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                href="/verifiers"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <Eye size={15} />
                <span>Test Approval in Verifier Portal</span>
                <ExternalLink size={13} />
              </Link>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/seller/dashboard"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs transition-all text-center"
                >
                  Go to Seller Studio
                </Link>
                <Link
                  href="/seller/dashboard/settings"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs transition-all text-center"
                >
                  Shop Settings
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW B: 3-STEP SELLER ONBOARDING & PRODUCT LISTING FORM SEQUENCE           */
          /* ========================================================================= */
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xl space-y-8">
            {/* Header & Step Indicator */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <Store size={26} className="text-indigo-600" />
                    Seller Onboarding &amp; Product Listing
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Step {currentStep} of 3:{" "}
                    {currentStep === 1
                      ? "Verification Type & Institutional KYC"
                      : currentStep === 2
                      ? "Product & Innovation Details"
                      : "Pricing & 7-Day Payment Protection Setup"}
                  </p>
                </div>

                {/* Stepper Pills */}
                <div className="flex items-center gap-2">
                  {[
                    { num: 1, label: "KYC Identity" },
                    { num: 2, label: "Product & Gallery" },
                    { num: 3, label: "Pricing & Safe Pay" },
                  ].map((s) => (
                    <div
                      key={s.num}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        currentStep === s.num
                          ? "bg-indigo-600 text-white shadow-sm ring-4 ring-indigo-100"
                          : currentStep > s.num
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <span>{currentStep > s.num ? "✓" : s.num}</span>
                      <span className="hidden md:inline">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
                <AlertCircle size={18} className="text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 1: VERIFICATION TYPE SELECTION & INSTITUTIONAL KYC       */}
            {/* ------------------------------------------------------------- */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                {/* Intro notice */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-900">
                  <Sparkles size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Step 1: Choose Your Verification Track</strong>
                    <span>
                      Innoversity verifies every creator in Sri Lanka. Choose between accredited University Student status or a registered Business Registration (BR) SME.
                    </span>
                  </div>
                </div>

                {/* Shop / Studio Identity */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Innovation Shop / Studio Brand Name *
                  </label>
                  <div className="relative">
                    <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Moratuwa IoT Dynamics or Lanka Solar Labs"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Your storefront brand name as it will be shown to buyers and on official payment protection receipts.
                  </p>
                </div>

                {/* Verification Track Cards */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Select Verification Track *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Card A: University Student */}
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationType("student");
                        setDocumentType("student_id");
                        if (institution === "BR Verified SMEs") setInstitution("University of Moratuwa");
                      }}
                      className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                        verificationType === "student"
                          ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                          <GraduationCap size={20} />
                        </div>
                        {verificationType === "student" && (
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-black text-gray-900">University Student / Campus Lab</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Accredited undergraduates or postgraduates at Moratuwa, Colombo, Peradeniya, SLIIT, etc. Verified via Student ID or Dean&apos;s Enrollment Letter.
                      </p>
                    </button>

                    {/* Card B: BR Verified SME */}
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationType("sme");
                        setDocumentType("br_certificate");
                        setInstitution("BR Verified SMEs");
                      }}
                      className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                        verificationType === "sme"
                          ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                          <Building2 size={20} />
                        </div>
                        {verificationType === "sme" && (
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-black text-gray-900">BR Verified SME / Startup</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Registered Sri Lankan enterprise or early startup. Verified via Divisional Secretariat Business Registration (BR) Certificate.
                      </p>
                    </button>
                  </div>
                </div>

                {/* DYNAMIC FIELDS: UNIVERSITY STUDENT */}
                {verificationType === "student" ? (
                  <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-4">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap size={15} /> Academic Affiliation Details
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Sri Lankan University / Higher Institute *
                        </label>
                        <select
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                        >
                          {SRI_LANKAN_INSTITUTIONS.filter((i) => i !== "BR Verified SMEs").map((inst) => (
                            <option key={inst} value={inst}>
                              {inst}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Faculty / Academic Department
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Dept of Electronic & Telecom Engineering"
                          value={facultyDepartment}
                          onChange={(e) => setFacultyDepartment(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Student Reg / Index Number *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 21/IT/0482 or EN20489"
                          value={studentRegNumber}
                          onChange={(e) => setStudentRegNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Campus District
                        </label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                        >
                          {SRI_LANKAN_DISTRICTS.map((dist) => (
                            <option key={dist} value={dist}>
                              {dist} District
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* DYNAMIC FIELDS: BR VERIFIED SME */
                  <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-4">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 size={15} /> Business Registration Details
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Registered Business / Entity Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Lanka AgriTech Dynamics (Pvt) Ltd"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          BR Certificate Number *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. PV-00284712 or W/CO/9218"
                          value={brNumber}
                          onChange={(e) => setBrNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Divisional Secretariat / DS Office
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Moratuwa DS Office or Thimbirigasyaya"
                          value={divisionalSecretariat}
                          onChange={(e) => setDivisionalSecretariat(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Registered District
                        </label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                        >
                          {SRI_LANKAN_DISTRICTS.map((dist) => (
                            <option key={dist} value={dist}>
                              {dist} District
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* NIC Number with Zero-Leak Masking */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>
                      {verificationType === "student" ? "Applicant Student NIC Number *" : "Authorized Director / Founder NIC Number *"}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Lock size={10} /> Zero-Leak Masking Engine
                    </span>
                  </label>
                  <div className="relative">
                    <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 200112345678 or 991234567V"
                      value={nicNumber}
                      onChange={(e) => setNicNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                    />
                  </div>
                  {nicNumber && (
                    <div className="mt-1.5 text-xs text-gray-500 flex items-center gap-2">
                      <span>Stored and transmitted safely as:</span>
                      <span className="font-mono font-bold text-indigo-700 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                        {maskNic(nicNumber)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Secure ID / BR Document Upload Dropzone */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {verificationType === "student" ? "Upload Student ID / Enrollment Letter *" : "Upload Official BR Certificate *"}
                    </label>
                    <button
                      type="button"
                      onClick={handleLoadSampleKycDoc}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                    >
                      + Quick Sample Document
                    </button>
                  </div>

                  <div className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl p-6 text-center transition-colors bg-gray-50/50 relative">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleKycFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 shadow-2xs">
                        <UploadCloud size={24} />
                      </div>
                      {documentName ? (
                        <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs bg-indigo-50 px-3.5 py-2 rounded-xl border border-indigo-200">
                          <FileCheck size={16} />
                          <span>{documentName} (Ready for verifier audit)</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs font-bold text-gray-800">
                            Click to upload or drag &amp; drop document proof
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            PDF, PNG, or JPG (max 15MB). Front/back scans of institutional ID or certified BR.
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {documentPreview && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={documentPreview}
                        alt="Doc preview"
                        className="w-14 h-11 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-gray-800 block">Preview Loaded</span>
                        <span className="text-gray-400 text-[11px]">
                          Encrypted before transmission to faculty split-screen audit queue.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 1 Action */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Step 2: Product &amp; Innovation Details</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 2: PRODUCT & INNOVATION DETAILS + PROTOTYPE GALLERY     */}
            {/* ------------------------------------------------------------- */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-900">
                  <Sparkles size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Step 2: Define Your Marketplace Innovation</strong>
                    <span>
                      Describe the invention, hardware prototype, or software solution you want to list on Innoversity. High-resolution gallery images are required for buyer inspection.
                    </span>
                  </div>
                </div>

                {/* Product Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Innovation / Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart IoT Poultry Incubator with Automated Humidity & Temp Telemetry"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                  />
                </div>

                {/* Category & District Origin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Layers size={14} className="text-indigo-600" />
                      Innovation Category *
                    </label>
                    <select
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                    >
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <MapPin size={14} className="text-indigo-600" />
                      District Origin *
                    </label>
                    <select
                      value={productDistrict}
                      onChange={(e) => setProductDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                    >
                      {SRI_LANKAN_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist} District
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Innovation Story / Problem & Solution */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Innovation Story &amp; Local Impact (Minimum 25 characters) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe how this innovation was engineered, the problem it solves for Sri Lankan buyers or businesses, and tests conducted at your campus lab or workshop."
                    value={innovationStory}
                    onChange={(e) => setInnovationStory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-normal focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>Compelling narratives help buyers trust Sri Lankan university inventors.</span>
                    <span>{innovationStory.length} characters</span>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Key Technical Specifications &amp; Components
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Microcontroller: ESP32 dual-core · Sensors: DHT22, soil capacitive probe · Power: 12V DC with solar battery backup · Housing: 3D printed PETG"
                    value={technicalSpecs}
                    onChange={(e) => setTechnicalSpecs(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-normal focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                  />
                </div>

                {/* REQUIRED PRODUCT IMAGES / PROTOTYPE GALLERY */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon size={15} className="text-indigo-600" />
                        Product Images / Prototype Gallery (Required) *
                      </label>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Upload high-resolution photos (PNG/JPG) of the physical prototype, PCB, or software UI.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLoadSampleGallery}
                      className="px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer w-fit"
                    >
                      + Load Prototype Samples
                    </button>
                  </div>

                  {/* Multi-Image Dropzone */}
                  <div className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl p-6 text-center transition-colors bg-gray-50/50 relative">
                    <input
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handlePrototypeImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 shadow-2xs">
                        <UploadCloud size={24} />
                      </div>
                      <p className="text-xs font-bold text-gray-800">
                        Drag and drop multiple prototype photos, or browse files
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        High-resolution PNG, JPG, or WEBP up to 15MB each.
                      </p>
                    </div>
                  </div>

                  {/* Gallery Grid */}
                  {galleryImages.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-gray-600">
                        Uploaded Photos ({galleryImages.length}) · Select Cover Photo
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {galleryImages.map((img) => (
                          <div
                            key={img.id}
                            className={`relative group rounded-2xl border overflow-hidden p-2 bg-white transition-all ${
                              img.isPrimary
                                ? "border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.url}
                              alt={img.name}
                              className="w-full h-28 object-cover rounded-xl"
                            />

                            <div className="mt-2 flex items-center justify-between text-xs">
                              <span className="truncate max-w-[120px] font-medium text-gray-700">
                                {img.name}
                              </span>
                              <span className="text-[10px] text-gray-400">{img.size}</span>
                            </div>

                            <div className="mt-2 flex items-center justify-between pt-2 border-t border-gray-100">
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(img.id)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                                  img.isPrimary
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              >
                                {img.isPrimary ? "★ Primary Cover" : "Set Cover"}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveImage(img.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                                title="Remove photo"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2 Actions */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    ← Back to Step 1
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Step 3: Pricing &amp; Payment Protection Setup</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 3: PRICING & 7-DAY AUTO-RELEASE ESCROW SETUP             */}
            {/* ------------------------------------------------------------- */}
            {currentStep === 3 && (
              <form onSubmit={handleSubmitAll} className="space-y-6 animate-fade-in">
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-900">
                  <Sparkles size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Step 3: Safe Pay Security &amp; Courier Logistics</strong>
                    <span>
                      Configure your item unit pricing and connect your Sri Lankan bank account for payout disbursement. Buyers are protected by our 7-day inspection window.
                    </span>
                  </div>
                </div>

                {/* Unit Price & Inventory */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Unit Selling Price (LKR Rs.) *</span>
                      <span className="text-[10px] text-indigo-600 font-semibold">Zero upfront listing fee</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-xs">
                        Rs.
                      </span>
                      <input
                        type="number"
                        required
                        min="100"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-black focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                      />
                    </div>
                    {unitPrice && (
                      <p className="text-[11px] text-gray-500 mt-1">
                        Formatted: <strong className="text-gray-900 font-mono">Rs. {parseFloat(unitPrice || "0").toLocaleString()}</strong>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Package size={14} className="text-indigo-600" />
                      Ready-to-Ship Inventory / Batch Units *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="500"
                      value={inventoryCount}
                      onChange={(e) => setInventoryCount(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Initial quantity available in your campus lab or studio.
                    </p>
                  </div>
                </div>

                {/* 7-DAY AUTO-RELEASE PAYMENT PROTECTION HIGHLIGHT CARD */}
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className="text-emerald-700" />
                    <h3 className="text-sm font-black text-emerald-950">
                      Innoversity 7-Day Payment Protection Rules
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 space-y-1">
                      <strong className="text-emerald-900 block">1. Safe Holding</strong>
                      <p className="text-[11px] text-gray-600">
                        100% of the buyer&apos;s funds are held in partner bank safe protection upon order placement.
                      </p>
                    </div>

                    <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 space-y-1">
                      <strong className="text-emerald-900 block">2. 7-Day Inspection</strong>
                      <p className="text-[11px] text-gray-600">
                        Starts upon Domex/courier verified delivery. Buyer inspects hardware specs and functionality.
                      </p>
                    </div>

                    <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 space-y-1">
                      <strong className="text-emerald-900 block">3. Auto Payout</strong>
                      <p className="text-[11px] text-gray-600">
                        Funds disburse automatically into your connected bank account on day 7 if no dispute is opened.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-emerald-900 font-semibold cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={acceptEscrowTerms}
                      onChange={(e) => setAcceptEscrowTerms(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 border-gray-300 focus:ring-emerald-500"
                    />
                    <span>I understand and accept Innoversity&apos;s 7-Day Payment Protection Policy.</span>
                  </label>
                </div>

                {/* Seller Payout Bank Details */}
                <div className="p-5 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-4">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Building size={15} className="text-indigo-600" /> Payout Bank Account Details
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Bank Name *
                      </label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                      >
                        {SRI_LANKAN_BANKS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Branch Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Moratuwa Branch"
                        value={bankBranch}
                        onChange={(e) => setBankBranch(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 8004921948"
                        value={bankAccountNo}
                        onChange={(e) => setBankAccountNo(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. K. D. Perera"
                        value={bankAccountName}
                        onChange={(e) => setBankAccountName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Courier & Dispatch Logistics */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Courier Partner &amp; Dispatch Method *
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {COURIER_PARTNERS.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCourier(c.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedCourier === c.id
                            ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-xs font-bold text-gray-900">{c.name}</strong>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                            {c.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500">{c.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 3 Actions */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    ← Back to Step 2
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting KYC &amp; Product to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        <span>Submit for Verification &amp; Marketplace Listing</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
