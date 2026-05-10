import React, { useState } from "react";
import {
  RiCodeSSlashLine,
  RiServerLine,
  RiLayoutLine,
  RiBarChartLine,
  RiShieldLine,
  RiSmartphoneLine,
} from "react-icons/ri";

const ROLES = [
  { id: "frontend",   label: "Frontend Developer",  icon: RiLayoutLine,      color: "brand"  },
  { id: "backend",    label: "Backend Developer",   icon: RiServerLine,      color: "accent" },
  { id: "fullstack",  label: "Full Stack",          icon: RiCodeSSlashLine,  color: "purple" },
  { id: "datascience",label: "Data Science",        icon: RiBarChartLine,    color: "yellow" },
  { id: "devops",     label: "DevOps Engineer",     icon: RiShieldLine,      color: "pink"   },
  { id: "mobile",     label: "Mobile Developer",    icon: RiSmartphoneLine,  color: "orange" },
];

const BG_MAP = {
  brand:  "bg-brand-500/10",
  accent: "bg-accent-500/10",
  purple: "bg-purple-500/10",
  yellow: "bg-yellow-500/10",
  pink:   "bg-pink-500/10",
  orange: "bg-orange-500/10",
};

const TEXT_MAP = {
  brand:  "text-brand-400",
  accent: "text-accent-400",
  purple: "text-purple-400",
  yellow: "text-yellow-400",
  pink:   "text-pink-400",
  orange: "text-orange-400",
};

const BORDER_ACTIVE_MAP = {
  brand:  "border-brand-500/50",
  accent: "border-accent-500/50",
  purple: "border-purple-500/50",
  yellow: "border-yellow-500/50",
  pink:   "border-pink-500/50",
  orange: "border-orange-500/50",
};

const RoleSelector = function(props) {
  const selected   = props.selected;
  const onSelect   = props.onSelect;

  return (
    <div className="card p-6">
      <h3 className="font-display text-lg font-bold text-white mb-1">
        Choose Your Target Role
      </h3>
      <p className="text-slate-400 text-sm mb-5">
        Select a role to view your personalized learning roadmap
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ROLES.map(function(role) {
          const Icon         = role.icon;
          const isActive     = selected === role.id;
          const bgClass      = BG_MAP[role.color]    || BG_MAP.brand;
          const textClass    = TEXT_MAP[role.color]  || TEXT_MAP.brand;
          const borderActive = BORDER_ACTIVE_MAP[role.color] || BORDER_ACTIVE_MAP.brand;

          const cardClass = isActive
            ? "flex flex-col items-center gap-2 p-4 rounded-2xl border cursor-pointer transition-all duration-200 " + borderActive + " " + bgClass
            : "flex flex-col items-center gap-2 p-4 rounded-2xl border cursor-pointer transition-all duration-200 border-surface-border hover:border-brand-500/30 hover:bg-white/5";

          const iconWrapClass = "w-10 h-10 rounded-xl flex items-center justify-center " + bgClass;
          const iconClass     = "text-xl " + textClass;

          const handleClick = function() { onSelect(role.id); };

          return (
            <div
              key={role.id}
              onClick={handleClick}
              className={cardClass}
            >
              <div className={iconWrapClass}>
                <Icon className={iconClass} />
              </div>
              <span className="text-xs font-semibold text-center text-slate-300 leading-tight">
                {role.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;