import React from "react";
import { FaLightbulb, FaExclamationTriangle, FaInfoCircle, FaCheck } from "react-icons/fa";

const PRIORITY_CONFIG = {
  high: { icon: FaExclamationTriangle, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  medium: { icon: FaInfoCircle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  low: { icon: FaLightbulb, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

function ImprovementCard(props) {
  const improvement = props.improvement;
  const config = PRIORITY_CONFIG[improvement.priority] || PRIORITY_CONFIG.low;
  const Icon = config.icon;

  return (
    <div className={"card p-4 border-l-4 " + config.border.replace("border-", "border-l-")}>
      <div className="flex items-center gap-2 mb-3">
        <div className={"w-8 h-8 rounded-lg flex items-center justify-center " + config.bg}>
          <Icon size={16} className={config.color} />
        </div>
        <div>
          <h4 className="text-white font-medium text-sm">{improvement.category}</h4>
          <span className={"text-xs capitalize " + config.color}>{improvement.priority} Priority</span>
        </div>
      </div>
      <ul className="space-y-2">
        {improvement.suggestions.map(function (suggestion, index) {
          return (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
              <FaCheck size={12} className="text-brand-400 mt-1 shrink-0" />
              <span>{suggestion}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ImprovementCard;