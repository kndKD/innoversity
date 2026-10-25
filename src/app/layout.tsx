import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Innoversity — Sri Lanka's Verified Innovation Marketplace",
  description:
    "Buy and sell verified student and SME innovations from across Sri Lanka. Secured by institutional verification, escrow payments, and trusted delivery.",
  keywords: [
    "Sri Lanka innovations",
    "student marketplace",
    "SME products",
    "verified seller",
    "escrow",
    "University of Moratuwa",
    "SLIIT",
  ],
  openGraph: {
    title: "Innoversity — Sri Lanka's Verified Innovation Marketplace",
    description:
      "Sri Lanka's first trust-first marketplace for student and SME innovations.",
    type: "website",
    locale: "en_LK",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-white text-gray-900 font-sans antialiased">
        <Navbar />
        {/* pt-16 offsets the fixed navbar; pb-14 offsets mobile bottom nav */}
        <main className="pt-16 pb-14 md:pb-0">{children}</main>
      </body>
    </html>
  );
}
