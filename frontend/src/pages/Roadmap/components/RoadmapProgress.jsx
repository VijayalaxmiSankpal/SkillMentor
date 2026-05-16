import React from "react";
import { RiTrophyLine, RiTimeLine, RiFireLine } from "react-icons/ri";

const RoadmapProgress = function(props) {
  const completed = props.completed;
  const total     = props.total;
  const weeks     = props.weeks;
  const streak    = props.streak;

  const percent   = Math.round((completed / total) * 100);
  const barStyle  = { width: percent + "%" };

  return (
    <div className="card p-6">
      <h3 className="font-display text-lg font-bold text-white mb-5">
        Your Progress
      </h3>

      <div className="flex flex-col gap-5">

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Overall Completion</span>
            <span className="text-white font-bold text-sm">{percent}%</span>
          </div>
          <div className="h-3 bg-surface-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-700"
              style={barStyle}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-slate-600 text-xs">{completed} skills done</span>
            <span className="text-slate-600 text-xs">{total} total</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
            <RiTrophyLine className="text-brand-400 text-xl" />
            <span className="font-display font-bold text-white text-lg">{completed}</span>
            <span className="text-slate-500 text-xs text-center">Skills Done</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-accent-500/10 border border-accent-500/20">
            <RiTimeLine className="text-accent-400 text-xl" />
            <span className="font-display font-bold text-white text-lg">{weeks}</span>
            <span className="text-slate-500 text-xs text-center">Weeks Left</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <RiFireLine className="text-orange-400 text-xl" />
            <span className="font-display font-bold text-white text-lg">{streak}</span>
            <span className="text-slate-500 text-xs text-center">Day Streak</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RoadmapProgress;