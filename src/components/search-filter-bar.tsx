"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductCategory } from "@/lib/mock-data";

const ALL_CATEGORIES: { label: string; value: ProductCategory | "All" }[] = [
  { label: "All", value: "All" },
  { label: "💻 IT Solutions & Services", value: "IT Solutions & Services" },
  { label: "🌾 AgriTech", value: "AgriTech" },
  { label: "⚡ Electronics", value: "Electronics" },
  { label: "🫙 Food & Beverage", value: "Food & Beverage" },
  { label: "📓 Productivity", value: "Productivity" },
  { label: "💧 Health & Wellness", value: "Health & Wellness" },
  { label: "🌿 Environment", value: "Environment" },
  { label: "📡 IoT & Hardware", value: "IoT & Hardware" },
  { label: "📚 EdTech", value: "EdTech" },
];

interface SearchFilterBarProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: ProductCategory | "All") => void;
  activeCategory: ProductCategory | "All";
}

export default function SearchFilterBar({
  onSearch,
  onCategoryChange,
  activeCategory,
}: SearchFilterBarProps) {
  const [query, setQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  // Re-check scroll state when active category changes
  useEffect(() => {
    checkScroll();
  }, [activeCategory, checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.max(el.clientWidth * 0.65, 200);
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="relative group max-w-2xl mx-auto w-full"
        role="search"
      >
        <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-2xl px-4 py-3.5 shadow-sm focus-within:border-indigo-500 focus-within:shadow-md focus-within:shadow-indigo-100/50 transition-all duration-200">
          <Search size={18} className="text-gray-400 shrink-0 group-focus-within:text-indigo-500 transition-colors" />
          <input
            id="marketplace-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search innovations, products, or sellers…"
            aria-label="Search innovations"
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            id="search-submit-btn"
            className="shrink-0 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </form>

      {/* Category Filter Pills Wrapper */}
      <div className="relative group/categories">
        {/* Left Gradient Fade */}
        <div
          className={`
            absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none
            bg-gradient-to-r from-[#F8F7FF] via-[#F8F7FF]/90 to-transparent
            transition-opacity duration-200
            ${canScrollLeft ? "opacity-100" : "opacity-0"}
          `}
          aria-hidden="true"
        />

        {/* Left Scroll Button */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className={`
            absolute -left-1 sm:-left-3 top-1/2 -translate-y-1/2 z-20
            w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md
            text-gray-600 hover:text-indigo-600 hover:border-indigo-300 hover:scale-105 active:scale-95
            transition-all duration-200 cursor-pointer
            hidden md:flex items-center justify-center
            ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
          aria-label="Scroll categories left"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Category Pills Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto flex-nowrap scroll-smooth no-scrollbar scrollbar-hide py-1 pl-1 pr-8"
          style={{ WebkitOverflowScrolling: "touch" }}
          role="group"
          aria-label="Filter by category"
        >
          {ALL_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                id={`category-pill-${cat.value.replace(/\s+/g, "-").toLowerCase()}`}
                onClick={() => onCategoryChange(cat.value)}
                className={`
                  shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 whitespace-nowrap
                  ${isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200"
                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
                  }
                `}
                aria-pressed={isActive}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className={`
            absolute -right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-20
            w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md
            text-gray-600 hover:text-indigo-600 hover:border-indigo-300 hover:scale-105 active:scale-95
            transition-all duration-200 cursor-pointer
            hidden md:flex items-center justify-center
            ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
          aria-label="Scroll categories right"
        >
          <ChevronRight size={18} />
        </button>

        {/* Right Gradient Fade */}
        <div
          className={`
            absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none
            bg-gradient-to-l from-[#F8F7FF] via-[#F8F7FF]/90 to-transparent
            transition-opacity duration-200
            ${canScrollRight ? "opacity-100" : "opacity-0"}
          `}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
