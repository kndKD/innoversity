"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { mockProducts, SRI_LANKAN_INSTITUTIONS } from "@/lib/mock-data";
import type { ProductCategory, District, VerifierInstitution } from "@/lib/mock-data";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Lock,
  ShieldCheck,
  X,
  ChevronDown,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import ProductCard from "@/components/product-card";

const CATEGORIES: (ProductCategory | "All")[] = [
  "All",
  "IT Solutions & Services",
  "AgriTech",
  "Electronics",
  "Food & Beverage",
  "Productivity",
  "Health & Wellness",
  "Environment",
  "IoT & Hardware",
  "EdTech",
];

const DISTRICTS: (District | "All")[] = [
  "All",
  "Colombo",
  "Gampaha",
  "Kandy",
  "Matara",
  "Galle",
  "Moratuwa",
  "Jaffna",
  "Kurunegala",
];

const INSTITUTIONS: (VerifierInstitution | "All")[] = [
  "All",
  ...SRI_LANKAN_INSTITUTIONS,
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured First" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
];

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 whitespace-nowrap
        ${active
          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200"
          : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
        }`}
    >
      {label}
    </button>
  );
}

function InnovationsCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || searchParams.get("cat") || "All";

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [district, setDistrict] = useState<District | "All">("All");
  const [institution, setInstitution] = useState<VerifierInstitution | "All">("All");
  const [escrowOnly, setEscrowOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      // Find matching category case-insensitively
      const match = CATEGORIES.find(
        (c) => c.toLowerCase() === initialCategory.toLowerCase()
      );
      if (match) {
        setCategory(match);
      }
    }
  }, [initialCategory]);

  const results = useMemo(() => {
    let list = [...mockProducts];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.storySnippet.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (district !== "All") list = list.filter((p) => p.district === district);
    if (institution !== "All") {
      list = list.filter((p) => {
        if (p.verifierInstitution === institution) return true;
        if (institution === "University of Moratuwa" && p.verifierInstitution.includes("Moratuwa")) return true;
        if (institution === "ITUM" && p.verifierInstitution.includes("ITUM")) return true;
        if (institution === "University of Colombo" && p.verifierInstitution.includes("Colombo")) return true;
        if (institution === "UCSC" && (p.verifierInstitution.includes("UCSC") || p.verifierInstitution.includes("Colombo School of Computing"))) return true;
        return false;
      });
    }
    if (escrowOnly) list = list.filter((p) => p.isEscrowSafe);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "featured") list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    return list;
  }, [query, category, district, institution, escrowOnly, sort]);

  const clearAll = () => {
    setQuery("");
    setCategory("All");
    setDistrict("All");
    setInstitution("All");
    setEscrowOnly(false);
    setSort("featured");
  };

  const hasFilters =
    query || category !== "All" || district !== "All" ||
    institution !== "All" || escrowOnly;

  return (
    <div className="min-h-screen bg-[#F8F7FF] pb-24 pt-20">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-600">
                Verified Catalog
              </span>
              <h1 className="mt-1 text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Explore Innovations
              </h1>
              <p className="mt-1.5 text-sm text-gray-500 max-w-xl">
                Browse verified products built by Sri Lankan university students and verified SMEs.
                Protected by Pay Safely (Safe Holding Protection).
              </p>
            </div>
            <Link
              href="/list-innovation"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all shrink-0"
            >
              + List Innovation
            </Link>
          </div>

          {/* Search and control bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search innovations, universities, keywords (e.g. IoT, Cinnamon)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`lg:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all
                  ${hasFilters
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                    : "border-gray-200 text-gray-700 bg-white"
                  }`}
              >
                <Filter size={15} />
                Filters
                {hasFilters && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <FilterChip
                key={cat}
                label={cat}
                active={category === cat}
                onClick={() => setCategory(cat)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main body: Sidebar + Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside
            className={`
              lg:block bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-6
              ${sidebarOpen ? "block" : "hidden"}
            `}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <SlidersHorizontal size={15} /> Filters
              </span>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* University / Institution */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  University / Institution
                </p>
                {institution !== "All" && (
                  <button
                    onClick={() => setInstitution("All")}
                    className="text-[11px] text-indigo-600 font-semibold hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* University/Institution Filter Dropdown */}
              <div className="relative mb-2.5">
                <select
                  id="institution-filter-dropdown"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value as any)}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                >
                  {INSTITUTIONS.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst === "All" ? "🎓 All Institutions" : inst}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* Quick Select Scroll List */}
              <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
                {INSTITUTIONS.map((inst) => (
                  <button
                    key={inst}
                    onClick={() => setInstitution(inst)}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between
                      ${institution === inst
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <span className="truncate">{inst}</span>
                    {institution === inst && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* District */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                District Origin
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {DISTRICTS.map((dist) => (
                  <button
                    key={dist}
                    onClick={() => setDistrict(dist)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center border transition-all
                      ${district === dist
                        ? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-sm"
                        : "border-gray-200 text-gray-600 hover:border-indigo-300"
                      }`}
                  >
                    {dist}
                  </button>
                ))}
              </div>
            </div>

            {/* Safe Holding toggle */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
                  <ShieldCheck size={14} className="text-emerald-600" /> Pay Safely Protected Only
                </span>
                <input
                  type="checkbox"
                  checked={escrowOnly}
                  onChange={(e) => setEscrowOnly(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="lg:col-span-3">
            {/* Header info */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs text-gray-500 font-medium">
                Showing <strong className="text-gray-900">{results.length}</strong> verified innovations
                {category !== "All" && <span> in <span className="text-indigo-600 font-semibold">{category}</span></span>}
              </p>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Empty state */}
            {results.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center flex flex-col items-center gap-4 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl">
                  🔍
                </div>
                <h3 className="font-bold text-gray-900 text-lg">No innovations found</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  We couldn&rsquo;t find any innovations matching your current filter criteria.
                </p>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function InnovationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-gray-400">Loading catalog...</div>}>
      <InnovationsCatalog />
    </Suspense>
  );
}
