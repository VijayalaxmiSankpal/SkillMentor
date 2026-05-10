import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RiBrainLine,
  RiBellLine,
  RiSearchLine,
  RiMenuLine,
  RiCloseLine,
  RiDashboardLine,
  RiRoadMapLine,
  RiVideoLine,
  RiFileTextLine,
  RiCodeSSlashLine,
  RiQuestionLine,
  RiCalendarLine,
  RiRobot2Line,
  RiFileList3Line,
  RiLogoutBoxLine,
} from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard",          path: "/dashboard",          icon: RiDashboardLine  },
  { label: "Career Roadmap",     path: "/roadmap",            icon: RiRoadMapLine    },
  { label: "Courses",            path: "/courses",            icon: RiVideoLine      },
  { label: "Notes",              path: "/notes",              icon: RiFileTextLine   },
  { label: "Coding Tracker",     path: "/coding-tracker",     icon: RiCodeSSlashLine },
  { label: "Interview Prep",     path: "/interview-prep",     icon: RiQuestionLine   },
  { label: "Mock Interview",     path: "/mock-interview",     icon: RiCalendarLine   },
  { label: "AI Mentor",          path: "/ai-mentor",          icon: RiRobot2Line     },
  { label: "Question Generator", path: "/question-generator", icon: RiFileList3Line  },
  { label: "Resume Review",      path: "/resume-review",      icon: RiBrainLine      },
];

const PAGE_TITLES = {
  "/dashboard":          "Dashboard",
  "/roadmap":            "Career Roadmap",
  "/courses":            "Courses",
  "/notes":              "Notes",
  "/coding-tracker":     "Coding Tracker",
  "/interview-prep":     "Interview Prep",
  "/mock-interview":     "Mock Interview",
  "/ai-mentor":          "AI Mentor",
  "/question-generator": "Question Generator",
  "/resume-review":      "Resume Review",
};

const TopNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const pageTitle  = PAGE_TITLES[location.pathname] || "Dashboard";
  const toggleMenu = () => setMobileOpen((prev) => !prev);

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-surface/80 backdrop-blur-xl border-b border-surface-border flex items-center px-4 sm:px-6 gap-4">

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden btn-ghost p-2"
          aria-label="Toggle menu"
        >
          <RiMenuLine className="text-xl" />
        </button>

        {/* Page Title */}
        <div className="flex-1">
          <h1 className="font-display text-lg font-bold text-white">
            {pageTitle}
          </h1>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-surface-card border border-surface-border rounded-xl px-3 py-2 w-56">
          <RiSearchLine className="text-slate-500 text-sm flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative btn-ghost p-2">
          <RiBellLine className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
          <span className="text-brand-300 text-xs font-bold">
            {user && user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </span>
        </div>

      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={toggleMenu}
          />

          {/* Drawer */}
          <div className="relative w-72 bg-surface-card border-r border-surface-border h-full flex flex-col animate-slide-up">

            {/* Drawer Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-surface-border">
              <Link to="/" className="flex items-center gap-2" onClick={toggleMenu}>
                <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
                  <RiBrainLine className="text-white text-sm" />
                </div>
                <span className="font-display font-bold text-white">
                  Skill<span className="text-gradient">Mentor</span>
                </span>
              </Link>
              <button onClick={toggleMenu} className="btn-ghost p-2">
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            {/* Drawer Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon     = item.icon;
                const isActive = location.pathname === item.path;
                const activeClass = isActive
                  ? "bg-brand-500/15 text-white border-brand-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border-transparent";
                const baseClass = "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 w-full ";

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={toggleMenu}
                    className={baseClass + activeClass}
                  >
                    <Icon className="text-lg flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer */}
            <div className="border-t border-surface-border p-3">
              <div className="flex items-center gap-3 px-2 py-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                  <span className="text-brand-300 text-xs font-bold">
                    {user && user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">
                    {user ? user.name : "User"}
                  </p>
                  <p className="text-slate-500 text-xs truncate">
                    {user ? user.email : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
              >
                <RiLogoutBoxLine className="text-lg" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default TopNav;