import {
  RiCodeSSlashLine,
  RiFileTextLine,
  RiRobot2Line,
  RiRoadMapLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";

const ACTIVITIES = [
  {
    icon:  RiCodeSSlashLine,
    color: "text-brand-400",
    bg:    "bg-brand-500/10",
    title: "Solved Two Sum",
    desc:  "LeetCode — Easy",
    time:  "2 hours ago",
  },
  {
    icon:  RiFileTextLine,
    color: "text-yellow-400",
    bg:    "bg-yellow-500/10",
    title: "Created note: React Hooks",
    desc:  "Personal Notes",
    time:  "4 hours ago",
  },
  {
    icon:  RiRobot2Line,
    color: "text-purple-400",
    bg:    "bg-purple-500/10",
    title: "AI Mentor Session",
    desc:  "System Design Discussion",
    time:  "Yesterday",
  },
  {
    icon:  RiRoadMapLine,
    color: "text-accent-400",
    bg:    "bg-accent-500/10",
    title: "Completed Phase 1",
    desc:  "Frontend Roadmap",
    time:  "2 days ago",
  },
  {
    icon:  RiCheckboxCircleLine,
    color: "text-pink-400",
    bg:    "bg-pink-500/10",
    title: "Mock Interview Done",
    desc:  "Score: 82/100",
    time:  "3 days ago",
  },
];

const ActivityFeed = () => {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg font-bold text-white">
          Recent Activity
        </h3>
        <button className="text-brand-400 hover:text-brand-300 text-xs font-semibold transition-colors">
          View All
        </button>
      </div>

      <div className="flex flex-col">
        {ACTIVITIES.map((item, i) => {
          const Icon      = item.icon;
          const isLast    = i === ACTIVITIES.length - 1;
          const lineClass = isLast
            ? "hidden"
            : "absolute left-5 top-10 w-px h-full bg-surface-border";

          return (
            <div key={i} className="relative flex gap-4 pb-5">
              <div className={lineClass} />
              <div className={"w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center z-10 " + item.bg}>
                <Icon className={"text-base " + item.color} />
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-slate-200 text-sm font-medium truncate">
                  {item.title}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">
                  {item.desc}
                </p>
              </div>
              <div className="text-slate-600 text-xs pt-1 flex-shrink-0">
                {item.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;