import HeroSection from "@/components/hero-section";
import TrustBar from "@/components/trust-bar";
import MarketplaceSection from "@/components/marketplace-section";
import FeaturePillars from "@/components/feature-pillars";
import CommunityStats from "@/components/community-stats";
import CtaBanner from "@/components/cta-banner";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <MarketplaceSection />
      <FeaturePillars />
      <CommunityStats />
      <CtaBanner />
      <Footer />
    </>
  );
}
