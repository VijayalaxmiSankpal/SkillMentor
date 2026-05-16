import React from "react";
import { FaCalendarCheck, FaCheckCircle, FaStar, FaClock, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";

const STAT_CONFIGS = [
  {
    key: "total",
    label: "Total Interviews",
    icon: FaCalendarCheck,
    color: "text-brand-400",
    bg: "bg-brand-500/10",
    getValue: function (stats) {
      return stats.total;
    },
  },
  {
    key: "completed",
    label: "Completed",
    icon: FaCheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    getValue: function (stats) {
      return stats.completed;
    },
  },
  {
    key: "scheduled",
    label: "Scheduled",
    icon: FaHourglassHalf,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    getValue: function (stats) {
      return stats.scheduled;
    },
  },
  {
    key: "missed",
    label: "Missed",
    icon: FaTimesCircle,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    getValue: function (stats) {
      return stats.missed;
    },
  },
  {
    key: "avgRating",
    label: "Avg Rating",
    icon: FaStar,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    getValue: function (stats) {
      return stats.avgRating;
    },
  },
  {
    key: "totalMinutes",
    label: "Minutes Practiced",
    icon: FaClock,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    getValue: function (stats) {
      return stats.totalMinutes;
    },
  },
];

function StatsCards(props) {
  const stats = props.stats;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {STAT_CONFIGS.map(function (stat) {
        const Icon = stat.icon;
        const value = stat.getValue(stats);
        return (
          <div key={stat.key} className="card p-4 flex items-center gap-3">
            <div className={"w-10 h-10 rounded-xl flex items-center justify-center shrink-0 " + stat.bg}>
              <Icon size={18} className={stat.color} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-gray-400 text-xs">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;