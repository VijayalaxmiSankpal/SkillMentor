import React from "react";
import { FaCode, FaCheckCircle, FaClock, FaTrophy, FaFire, FaBookmark } from "react-icons/fa";

const STAT_CARDS = [
  {
    key: "total",
    label: "Total Problems",
    icon: FaCode,
    color: "text-brand-400",
    bgColor: "bg-brand-500/10",
    getValue: function (stats) {
      return stats.total;
    },
  },
  {
    key: "solved",
    label: "Solved",
    icon: FaCheckCircle,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    getValue: function (stats) {
      return stats.solved;
    },
  },
  {
    key: "unsolved",
    label: "Unsolved",
    icon: FaCode,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    getValue: function (stats) {
      return stats.unsolved;
    },
  },
  {
    key: "bookmarked",
    label: "Bookmarked",
    icon: FaBookmark,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    getValue: function (stats) {
      return stats.bookmarked;
    },
  },
  {
    key: "time",
    label: "Hours Spent",
    icon: FaClock,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    getValue: function (stats) {
      return Math.round(stats.totalTime / 60 * 10) / 10;
    },
  },
  {
    key: "streak",
    label: "Day Streak",
    icon: FaFire,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    getValue: function (stats) {
      return stats.streak;
    },
  },
];

const DIFFICULTY_BARS = [
  { label: "Easy", key: "easySolved", color: "bg-emerald-500", textColor: "text-emerald-400" },
  { label: "Medium", key: "mediumSolved", color: "bg-amber-500", textColor: "text-amber-400" },
  { label: "Hard", key: "hardSolved", color: "bg-rose-500", textColor: "text-rose-400" },
];

function StatsOverview(props) {
  const stats = props.stats;

  const totalSolved = stats.easySolved + stats.mediumSolved + stats.hardSolved;
  const easyPercent = totalSolved > 0 ? Math.round((stats.easySolved / totalSolved) * 100) : 0;
  const mediumPercent = totalSolved > 0 ? Math.round((stats.mediumSolved / totalSolved) * 100) : 0;
  const hardPercent = totalSolved > 0 ? Math.round((stats.hardSolved / totalSolved) * 100) : 0;

  const percentMap = {
    easySolved: easyPercent,
    mediumSolved: mediumPercent,
    hardSolved: hardPercent,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Stat Cards */}
      <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {STAT_CARDS.map(function (stat) {
          const Icon = stat.icon;
          const value = stat.getValue(stats);
          return (
            <div key={stat.key} className="card p-4 flex items-center gap-4">
              <div className={"w-12 h-12 rounded-xl flex items-center justify-center shrink-0 " + stat.bgColor}>
                <Icon size={22} className={stat.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-gray-400 text-xs">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Difficulty Breakdown */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FaTrophy size={16} className="text-brand-400" />
          <h3 className="text-sm font-semibold text-white">Difficulty Breakdown</h3>
        </div>
        <div className="space-y-4">
          {DIFFICULTY_BARS.map(function (bar) {
            const percent = percentMap[bar.key];
            const count = stats[bar.key];
            return (
              <div key={bar.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-300">{bar.label}</span>
                  <span className={"text-sm font-semibold " + bar.textColor}>{count}</span>
                </div>
                <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden">
                  <div
                    className={"h-full rounded-full transition-all duration-500 " + bar.color}
                    style={{ width: percent + "%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-surface-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Solve Rate</span>
            <span className="text-sm font-semibold text-white">
              {stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0}%
            </span>
          </div>
          <div className="w-full h-2 bg-surface rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{
                width: (stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0) + "%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsOverview;