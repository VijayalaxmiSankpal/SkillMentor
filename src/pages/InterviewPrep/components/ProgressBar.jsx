import React from "react";

function ProgressBar(props) {
  const progress = props.progress;
  const color = props.color || "bg-brand-500";
  const height = props.height || "h-2";
  const showLabel = props.showLabel !== false;
  const label = props.label;

  return (
    <div className="w-full">
      {showLabel && label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-300">{label}</span>
          <span className="text-xs text-white font-semibold">{progress}%</span>
        </div>
      )}
      <div className={"w-full bg-surface rounded-full overflow-hidden " + height}>
        <div
          className={"h-full rounded-full transition-all duration-500 " + color}
          style={{ width: progress + "%" }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;