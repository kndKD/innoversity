"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
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

      {/* Category Filter Pills */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
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
    </div>
  );
}
