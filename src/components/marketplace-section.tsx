"use client";

import { useState, useMemo } from "react";
import { mockProducts } from "@/lib/mock-data";
import type { ProductCategory } from "@/lib/mock-data";
import SearchFilterBar from "@/components/search-filter-bar";
import ProductCard from "@/components/product-card";

export default function MarketplaceSection() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "All">("All");

  const filtered = useMemo(() => {
    return mockProducts.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.storySnippet.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <section
      id="marketplace"
      aria-labelledby="marketplace-heading"
      className="py-20 bg-[#F8F7FF]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold tracking-wide uppercase mb-3">
            Live Marketplace
          </span>
          <h2
            id="marketplace-heading"
            className="text-3xl sm:text-4xl font-black text-gray-900 mb-3"
          >
            Featured Verified Innovations
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Every listing is verified by a Sri Lankan university or registered SME body — before it goes live.
          </p>
        </div>

        {/* Search + filter */}
        <div className="mb-10">
          <SearchFilterBar
            onSearch={setQuery}
            onCategoryChange={setActiveCategory}
            activeCategory={activeCategory}
          />
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <span className="text-5xl">🔍</span>
            <p className="text-gray-600 font-semibold text-lg">No innovations found</p>
            <p className="text-gray-400 text-sm">Try a different search term or category</p>
            <button
              onClick={() => { setQuery(""); setActiveCategory("All"); }}
              className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* View all CTA */}
        {filtered.length > 0 && (
          <div className="text-center mt-12">
            <a
              href="/innovations"
              id="view-all-innovations-btn"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-indigo-200 text-indigo-700 font-semibold text-sm hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200"
            >
              View all innovations →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
