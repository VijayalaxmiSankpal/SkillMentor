import React from "react";
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

const STATUS_CONFIG = {
  good: { icon: FaCheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", bar: "bg-emerald-500" },
  warning: { icon: FaExclamationTriangle, color: "text-amber-400", bg: "bg-amber-500/10", bar: "bg-amber-500" },
  error: { icon: FaTimesCircle, color: "text-rose-400", bg: "bg-rose-500/10", bar: "bg-rose-500" },
};

function SectionAnalysis(props) {
  const sections = props.sections;

  return (
    <div className="card p-5">
      <h3 className="text-white font-semibold text-base mb-4">Section Analysis</h3>
      <div className="space-y-4">
        {sections.map(function (section) {
          const config = STATUS_CONFIG[section.status] || STATUS_CONFIG.good;
          const Icon = config.icon;

          return (
            <div key={section.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={14} className={config.color} />
                  <span className="text-sm text-white font-medium">{section.name}</span>
                </div>
                <span className={"text-sm font-bold " + config.color}>{section.score}%</span>
              </div>
              <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className={"h-full rounded-full transition-all duration-500 " + config.bar}
                  style={{ width: section.score + "%" }}
                />
              </div>
              <p className="text-gray-400 text-xs">{section.feedback}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SectionAnalysis;