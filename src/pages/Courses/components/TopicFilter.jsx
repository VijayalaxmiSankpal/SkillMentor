import React from "react";

const TOPICS = [
  "All",
  "HTML & CSS",
  "JavaScript",
  "React",
  "Node.js",
  "DSA",
  "System Design",
  "TypeScript",
  "Database",
];

function TopicFilter(props) {
  const selected  = props.selected;
  const onSelect  = props.onSelect;

  return (
    <div className="flex flex-wrap gap-2">
      {TOPICS.map(function(topic) {
        const isActive = selected === topic;
        const btnClass = isActive
          ? "px-4 py-1.5 rounded-xl text-sm font-semibold border bg-brand-500 text-white border-brand-500 shadow-glow-sm transition-all duration-150"
          : "px-4 py-1.5 rounded-xl text-sm font-semibold border bg-white/5 text-slate-400 border-white/10 hover:border-brand-500/30 hover:text-white transition-all duration-150";

        function handleClick() { onSelect(topic); }

        return (
          <button key={topic} onClick={handleClick} className={btnClass}>
            {topic}
          </button>
        );
      })}
    </div>
  );
}

export default TopicFilter;