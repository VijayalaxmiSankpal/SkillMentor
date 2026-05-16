import React from "react";

const SKELETON_VARIANTS = {
  text: "h-4 rounded",
  title: "h-6 rounded w-3/4",
  circle: "rounded-full",
  rect: "rounded-xl",
  card: "rounded-xl",
};

function SkeletonLoader(props) {
  const variant = props.variant || "text";
  const width = props.width;
  const height = props.height;
  const className = props.className || "";
  const count = props.count || 1;

  const baseClass = "bg-surface-border animate-pulse";
  const variantClass = SKELETON_VARIANTS[variant] || SKELETON_VARIANTS.text;

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(
      <div
        key={i}
        className={baseClass + " " + variantClass + " " + className}
        style={style}
      />
    );
  }

  if (count === 1) {
    return items[0];
  }

  return <div className="space-y-3">{items}</div>;
}

export default SkeletonLoader;