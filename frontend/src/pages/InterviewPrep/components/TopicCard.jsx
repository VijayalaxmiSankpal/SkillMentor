import React from "react";

function TopicProgress(props) {
  const topics = props.topics;

  const totalQuestions = topics.reduce(function (sum, t) {
    return sum + t.totalQuestions;
  }, 0);

  const completedQuestions = topics.reduce(function (sum, t) {
    return sum + t.completedQuestions;
  }, 0);

  const progress = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  const topicBars = topics.map(function (topic) {
    const topicProgress = topic.totalQuestions > 0
      ? Math.round((topic.completedQuestions / topic.totalQuestions) * 100)
      : 0;
    return {
      name: topic.name,
      progress: topicProgress,
      completed: topic.completedQuestions,
      total: topic.totalQuestions,
      color: topic.color,
    };
  });

  const COLOR_CLASSES = {
    brand: "bg-brand-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    purple: "bg-purple-500",
    cyan: "bg-cyan-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-base">Topic-wise Progress</h3>
          <p className="text-gray-400 text-xs mt-0.5">
            {completedQuestions} of {totalQuestions} questions completed
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{progress}%</p>
          <p className="text-xs text-gray-400">Overall</p>
        </div>
      </div>

      <div className="w-full h-3 bg-surface rounded-full overflow-hidden mb-5">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-700"
          style={{ width: progress + "%" }}
        />
      </div>

      <div className="space-y-3">
        {topicBars.map(function (bar) {
          const colorClass = COLOR_CLASSES[bar.color] || "bg-gray-500";
          return (
            <div key={bar.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-300 truncate flex-1 mr-2">{bar.name}</span>
                <span className="text-xs text-gray-400 shrink-0">
                  {bar.completed}/{bar.total}
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                <div
                  className={"h-full rounded-full transition-all duration-500 " + colorClass}
                  style={{ width: bar.progress + "%" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TopicProgress;