import React, { useState } from "react";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiLockLine,
} from "react-icons/ri";
import SkillCard from "./SkillCard";

const STATUS_CONFIG = {
  completed: {
    icon:        RiCheckboxCircleLine,
    color:       "text-accent-400",
    bg:          "bg-accent-500/10",
    border:      "border-accent-500/20",
    numberBg:    "bg-accent-500",
    label:       "Completed",
  },
  active: {
    icon:        RiTimeLine,
    color:       "text-brand-400",
    bg:          "bg-brand-500/10",
    border:      "border-brand-500/30",
    numberBg:    "bg-brand-500",
    label:       "In Progress",
  },
  locked: {
    icon:        RiLockLine,
    color:       "text-slate-500",
    bg:          "bg-white/5",
    border:      "border-white/10",
    numberBg:    "bg-slate-700",
    label:       "Locked",
  },
};

const RoadmapPhase = function(props) {
  const number   = props.number;
  const title    = props.title;
  const duration = props.duration;
  const status   = props.status;
  const skills   = props.skills;

  const [open, setOpen] = useState(status === "active");

  const cfg      = STATUS_CONFIG[status] || STATUS_CONFIG.locked;
  const Icon     = cfg.icon;
  const isLocked = status === "locked";

  const toggleOpen = function() {
    if (!isLocked) {
      setOpen(function(prev) { return !prev; });
    }
  };

  const wrapClass    = "card overflow-hidden transition-all duration-200 " + (isLocked ? "opacity-70" : "");
  const headerClass  = "flex items-center gap-4 p-5 " + (isLocked ? "cursor-not-allowed" : "cursor-pointer hover:bg-white/5 transition-colors");
  const numClass     = "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 " + cfg.numberBg;
  const badgeClass   = "badge ml-auto " + cfg.bg + " " + cfg.color + " " + cfg.border;

  return (
    <div className={wrapClass}>

      <div className={headerClass} onClick={toggleOpen}>
        <div className={numClass}>
          {number}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-base font-bold text-white">
              {title}
            </h3>
          </div>
          <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
            <RiTimeLine />
            {duration}
          </p>
        </div>

        <div className={badgeClass}>
          <Icon className="text-xs" />
          {cfg.label}
        </div>

        {!isLocked && (
          <div className="text-slate-400 flex-shrink-0">
            {open
              ? <RiArrowUpSLine className="text-lg" />
              : <RiArrowDownSLine className="text-lg" />
            }
          </div>
        )}
      </div>

      {open && !isLocked && (
        <div className="border-t border-surface-border p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {skills.map(function(skill) {
              return (
                <SkillCard
                  key={skill.name}
                  name={skill.name}
                  status={skill.status}
                  duration={skill.duration}
                  topics={skill.topics}
                  link={skill.link}
                />
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default RoadmapPhase;