import { Link } from "react-router-dom";
import {
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiLockLine,
} from "react-icons/ri";

const ROLES = [
  { label: "Frontend Developer", color: "brand",  active: true  },
  { label: "Backend Developer",  color: "accent", active: false },
  { label: "Full Stack",         color: "purple", active: false },
  { label: "Data Science",       color: "yellow", active: false },
];

const PHASES = [
  {
    phase: "Phase 1",
    title: "Core Foundations",
    duration: "4 Weeks",
    status: "completed",
    skills: ["HTML & CSS", "JavaScript ES6+", "Git & GitHub"],
  },
  {
    phase: "Phase 2",
    title: "React & Ecosystem",
    duration: "5 Weeks",
    status: "active",
    skills: ["React Fundamentals", "State Management", "React Router"],
  },
  {
    phase: "Phase 3",
    title: "Advanced Frontend",
    duration: "4 Weeks",
    status: "locked",
    skills: ["Performance", "Testing", "TypeScript"],
  },
];

const statusConfig = {
  completed: { icon: RiCheckboxCircleLine, color: "text-accent-400",  bg: "bg-accent-500/10",  border: "border-accent-500/20",  label: "Completed" },
  active:    { icon: RiTimeLine,           color: "text-brand-400",   bg: "bg-brand-500/10",   border: "border-brand-500/30",   label: "In Progress" },
  locked:    { icon: RiLockLine,           color: "text-slate-500",   bg: "bg-white/5",        border: "border-white/10",       label: "Locked"  },
};

const RoadmapPreviewSection = () => (
  <section id="roadmap" className="py-24 px-4 relative">

    <div className="absolute inset-0 -z-10 pointer-events-none">
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-accent-500/6 rounded-full blur-[100px]" />
    </div>

    <div className="max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="text-center mb-12">
        <div className="badge badge-green mx-auto mb-4">Career Roadmaps</div>
        <h2 className="section-title mb-4">
          A Clear Path to Your{" "}
          <span className="text-gradient">Dream Role</span>
        </h2>
        <p className="section-subtitle max-w-2xl mx-auto">
          Choose your target role and get a structured, week-by-week learning
          path with resources, projects, and progress tracking.
        </p>
      </div>

      {/* ── Role Selector Pills ── */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {ROLES.map((role) => (
          <button
            key={role.label}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
              role.active
                ? "bg-brand-500 text-white border-brand-500 shadow-glow-sm"
                : "bg-white/5 text-slate-400 border-white/10 hover:border-brand-500/30 hover:text-white"
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>

      {/* ── Roadmap Phases ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {PHASES.map((phase, i) => {
          const cfg  = statusConfig[phase.status];
          const Icon = cfg.icon;
          const isLocked = phase.status === "locked";

          return (
            <div
              key={phase.phase}
              className={`card p-6 relative overflow-hidden transition-all duration-300 ${
                isLocked ? "opacity-60" : "hover:-translate-y-1 hover:border-brand-500/30"
              }`}
            >
              {/* Phase number accent */}
              <div className="absolute top-4 right-4 font-mono text-5xl font-bold text-white/4 select-none">
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Status badge */}
              <div className={`badge ${cfg.bg} ${cfg.color} ${cfg.border} mb-4`}>
                <Icon className="text-sm" />
                {cfg.label}
              </div>

              <p className="text-xs text-slate-500 font-mono mb-1">{phase.phase}</p>
              <h3 className="font-display text-xl font-bold text-white mb-1">{phase.title}</h3>
              <p className="text-slate-500 text-xs mb-5">
                <RiTimeLine className="inline mr-1" />
                {phase.duration}
              </p>

              {/* Skills */}
              <ul className="flex flex-col gap-2">
                {phase.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2 text-sm text-slate-300">
                    <div className={`w-1.5 h-1.5 rounded-full ${isLocked ? "bg-slate-600" : "bg-brand-400"}`} />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* ── CTA ── */}
      <div className="text-center">
        <Link to="/signup" className="btn-primary px-8 py-3.5 text-base group">
          View Full Roadmap
          <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  </section>
);

export default RoadmapPreviewSection;