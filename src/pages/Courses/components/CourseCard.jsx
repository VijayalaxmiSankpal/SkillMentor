import React from "react";
import { RiTimeLine, RiStarLine, RiPlayCircleLine } from "react-icons/ri";

const LEVEL_CLASSES = {
  Beginner:     "badge-green",
  Intermediate: "badge-indigo",
  Advanced:     "badge-slate",
};

function CourseCard(props) {
  const title    = props.title;
  const author   = props.author;
  const duration = props.duration;
  const rating   = props.rating;
  const level    = props.level;
  const lessons  = props.lessons;
  const color    = props.color;
  const onClick  = props.onClick;

  const BG_MAP = {
    brand:  "bg-brand-500/10",
    accent: "bg-accent-500/10",
    purple: "bg-purple-500/10",
    yellow: "bg-yellow-500/10",
  };

  const TEXT_MAP = {
    brand:  "text-brand-400",
    accent: "text-accent-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
  };

  const bgClass   = BG_MAP[color]   || BG_MAP.brand;
  const textClass = TEXT_MAP[color] || TEXT_MAP.brand;
  const badgeClass = "badge " + (LEVEL_CLASSES[level] || "badge-slate");

  return (
    <div
      onClick={onClick}
      className="card p-5 cursor-pointer hover:border-brand-500/30 hover:-translate-y-1 transition-all duration-200"
    >
      <div className={"w-12 h-12 rounded-2xl flex items-center justify-center mb-4 " + bgClass}>
        <RiPlayCircleLine className={"text-2xl " + textClass} />
      </div>

      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className={badgeClass}>{level}</span>
        <span className="text-slate-500 text-xs">{lessons} lessons</span>
      </div>

      <h3 className="font-display font-bold text-white text-base leading-tight mb-1">
        {title}
      </h3>

      <p className="text-slate-400 text-xs mb-4">{author}</p>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <RiTimeLine />
          {duration}
        </span>
        <span className="flex items-center gap-1 text-yellow-400">
          <RiStarLine />
          {rating}
        </span>
      </div>
    </div>
  );
}

export default CourseCard;