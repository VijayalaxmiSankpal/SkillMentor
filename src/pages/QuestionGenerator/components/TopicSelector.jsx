import React from "react";

function TopicSelector(props) {
  const topics = props.availableTopics;
  const selectedTopics = props.selectedTopics;

  function handleToggle(topic) {
    return function () {
      props.onTopicToggle(topic)();
    };
  }

  if (topics.length === 0) {
    return (
      <div className="card p-5">
        <h3 className="text-white font-semibold text-sm mb-2">Select Topics</h3>
        <p className="text-gray-500 text-xs">Select a role first to see available topics</p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">Select Topics</h3>
        <span className="text-gray-500 text-xs">{selectedTopics.length} selected</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map(function (topic) {
          const isSelected = selectedTopics.includes(topic);
          const btnClass = isSelected
            ? "bg-brand-500 text-white border-brand-500"
            : "bg-surface text-gray-400 border-surface-border hover:border-gray-500 hover:text-gray-300";

          return (
            <button
              key={topic}
              onClick={handleToggle(topic)}
              className={"px-3 py-1.5 rounded-lg text-xs font-medium border transition-all " + btnClass}
            >
              {topic}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TopicSelector;