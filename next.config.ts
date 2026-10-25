import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/sell", destination: "/list-innovation", permanent: true },
      { source: "/login", destination: "/signin", permanent: true },
      { source: "/dashboard", destination: "/seller/dashboard", permanent: true },
      { source: "/marketplace", destination: "/innovations", permanent: true },
      { source: "/orders", destination: "/orders/ORD-2026-01", permanent: false },
      { source: "/search", destination: "/innovations", permanent: false },
      { source: "/alerts", destination: "/orders/ORD-2026-01", permanent: false },
      { source: "/profile", destination: "/seller/dashboard", permanent: false },
      { source: "/verify", destination: "/info/verification-process", permanent: true },
      { source: "/escrow", destination: "/info/escrow-guide", permanent: true },
      { source: "/pricing", destination: "/info/pricing", permanent: true },
      { source: "/delivery", destination: "/info/delivery-partners", permanent: true },
      { source: "/blog", destination: "/info/blog", permanent: true },
      { source: "/careers", destination: "/info/careers", permanent: true },
      { source: "/help", destination: "/info/help-centre", permanent: true },
      { source: "/contact", destination: "/info/contact-us", permanent: true },
      { source: "/privacy", destination: "/info/privacy-policy", permanent: true },
      { source: "/terms", destination: "/info/terms-of-service", permanent: true },
      { source: "/report", destination: "/info/report-an-issue", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
