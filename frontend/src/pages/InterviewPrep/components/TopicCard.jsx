import React from "react";
import {
  FaCode,
  FaDatabase,
  FaDesktop,
  FaNetworkWired,
  FaSitemap,
  FaCalculator,
  FaUserTie,
} from "react-icons/fa";

const ICONS = {
  dsa: FaCode,
  dbms: FaDatabase,
  os: FaDesktop,
  cn: FaNetworkWired,
  "system-design": FaSitemap,
  aptitude: FaCalculator,
  hr: FaUserTie,
};

const COLOR_CLASSES = {
  brand: "bg-brand-500/10 text-brand-400 border-brand-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

function TopicCard(props) {
  const topic = props.topic || {};
  const Icon = ICONS[topic.id] || FaCode;

  const total = topic.totalQuestions || 0;
  const completed = topic.completedQuestions || 0;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const colorClass =
    COLOR_CLASSES[topic.color] ||
    "bg-gray-500/10 text-gray-400 border-gray-500/20";

  function handleClick() {
    if (props.onClick) {
      props.onClick();
    }
  }

  return (
    <button
      onClick={handleClick}
      className="card p-5 text-left hover:border-brand-500/30 hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div
          className={
            "w-11 h-11 rounded-xl flex items-center justify-center border " +
            colorClass
          }
        >
          <Icon size={20} />
        </div>

        <span className="text-xs text-slate-400">
          {completed}/{total}
        </span>
      </div>

      <h3 className="text-white font-semibold text-base mb-1">
        {topic.name}
      </h3>

      <p className="text-slate-400 text-xs leading-relaxed mb-4">
        {topic.description}
      </p>

      <div className="w-full h-2 bg-surface rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-brand-500 rounded-full transition-all"
          style={{ width: progress + "%" }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Progress</span>
        <span className="text-white font-semibold">{progress}%</span>
      </div>

      {topic.weakAreas && topic.weakAreas.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {topic.weakAreas.slice(0, 2).map((area) => (
            <span
              key={area}
              className="px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs border border-rose-500/20"
            >
              {area}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

export default TopicCard;