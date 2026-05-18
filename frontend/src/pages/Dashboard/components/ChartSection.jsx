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

const CustomTooltip = ({
  active,
  payload,
  label,
}) => {
  if (
    active &&
    payload &&
    payload.length
  ) {
    return (
      <div className="card px-3 py-2 text-xs">
        <p className="text-slate-300 font-semibold mb-1">
          {label}
        </p>

        {payload.map((entry, i) => (
          <p
            key={i}
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const ChartSection = ({
  weeklyActivity = [],
  difficulty = {},
}) => {
  const DIFFICULTY_DATA = [
    {
      name: "Easy",
      solved: difficulty.Easy || difficulty.easy || 0,
    },
    {
      name: "Medium",
      solved: difficulty.Medium || difficulty.medium || 0,
    },
    {
      name: "Hard",
      solved: difficulty.Hard || difficulty.hard || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* Weekly Activity */}
      <div className="card p-6 lg:col-span-2">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Weekly Activity
            </h3>

            <p className="text-slate-500 text-xs mt-0.5">
              Problems solved this week
            </p>
          </div>

          <span className="badge badge-indigo">
            Live Data
          </span>

        </div>

        <ResponsiveContainer
          width="100%"
          height={200}
        >
          <AreaChart
            data={weeklyActivity}
          >
            <defs>
              <linearGradient
                id="gradProblems"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#6366f1"
                  stopOpacity={0.3}
                />

                <stop
                  offset="95%"
                  stopColor="#6366f1"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e1e35"
            />

            <XAxis
              dataKey="day"
              tick={{
                fill: "#64748b",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#64748b",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={CustomTooltip}
            />

            <Area
              type="monotone"
              dataKey="solved"
              name="Solved"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#gradProblems)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Difficulty Chart */}
      <div className="card p-6">

        <div className="mb-6">

          <h3 className="font-display text-lg font-bold text-white">
            By Difficulty
          </h3>

          <p className="text-slate-500 text-xs mt-0.5">
            Problems solved
          </p>

        </div>

        <ResponsiveContainer
          width="100%"
          height={200}
        >
          <BarChart
            data={DIFFICULTY_DATA}
            barSize={32}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e1e35"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tick={{
                fill: "#64748b",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#64748b",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={CustomTooltip}
            />

            <Bar
              dataKey="solved"
              name="Solved"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex flex-col gap-2 mt-4">

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Easy
            </span>

            <span className="text-white font-semibold">
              {difficulty.Easy || difficulty.easy || 0}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Medium
            </span>

            <span className="text-white font-semibold">
              {difficulty.Medium || difficulty.medium || 0}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Hard
            </span>

            <span className="text-white font-semibold">
              {difficulty.Hard || difficulty.hard || 0}
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ChartSection;