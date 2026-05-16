const ProgressBar = ({ label, value, max, color }) => {
  const percent = Math.round((value / max) * 100);

  const colorMap = {
    brand:  "bg-brand-500",
    accent: "bg-accent-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
    pink:   "bg-pink-500",
  };

  const barColor = colorMap[color] || colorMap.brand;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300 font-medium">{label}</span>
        <span className="text-slate-400 text-xs">{value}/{max}</span>
      </div>
      <div className="h-2 bg-surface-border rounded-full overflow-hidden">
        <div
          className={"h-full rounded-full transition-all duration-500 " + barColor}
          style={{ width: percent + "%" }}
        />
      </div>
      <div className="text-xs text-slate-500 text-right">{percent}%</div>
    </div>
  );
};

const ROADMAP_DATA = [
  { label: "HTML & CSS",        value: 12, max: 12, color: "accent" },
  { label: "JavaScript",        value: 18, max: 25, color: "brand"  },
  { label: "React",             value: 8,  max: 20, color: "purple" },
  { label: "Node.js",           value: 3,  max: 15, color: "yellow" },
  { label: "System Design",     value: 2,  max: 10, color: "pink"   },
];

const INTERVIEW_DATA = [
  { label: "DSA",        value: 45,  max: 100, color: "brand"  },
  { label: "DBMS",       value: 20,  max: 40,  color: "accent" },
  { label: "OS",         value: 15,  max: 30,  color: "purple" },
  { label: "Networking", value: 8,   max: 25,  color: "yellow" },
  { label: "HR Topics",  value: 10,  max: 20,  color: "pink"   },
];

const ProgressSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* Roadmap Progress */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Roadmap Progress
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Frontend Developer Path
            </p>
          </div>
          <span className="badge badge-indigo">In Progress</span>
        </div>
        <div className="flex flex-col gap-4">
          {ROADMAP_DATA.map((item) => (
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

      {/* Interview Readiness */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Interview Readiness
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Topic-wise coverage
            </p>
          </div>
          <span className="badge badge-green">45% Ready</span>
        </div>
        <div className="flex flex-col gap-4">
          {INTERVIEW_DATA.map((item) => (
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