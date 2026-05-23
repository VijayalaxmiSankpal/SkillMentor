import React from "react";
import { FaExclamationTriangle, FaArrowRight } from "react-icons/fa";

function WeakTopics(props) {
  const topics = props.topics || [];

  if (topics.length === 0) {
    return null;
  }

  return (
    <div className="card p-5 border-l-4 border-l-amber-500">
      <div className="flex items-center gap-2 mb-3">
        <FaExclamationTriangle size={16} className="text-amber-400" />
        <h3 className="text-white font-semibold text-sm">Focus Areas - Topics Below 50% Progress</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map(function (topic) {
          const progress = topic.totalQuestions > 0
            ? Math.round((topic.completedQuestions / topic.totalQuestions) * 100)
            : 0;

          function handleClick() {
            props.onTopicClick(topic.id)();
          }

          return (
            <button
              key={topic.id}
              onClick={handleClick}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all"
            >
              {topic.name}
              <span className="text-amber-500/70">{progress}%</span>
              <FaArrowRight size={10} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WeakTopics;