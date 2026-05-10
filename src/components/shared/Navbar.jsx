import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { RiMenuLine, RiCloseLine, RiBrainLine } from "react-icons/ri";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const goFeatures = () => scrollTo("#features");
  const goAI = () => scrollTo("#ai");
  const goRoadmap = () => scrollTo("#roadmap");
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const headerClass = scrolled
    ? "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-surface/80 backdrop-blur-xl border-b border-surface-border shadow-card"
    : "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent";

  return (
    <header className={headerClass}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow">
              <RiBrainLine className="text-white text-lg" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              Skill<span className="text-gradient">Mentor</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <button onClick={goFeatures} className="btn-ghost text-sm">
              Features
            </button>
            <button onClick={goAI} className="btn-ghost text-sm">
              AI Tools
            </button>
            <button onClick={goRoadmap} className="btn-ghost text-sm">
              Roadmap
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">
              Sign In
            </Link>
            <Link to="/signup" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden btn-ghost p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen
              ? <RiCloseLine className="text-xl" />
              : <RiMenuLine className="text-xl" />
            }
          </button>

        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-surface-border bg-surface/95 backdrop-blur-xl animate-fade-in">
            <div className="px-2 py-4 flex flex-col gap-1">
              <button onClick={goFeatures} className="btn-ghost text-sm justify-start px-4 py-3">
                Features
              </button>
              <button onClick={goAI} className="btn-ghost text-sm justify-start px-4 py-3">
                AI Tools
              </button>
              <button onClick={goRoadmap} className="btn-ghost text-sm justify-start px-4 py-3">
                Roadmap
              </button>
              <div className="border-t border-surface-border mt-2 pt-3 flex flex-col gap-2">
                <Link to="/login" className="btn-ghost justify-center py-3">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary justify-center py-3">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        )}

      </nav>
    </header>
  );
};

export default Navbar;