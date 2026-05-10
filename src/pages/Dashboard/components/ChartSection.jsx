import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const ACTIVITY_DATA = [
  { day: "Mon", problems: 4, notes: 2 },
  { day: "Tue", problems: 7, notes: 1 },
  { day: "Wed", problems: 3, notes: 4 },
  { day: "Thu", problems: 9, notes: 2 },
  { day: "Fri", problems: 5, notes: 3 },
  { day: "Sat", problems: 12, notes: 5 },
  { day: "Sun", problems: 6, notes: 2 },
];

const DIFFICULTY_DATA = [
  { name: "Easy",   solved: 42 },
  { name: "Medium", solved: 28 },
  { name: "Hard",   solved: 11 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card px-3 py-2 text-xs">
        <p className="text-slate-300 font-semibold mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* Weekly Activity — Area Chart */}
      <div className="card p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Weekly Activity
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Problems solved and notes taken
            </p>
          </div>
          <span className="badge badge-indigo">This Week</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={ACTIVITY_DATA}>
            <defs>
              <linearGradient id="gradProblems" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="gradNotes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e35" />
            <XAxis
              dataKey="day"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={CustomTooltip} />
            <Area
              type="monotone"
              dataKey="problems"
              name="Problems"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#gradProblems)"
            />
            <Area
              type="monotone"
              dataKey="notes"
              name="Notes"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#gradNotes)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Difficulty Breakdown — Bar Chart */}
      <div className="card p-6">
        <div className="mb-6">
          <h3 className="font-display text-lg font-bold text-white">
            By Difficulty
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Problems solved
          </p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={DIFFICULTY_DATA} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e35" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={CustomTooltip} />
            <Bar
              dataKey="solved"
              name="Solved"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-500" />
              <span className="text-slate-400">Easy</span>
            </div>
            <span className="text-slate-300 font-semibold">42</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-slate-400">Medium</span>
            </div>
            <span className="text-slate-300 font-semibold">28</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-slate-400">Hard</span>
            </div>
            <span className="text-slate-300 font-semibold">11</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChartSection;