import React from "react";

function TopicTag(props) {
  const topic = props.topic;

  const TOPIC_COLORS = {
    Arrays: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Strings: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    "Linked List": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Stack: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Queue: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Tree: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Graph: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    "Dynamic Programming": "bg-rose-500/10 text-rose-400 border-rose-500/20",
    Greedy: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "Hash Table": "bg-teal-500/10 text-teal-400 border-teal-500/20",
    Math: "bg-lime-500/10 text-lime-400 border-lime-500/20",
    "Two Pointers": "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };

  const colorClass = TOPIC_COLORS[topic] || "bg-surface text-gray-400 border-surface-border";

  return (
    <span className={"px-2 py-0.5 rounded-md text-xs font-medium border " + colorClass}>
      {topic}
    </span>
  );
}

export default TopicTag;