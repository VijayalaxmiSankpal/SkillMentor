import React from "react";

const FILTER_ALL = "all";

const PLATFORMS = ["LeetCode", "Codeforces", "GeeksforGeeks", "HackerRank", "CodeChef"];

function PlatformFilter(props) {
  const selectedPlatform = props.selectedPlatform;
  const onPlatformChange = props.onPlatformChange;
  const selectedTopic = props.selectedTopic;
  const onTopicChange = props.onTopicChange;
  const topics = props.topics;

  function handlePlatformClick(platform) {
    return function () {
      onPlatformChange(platform);
    };
  }

  function handleTopicClick(topic) {
    return function () {
      onTopicChange(topic);
    };
  }

  const filterLabelClass = "text-xs font-medium text-gray-400 uppercase tracking-wider mb-2";
  const platformBtnBase = "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border";
  const platformBtnActive = "bg-brand-500 text-white border-brand-500";
  const platformBtnInactive = "bg-surface-card text-gray-400 border-surface-border hover:border-gray-500";

  const topicBtnBase = "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border";
  const topicBtnActive = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  const topicBtnInactive = "bg-surface-card text-gray-400 border-surface-border hover:border-gray-500";

  return (
    <div className="space-y-4">
      {/* Platform Filter */}
      <div>
        <p className={filterLabelClass}>Platform</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePlatformClick(FILTER_ALL)}
            className={platformBtnBase + " " + (selectedPlatform === FILTER_ALL ? platformBtnActive : platformBtnInactive)}
          >
            All Platforms
          </button>
          {PLATFORMS.map(function (platform) {
            return (
              <button
                key={platform}
                onClick={handlePlatformClick(platform)}
                className={platformBtnBase + " " + (selectedPlatform === platform ? platformBtnActive : platformBtnInactive)}
              >
                {platform}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic Filter */}
      <div>
        <p className={filterLabelClass}>Topic</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleTopicClick(FILTER_ALL)}
            className={topicBtnBase + " " + (selectedTopic === FILTER_ALL ? topicBtnActive : topicBtnInactive)}
          >
            All Topics
          </button>
          {topics.map(function (topic) {
            return (
              <button
                key={topic}
                onClick={handleTopicClick(topic)}
                className={topicBtnBase + " " + (selectedTopic === topic ? topicBtnActive : topicBtnInactive)}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PlatformFilter;