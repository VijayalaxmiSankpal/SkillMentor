import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RiBrainLine,
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
  RiMenuFoldLine,
  RiMenuUnfoldLine,
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

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  const sidebarWidth = collapsed ? "w-16" : "w-64";

  return (
    <aside className={"hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0 bg-surface-card border-r border-surface-border transition-all duration-300 " + sidebarWidth}>

      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-surface-border flex-shrink-0">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center shadow-glow-sm">
              <RiBrainLine className="text-white text-sm" />
            </div>
            <span className="font-display font-bold text-white">
              Skill<span className="text-gradient">Mentor</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center shadow-glow-sm mx-auto">
            <RiBrainLine className="text-white text-sm" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={toggleCollapse}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <RiMenuFoldLine className="text-lg" />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon      = item.icon;
          const isActive  = location.pathname === item.path;
          const activeClass = isActive
            ? "bg-brand-500/15 text-white border-brand-500/30"
            : "text-slate-400 hover:text-white hover:bg-white/5 border-transparent";
          const baseClass = "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 w-full ";

          return (
            <Link
              key={item.path}
              to={item.path}
              className={baseClass + activeClass}
              title={collapsed ? item.label : ""}
            >
              <Icon className="text-lg flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-surface-border p-3 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
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
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-150 w-full"
        >
          <RiLogoutBoxLine className="text-lg flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>

        {collapsed && (
          <button
            onClick={toggleCollapse}
            className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all w-full mt-1"
          >
            <RiMenuUnfoldLine className="text-lg" />
          </button>
        )}
      </div>

    </aside>
  );
};

export default Sidebar;