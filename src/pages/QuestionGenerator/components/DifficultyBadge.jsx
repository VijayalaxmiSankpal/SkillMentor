import React from "react";

const DIFFICULTY_STYLES = {
  Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

function DifficultyBadge(props) {
  const difficulty = props.difficulty;
  const styleClass = DIFFICULTY_STYLES[difficulty] || "text-gray-400 bg-gray-500/10 border-gray-500/20";

  return (
    <span className={"px-2 py-0.5 rounded-md text-xs font-medium border " + styleClass}>
      {difficulty}
    </span>
  );
}

export default DifficultyBadge;