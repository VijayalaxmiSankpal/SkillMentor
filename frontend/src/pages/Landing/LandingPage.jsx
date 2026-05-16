import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import AIShowcaseSection from "./components/AIShowcaseSection";
import RoadmapPreviewSection from "./components/RoadmapPreviewSection";
import CTASection from "./components/CTASection";

const LandingPage = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />

    <main className="flex-1">
      <HeroSection />
      <FeaturesSection />
      <AIShowcaseSection />
      <RoadmapPreviewSection />
      <CTASection />
    </main>

    <Footer />
  </div>
);

export default LandingPage;