export const SRI_LANKAN_INSTITUTIONS = [
  "University of Moratuwa",
  "ITUM",
  "University of Colombo",
  "UCSC",
  "University of Peradeniya",
  "University of Kelaniya",
  "University of Sri Jayewardenepura",
  "University of Jaffna",
  "University of Ruhuna",
  "Eastern University",
  "South Eastern University",
  "Rajarata University",
  "Sabaragamuwa University",
  "Wayamba University",
  "Uva Wellassa University",
  "Open University",
  "Gampaha Wickramarachchi University",
  "Vavuniya University",
  "NIBM",
  "SLIATE/ATIs",
  "Ocean University",
  "Technical Colleges",
  "SLIIT",
  "NSBM Green University",
  "BR Verified SMEs",
] as const;

export type VerifierInstitution =
  | (typeof SRI_LANKAN_INSTITUTIONS)[number]
  | "University of Moratuwa (ITUM)"
  | "ITUM (Institute of Technology, University of Moratuwa)"
  | "UCSC (University of Colombo School of Computing)"
  | "Eastern University, Sri Lanka"
  | "South Eastern University of Sri Lanka"
  | "Rajarata University of Sri Lanka"
  | "Sabaragamuwa University of Sri Lanka"
  | "Wayamba University of Sri Lanka"
  | "Open University of Sri Lanka"
  | "Ocean University of Sri Lanka"
  | "SLIATE / ATIs (Advanced Technological Institutes)"
  | "Technical Colleges (DTET Sri Lanka)";

export type ProductCategory =
  | "IT Solutions & Services"
  | "AgriTech"
  | "EdTech"
  | "IoT & Hardware"
  | "Health & Wellness"
  | "Food & Beverage"
  | "Electronics"
  | "Environment"
  | "Productivity";

export type District =
  | "Colombo"
  | "Gampaha"
  | "Kandy"
  | "Matara"
  | "Galle"
  | "Moratuwa"
  | "Jaffna"
  | "Kurunegala"
  | "Anuradhapura"
  | "Badulla"
  | "Batticaloa"
  | "Ratnapura";

export interface ServiceMilestone {
  title: string;
  percentage: number;
  description: string;
}

export interface Product {
  id: string;
  title: string;
  storySnippet: string;
  fullStory: string;
  category: ProductCategory;
  district: District;
  price: number; // in LKR
  verifierInstitution: VerifierInstitution;
  verifiedAt: string; // ISO date
  isEscrowSafe: boolean;
  escrowReleaseDays?: number;
  imageGradient: string; // tailwind gradient classes
  accentColor: string;
  sellerName: string;
  sellerType: "student" | "sme";
  rating: number; // 1-5
  reviewCount: number;
  unitsSold: number;
  tags: string[];
  isFeatured?: boolean;
  isService?: boolean;
  serviceMilestones?: ServiceMilestone[];
  deliveryType?: "digital_milestone" | "physical_shipping";
}

export interface EscrowOrder {
  id: string;
  productTitle: string;
  buyerName: string;
  sellerName: string;
  amount: number; // LKR
  escrowReleaseDays: number;
  status: "pending" | "delivered" | "released" | "disputed";
  createdAt: string;
}

export interface VerifierQueueItem {
  id: string;
  applicantName: string;
  maskedNic: string; // e.g. "XXXXXX-XXX-4821"
  productTitle: string;
  institution: VerifierInstitution;
  submittedAt: string;
  status: "pending" | "under_review" | "approved";
  documentsCount: number;
}

// ─── Mock Products ────────────────────────────────────────────────────────────

export const mockProducts: Product[] = [
  {
    id: "prod-001",
    title: "IoT Paddy Moisture Sensor & Automatic Aerator",
    storySnippet:
      "Built by final-year engineering students from ITUM (University of Moratuwa) after observing post-harvest grain spoilage in Polonnaruwa paddy storage facilities.",
    fullStory:
      "During our third-year field placement in Medirigiriya, we found farmers losing up to 18% of harvested paddy due to undetected moisture spikes in traditional storage barrows. We engineered this dual-probe capacitive sensor with GSM alert telemetry and an auto-actuated solar aerator vent. Field-tested with 40 smallholders over the 2025/2026 Maha season with zero grain loss. All firmware and PCB designs are open for Sri Lankan agricultural cooperatives.",
    category: "AgriTech",
    district: "Moratuwa",
    price: 14800,
    verifierInstitution: "University of Moratuwa (ITUM)",
    verifiedAt: "2026-08-14",
    isEscrowSafe: true,
    escrowReleaseDays: 14,
    imageGradient: "from-emerald-600 via-teal-600 to-cyan-500",
    accentColor: "#059669",
    sellerName: "K. Perera & Team — ITUM",
    sellerType: "student",
    rating: 4.8,
    reviewCount: 29,
    unitsSold: 87,
    tags: ["IoT", "Agriculture", "Paddy", "Hardware", "GSM", "Solar"],
    isFeatured: true,
  },
  {
    id: "prod-002",
    title: "Alba Pure Cinnamon Starter Kit (Export Grade)",
    storySnippet:
      "Authentic Cinnamomum zeylanicum cultivated in Matara, verified by local business registry and agricultural authorities for chemical-free traditional processing.",
    fullStory:
      "Produced by a collective of smallholder cinnamon peelers in Akuressa, Matara. Certified Alba grade (the finest diameter quill, under 6mm) with zero sulphur bleaching. Packaged in nitrogen-flushed pouches with individual batch traceability QR codes linked to the Sri Lanka Export Development Board registration. Direct-from-farmer pricing cuts out Colombo middlemen.",
    category: "Food & Beverage",
    district: "Matara",
    price: 5200,
    verifierInstitution: "BR Verified SMEs",
    verifiedAt: "2026-07-22",
    isEscrowSafe: true,
    escrowReleaseDays: 7,
    imageGradient: "from-amber-600 via-orange-500 to-yellow-400",
    accentColor: "#D97706",
    sellerName: "Matara BR Cinnamon Collective",
    sellerType: "sme",
    rating: 4.9,
    reviewCount: 61,
    unitsSold: 218,
    tags: ["Cinnamon", "Export-Grade", "QR Origin", "Alba"],
    isFeatured: true,
  },
  {
    id: "prod-003",
    title: "SMD Reflow Hotplate Pro",
    storySnippet:
      "A programmable PID-controlled SMD soldering hotplate built for electronics hobbyists and small repair shops — supports T962-compatible thermal profiles at a fraction of the import cost.",
    fullStory:
      "Designed and assembled in Colombo by an electronics engineering student at SLIIT. The hotplate features a 200×200mm aluminium surface, 800W nichrome heating element, PID temperature controller with OLED display, and USB-C firmware updates. Reaches 250°C in under 90 seconds. All components sourced locally and verified by the SLIIT Electronics Innovation Lab.",
    category: "Electronics",
    district: "Colombo",
    price: 28500,
    verifierInstitution: "SLIIT",
    verifiedAt: "2026-09-03",
    isEscrowSafe: true,
    escrowReleaseDays: 21,
    imageGradient: "from-violet-600 via-purple-500 to-indigo-400",
    accentColor: "#4F46E5",
    sellerName: "R. Jayasinghe — SLIIT EEE",
    sellerType: "student",
    rating: 4.6,
    reviewCount: 14,
    unitsSold: 31,
    tags: ["Electronics", "SMD", "PID", "PCB", "Soldering"],
    isFeatured: true,
  },
  {
    id: "prod-004",
    title: "FocusFlow Planner System",
    storySnippet:
      "A research-backed productivity planner designed for Sri Lankan university students, combining time-blocking, Pomodoro tracking, and weekly review templates in a beautifully printed A5 format.",
    fullStory:
      "Created by a Psychology and Management double-major at University of Colombo, FocusFlow is grounded in cognitive load theory and contextualised for local exam cycles. The planner spans one academic semester (24 weeks), includes motivational inserts in Sinhala and English, and ships with a UV-coated hardcover. Over 800 units sold across 12 universities.",
    category: "Productivity",
    district: "Colombo",
    price: 1850,
    verifierInstitution: "University of Colombo",
    verifiedAt: "2026-06-10",
    isEscrowSafe: false,
    imageGradient: "from-rose-600 via-pink-500 to-fuchsia-400",
    accentColor: "#EC4899",
    sellerName: "A. Fernando — UoC Psychology",
    sellerType: "student",
    rating: 4.7,
    reviewCount: 112,
    unitsSold: 834,
    tags: ["Productivity", "Planner", "University", "Stationery"],
    isFeatured: true,
  },
  {
    id: "prod-005",
    title: "AquaGuard Home Water Tester",
    storySnippet:
      "A low-cost multiparameter water quality tester that measures pH, TDS, turbidity, and chlorine — designed for Sri Lankan households affected by CKDu in the dry zone.",
    fullStory:
      "Developed as a final-year project at NSBM Green University's Faculty of Engineering. The device uses electrochemical sensors and a companion Android app (Sinhala UI) to log readings and generate health advisories. Clinically validated against WHO drinking water standards in Anuradhapura District.",
    category: "Health & Wellness",
    district: "Gampaha",
    price: 8750,
    verifierInstitution: "NSBM Green University",
    verifiedAt: "2026-09-18",
    isEscrowSafe: true,
    escrowReleaseDays: 14,
    imageGradient: "from-blue-600 via-sky-500 to-cyan-400",
    accentColor: "#0284C7",
    sellerName: "S. Wickramasinghe — NSBM",
    sellerType: "student",
    rating: 4.5,
    reviewCount: 18,
    unitsSold: 52,
    tags: ["Water Quality", "Health", "IoT", "CKDu", "Android"],
    isFeatured: true,
  },
  {
    id: "prod-006",
    title: "Eco Coir Garden Mat",
    storySnippet:
      "Biodegradable coir-based garden mats woven by rural women's cooperatives in Galle, certified for organic gardening and UV-resistant for 3-season outdoor use.",
    fullStory:
      "This SME product is part of a circular economy initiative certified by BR Verified SMEs. The mats are woven by 40 women from coastal villages near Galle using locally sourced coconut husk fibre. Each mat is tested for tensile strength, biodegradability rate (14 months), and UV resistance. Revenue funds training programmes for the weaver community.",
    category: "Environment",
    district: "Galle",
    price: 3200,
    verifierInstitution: "BR Verified SMEs",
    verifiedAt: "2026-08-05",
    isEscrowSafe: true,
    escrowReleaseDays: 10,
    imageGradient: "from-lime-600 via-green-500 to-emerald-400",
    accentColor: "#65A30D",
    sellerName: "Galle Coir Women's Co-op",
    sellerType: "sme",
    rating: 4.4,
    reviewCount: 37,
    unitsSold: 163,
    tags: ["Coir", "Eco", "Women-Owned", "Biodegradable", "Garden"],
    isFeatured: true,
  },
  {
    id: "prod-007",
    title: "Hybrid Solar Spice Dehydrator",
    storySnippet:
      "Convective solar tunnel dehydrator with micro-controller auxiliary backup heating, engineered by University of Peradeniya Agricultural Engineering faculty.",
    fullStory:
      "Developed by postgraduate researchers at the Faculty of Agriculture, University of Peradeniya. This system reduces post-harvest moisture in cardamom, pepper, and cloves from 80% to 10% in under 18 hours while preserving essential volatile oils. Certified by the Peradeniya Innovation and Agri-Tech Center.",
    category: "AgriTech",
    district: "Kandy",
    price: 38500,
    verifierInstitution: "University of Peradeniya",
    verifiedAt: "2026-09-25",
    isEscrowSafe: true,
    escrowReleaseDays: 14,
    imageGradient: "from-emerald-700 via-green-600 to-teal-500",
    accentColor: "#047857",
    sellerName: "Eng. M. Bandara — UoP AgriTech",
    sellerType: "student",
    rating: 4.9,
    reviewCount: 22,
    unitsSold: 44,
    tags: ["Solar", "Spices", "Dehydrator", "Peradeniya", "Agriculture"],
    isFeatured: true,
  },
  {
    id: "prod-008",
    title: "Palmyrah Leaf Bio-Composite Acoustic Panels",
    storySnippet:
      "Eco-friendly soundproofing tiles manufactured from Northern Province palmyrah waste fibers, researched at University of Jaffna Faculty of Engineering.",
    fullStory:
      "Utilizing abundant agricultural fiber byproducts in Kilinochchi and Jaffna, student researchers at University of Jaffna developed a non-toxic natural resin binding process. The resulting acoustic panels achieve an NRC (Noise Reduction Coefficient) of 0.78, rivaling synthetic fiberglass panels while supporting rural artisan livelihoods.",
    category: "Environment",
    district: "Jaffna",
    price: 4600,
    verifierInstitution: "University of Jaffna",
    verifiedAt: "2026-08-30",
    isEscrowSafe: true,
    escrowReleaseDays: 10,
    imageGradient: "from-teal-600 via-cyan-600 to-blue-500",
    accentColor: "#0D9488",
    sellerName: "T. Sivalingam & Team — UoJ Eng",
    sellerType: "student",
    rating: 4.8,
    reviewCount: 31,
    unitsSold: 95,
    tags: ["Palmyrah", "Bio-Composite", "Acoustics", "Jaffna", "Sustainable"],
    isFeatured: true,
  },
  {
    id: "prod-009",
    title: "Marine Surface Temp & Depth Logger",
    storySnippet:
      "Submersible marine telemetry unit built by Ocean University & University of Ruhuna marine science students for small-scale coastal fishing boats.",
    fullStory:
      "Engineered in Matara and Tangalle by University of Ruhuna & Ocean University undergraduates. The logger logs water column temperature down to 80 meters and syncs with GPS trackpoints upon vessel return, helping coastal artisanal fishermen locate high-yield pelagic fishing grounds safely.",
    category: "IoT & Hardware",
    district: "Matara",
    price: 19500,
    verifierInstitution: "University of Ruhuna",
    verifiedAt: "2026-07-15",
    isEscrowSafe: true,
    escrowReleaseDays: 14,
    imageGradient: "from-blue-700 via-indigo-600 to-cyan-500",
    accentColor: "#1D4ED8",
    sellerName: "DeepLanka Marine — Ruhuna / Ocean Uni",
    sellerType: "student",
    rating: 4.7,
    reviewCount: 19,
    unitsSold: 38,
    tags: ["Marine", "Telemetry", "Fisheries", "Ruhuna", "Ocean Uni"],
    isFeatured: true,
  },
  {
    id: "prod-010",
    title: "Sinhala / Tamil OCR & Smart Invoice Extractor",
    storySnippet:
      "Offline edge-AI document scanner app and hardware dock created by UCSC students for retail merchants and cooperative credit societies.",
    fullStory:
      "Developed by University of Colombo School of Computing (UCSC) undergraduates, this embedded Raspberry Pi dock and cross-platform app accurately transcribes handwritten and printed Sinhala and Tamil invoices into standardized ERP formats without needing cloud APIs.",
    category: "Productivity",
    district: "Colombo",
    price: 16200,
    verifierInstitution: "UCSC",
    verifiedAt: "2026-09-12",
    isEscrowSafe: true,
    escrowReleaseDays: 7,
    imageGradient: "from-purple-600 via-indigo-600 to-pink-500",
    accentColor: "#7C3AED",
    sellerName: "UCSC Neural Lab Spinout",
    sellerType: "student",
    rating: 4.9,
    reviewCount: 47,
    unitsSold: 112,
    tags: ["AI", "OCR", "UCSC", "Sinhala", "Tamil", "Invoicing"],
    isFeatured: true,
  },
  {
    id: "prod-011",
    title: "Precision Micro-Drip Irrigation Solenoid Node",
    storySnippet:
      "Low-voltage agricultural solenoid controller designed by SLIATE / ATI Hardy Ampara engineering technicians for water-stressed vegetable farming.",
    fullStory:
      "Fabricated and verified at the Advanced Technological Institute (ATI) engineering workshops. The node interfaces directly with soil moisture sensors to modulate micro-drip flow automatically, reducing dry zone water consumption by up to 45% during Yala dry spells.",
    category: "AgriTech",
    district: "Kurunegala",
    price: 8900,
    verifierInstitution: "SLIATE/ATIs",
    verifiedAt: "2026-08-19",
    isEscrowSafe: true,
    escrowReleaseDays: 14,
    imageGradient: "from-emerald-600 via-teal-500 to-cyan-600",
    accentColor: "#059669",
    sellerName: "ATI Agri-Tech Technicians",
    sellerType: "student",
    rating: 4.6,
    reviewCount: 15,
    unitsSold: 67,
    tags: ["AgriTech", "Irrigation", "SLIATE", "Hardware", "Water Conservation"],
    isFeatured: true,
  },
  {
    id: "prod-012",
    title: "B2B Enterprise POS & Inventory System Setup",
    storySnippet:
      "Turnkey enterprise cloud POS and multi-warehouse inventory management suite for Sri Lankan wholesale, supermarkets, and pharmacy chains with LKR tax/VAT compliance.",
    fullStory:
      "Developed by enterprise software engineers and alumni from University of Moratuwa & UCSC. Includes multi-branch synchronization, offline-first cashier terminal mode during power/telecom disruptions, automated SMS receipt dispatch, and Sri Lanka Inland Revenue RAMIS-compatible tax invoices. Delivered under strict 2-stage milestone Pay Safely protection: 50% deposit held in protected deposit upon project initiation, 50% balance held until hardware peripheral integration, cashier training, and production sign-off.",
    category: "IT Solutions & Services",
    district: "Colombo",
    price: 85000,
    verifierInstitution: "University of Moratuwa",
    verifiedAt: "2026-09-15",
    isEscrowSafe: true,
    escrowReleaseDays: 7,
    imageGradient: "from-blue-600 via-indigo-600 to-cyan-500",
    accentColor: "#2563EB",
    sellerName: "SyncLanka Enterprise IT Solutions",
    sellerType: "sme",
    rating: 4.9,
    reviewCount: 34,
    unitsSold: 79,
    tags: ["POS", "Inventory", "ERP", "Cloud", "SME", "Moratuwa", "Pay Safely"],
    isFeatured: true,
    isService: true,
    deliveryType: "digital_milestone",
    serviceMilestones: [
      {
        title: "Milestone 1: Database Architecture & Cloud Deployment (50%)",
        percentage: 50,
        description: "Provisioning dedicated cloud database, branch node replication, catalog import, and staging sandbox configuration.",
      },
      {
        title: "Milestone 2: Hardware Peripherals, Staff Training & Final Handover (50%)",
        percentage: 50,
        description: "Thermal receipt printer/barcode scanner pairing, 3-day staff training, UAT signoff, and administrative master key release.",
      },
    ],
  },
  {
    id: "prod-013",
    title: "Full-Stack Custom Web & Mobile App Development Service",
    storySnippet:
      "Production-grade custom web platforms, e-commerce storefronts, and cross-platform mobile apps tailored for Sri Lankan SMEs and startups by verified university creators.",
    fullStory:
      "Tailored for growing Sri Lankan enterprises needing bespoke digital platforms. Built using modern stacks (Next.js, React Native, Node.js, PostgreSQL) with local SMS gateways (Dialog/Mobitel) and Sri Lankan payment processors (PayHere, WEBXPAY, IPG). Features strict 50/50 Pay Safely protection: 50% locked in protected deposit upon project kickoff and design system approval, 50% held until final UAT sign-off and complete GitHub source repository handover.",
    category: "IT Solutions & Services",
    district: "Colombo",
    price: 120000,
    verifierInstitution: "UCSC",
    verifiedAt: "2026-09-28",
    isEscrowSafe: true,
    escrowReleaseDays: 7,
    imageGradient: "from-violet-600 via-purple-600 to-indigo-500",
    accentColor: "#7C3AED",
    sellerName: "DevPulse Digital Studio — UCSC Tech Spinout",
    sellerType: "student",
    rating: 4.8,
    reviewCount: 26,
    unitsSold: 42,
    tags: ["Web Dev", "Mobile App", "React Native", "Next.js", "Custom Software", "UCSC", "Pay Safely"],
    isFeatured: true,
    isService: true,
    deliveryType: "digital_milestone",
    serviceMilestones: [
      {
        title: "Milestone 1: UI/UX Figma Design System & Core REST APIs (50%)",
        percentage: 50,
        description: "Interactive Figma prototype approval, database schema creation, JWT authentication, and core business endpoints deployed on staging.",
      },
      {
        title: "Milestone 2: App Assembly, Payment Gateway Integration & Production Launch (50%)",
        percentage: 50,
        description: "Mobile app store readiness / Web app release, local payment gateway verification, 14-day warranty UAT window, and GitHub repository ownership transfer.",
      },
    ],
  },
];

// ─── Escrow Orders ────────────────────────────────────────────────────────────

export const mockEscrowOrders: EscrowOrder[] = [
  {
    id: "esc-001",
    productTitle: "IoT Paddy Moisture Sensor ×2",
    buyerName: "Lanka Agri Supplies (Pvt) Ltd",
    sellerName: "K. Perera & Team — ITUM",
    amount: 29600,
    escrowReleaseDays: 14,
    status: "pending",
    createdAt: "2026-10-18",
  },
  {
    id: "esc-002",
    productTitle: "SMD Reflow Hotplate Pro",
    buyerName: "Thimal Rodrigo",
    sellerName: "R. Jayasinghe — SLIIT EEE",
    amount: 28500,
    escrowReleaseDays: 21,
    status: "delivered",
    createdAt: "2026-10-10",
  },
  {
    id: "esc-003",
    productTitle: "Alba Pure Cinnamon Starter Kit ×5",
    buyerName: "Spice Route Exports",
    sellerName: "Matara BR Cinnamon Collective",
    amount: 26000,
    escrowReleaseDays: 7,
    status: "released",
    createdAt: "2026-10-01",
  },
  {
    id: "esc-004",
    productTitle: "AquaGuard Home Water Tester",
    buyerName: "Nirosha Herath",
    sellerName: "S. Wickramasinghe — NSBM",
    amount: 8750,
    escrowReleaseDays: 14,
    status: "pending",
    createdAt: "2026-10-22",
  },
  {
    id: "ORD-2026-IT",
    productTitle: "B2B Enterprise POS & Inventory System Setup (Pay Safely)",
    buyerName: "Lanka Retail Chains (Pvt) Ltd",
    sellerName: "SyncLanka Enterprise IT Solutions",
    amount: 85000,
    escrowReleaseDays: 7,
    status: "pending",
    createdAt: "2026-10-24",
  },
];

// ─── Verifier Queue ───────────────────────────────────────────────────────────

export const mockVerifierQueue: VerifierQueueItem[] = [
  {
    id: "vq-001",
    applicantName: "Chamara Dissanayake",
    maskedNic: "XXXXXX-XXX-4821",
    productTitle: "Solar-Powered Water Pump Controller",
    institution: "University of Moratuwa",
    submittedAt: "2026-10-20",
    status: "under_review",
    documentsCount: 7,
  },
  {
    id: "vq-002",
    applicantName: "Dilini Kumarihami",
    maskedNic: "XXXXXX-XXX-9034",
    productTitle: "Herbal Mosquito Repellent Coil (Zero Chemicals)",
    institution: "BR Verified SMEs",
    submittedAt: "2026-10-21",
    status: "pending",
    documentsCount: 4,
  },
  {
    id: "vq-003",
    applicantName: "Ashan Wickramaratne",
    maskedNic: "XXXXXX-XXX-1173",
    productTitle: "Smart Inventory Tag for Small Retailers",
    institution: "SLIIT",
    submittedAt: "2026-10-19",
    status: "under_review",
    documentsCount: 9,
  },
  {
    id: "vq-004",
    applicantName: "Priya Navaratnam",
    maskedNic: "XXXXXX-XXX-6652",
    productTitle: "Butterfly Pea Flower Extract (Medicinal Grade)",
    institution: "University of Colombo",
    submittedAt: "2026-10-17",
    status: "approved",
    documentsCount: 6,
  },
  {
    id: "vq-005",
    applicantName: "Kasun Pathirana",
    maskedNic: "XXXXXX-XXX-3389",
    productTitle: "Bamboo Bicycle Frame — Local Geometry",
    institution: "NSBM Green University",
    submittedAt: "2026-10-15",
    status: "pending",
    documentsCount: 5,
  },
  {
    id: "vq-006",
    applicantName: "Nimesh Alahakoon",
    maskedNic: "XXXXXX-XXX-7712",
    productTitle: "Hybrid Solar Spice Dehydrator",
    institution: "University of Peradeniya",
    submittedAt: "2026-10-22",
    status: "under_review",
    documentsCount: 8,
  },
  {
    id: "vq-007",
    applicantName: "Tharushi De Silva",
    maskedNic: "XXXXXX-XXX-5529",
    productTitle: "Bio-Resin Composite Particle Boards",
    institution: "University of Sri Jayewardenepura",
    submittedAt: "2026-10-23",
    status: "pending",
    documentsCount: 5,
  },
];

// ─── Community Stats ──────────────────────────────────────────────────────────

export const communityStats = {
  verifiedSellers: 1_847,
  productsListed: 4_392,
  escrowOrdersCompleted: 12_563,
  districtsReached: 25,
};
