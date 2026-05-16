<<<<<<< HEAD
import { Link } from "react-router-dom";

const LandingPage = () => (
  <main className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center animate-fade-in">
    <div className="badge badge-indigo mb-2">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 inline-block" />
      Now in Beta
    </div>

    <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
      <span className="text-gradient">SkillMentor</span>{" "}
      <span className="text-white">AI</span>
    </h1>

    <p className="section-subtitle max-w-xl">
      Your intelligent career & interview preparation assistant.
      Build skills, track progress, ace interviews.
    </p>

    <div className="flex gap-4 flex-wrap justify-center">
      <Link to="/signup" className="btn-primary">Get Started Free</Link>
      <Link to="/login"  className="btn-secondary">Sign In</Link>
    </div>
  </main>
=======
import Navbar              from "../../components/shared/Navbar";
import Footer              from "../../components/shared/Footer";
import HeroSection         from "./components/HeroSection";
import FeaturesSection     from "./components/FeaturesSection";
import AIShowcaseSection   from "./components/AIShowcaseSection";
import RoadmapPreviewSection from "./components/RoadmapPreviewSection";
import CTASection          from "./components/CTASection";

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
>>>>>>> feat/notes-ui
);

export default LandingPage;