import { RiCodeSSlashLine } from "react-icons/ri";

const ActivityFeed = ({ activities = [] }) => {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg font-bold text-white">
          Recent Activity
        </h3>

        <button className="text-brand-400 hover:text-brand-300 text-xs font-semibold transition-colors">
          Live
        </button>
      </div>

      {activities.length === 0 ? (
        <p className="text-slate-500 text-sm">
          No recent activity yet.
        </p>
      ) : (
        <div className="flex flex-col">
          {activities.map((item, i) => {
            const isLast = i === activities.length - 1;

            const lineClass = isLast
              ? "hidden"
              : "absolute left-5 top-10 w-px h-full bg-surface-border";

            return (
              <div key={item.id || i} className="relative flex gap-4 pb-5">
                <div className={lineClass} />

                <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center z-10 bg-brand-500/10">
                  <RiCodeSSlashLine className="text-base text-brand-400" />
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-slate-200 text-sm font-medium truncate">
                    Solved {item.title}
                  </p>

                  <p className="text-slate-500 text-xs mt-0.5">
                    {item.platform} — {item.difficulty}
                  </p>
                </div>

                <div className="text-slate-600 text-xs pt-1 flex-shrink-0">
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;