const ProgressBar = ({ label, value, max, color }) => {
  const safeMax = max > 0 ? max : 1;
  const percent = Math.min(100, Math.round((value / safeMax) * 100));

  const colorMap = {
    brand: "bg-brand-500",
    accent: "bg-accent-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
    pink: "bg-pink-500",
    emerald: "bg-emerald-500",
  };

  const barColor = colorMap[color] || colorMap.brand;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300 font-medium truncate pr-3">
          {label}
        </span>

        <span className="text-slate-400 text-xs shrink-0">
          {value}/{max}
        </span>
      </div>

      <div className="h-2 bg-surface-border rounded-full overflow-hidden">
        <div
          className={
            "h-full rounded-full transition-all duration-500 " + barColor
          }
          style={{ width: percent + "%" }}
        />
      </div>

      <div className="text-xs text-slate-500 text-right">
        {percent}%
      </div>
    </div>
  );
};

const EMPTY_ROADMAP = [
  {
    label: "No roadmap data yet",
    value: 0,
    max: 1,
    color: "brand",
  },
];

const EMPTY_INTERVIEW = [
  {
    label: "No interview prep yet",
    value: 0,
    max: 1,
    color: "accent",
  },
];

const EMPTY_COURSES = [
  {
    label: "No course progress yet",
    value: 0,
    max: 1,
    color: "purple",
  },
];

const ProgressSection = ({ stats = {} }) => {
  const roadmapData =
    stats.roadmapBars && stats.roadmapBars.length > 0
      ? stats.roadmapBars
      : EMPTY_ROADMAP;

  const interviewData =
    stats.interviewReadiness && stats.interviewReadiness.length > 0
      ? stats.interviewReadiness
      : EMPTY_INTERVIEW;

  const courseData =
    stats.courseProgress && stats.courseProgress.length > 0
      ? stats.courseProgress
      : EMPTY_COURSES;

  const readinessPercent =
    interviewData.length > 0
      ? Math.round(
          interviewData.reduce((sum, item) => {
            return sum + (item.value / Math.max(item.max, 1)) * 100;
          }, 0) / interviewData.length
        )
      : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Roadmap Progress
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Real milestone completion
            </p>
          </div>

          <span className="badge badge-indigo">
            {stats.roadmapProgress || 0}% Done
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {roadmapData.map((item) => (
            <ProgressBar
              key={item.label}
              label={item.label}
              value={item.value}
              max={item.max}
              color={item.color}
            />
          ))}
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Interview Readiness
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Based on Interview Prep confidence
            </p>
          </div>

          <span className="badge badge-green">
            {readinessPercent}% Ready
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {interviewData.map((item) => (
            <ProgressBar
              key={item.label}
              label={item.label}
              value={item.value}
              max={item.max}
              color={item.color}
            />
          ))}
        </div>
      </div>

      <div className="card p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Course Progress
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Real enrolled course completion
            </p>
          </div>

          <span className="badge badge-indigo">
            Live Courses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courseData.map((item) => (
            <ProgressBar
              key={item.label}
              label={item.label}
              value={item.value}
              max={item.max}
              color={item.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;