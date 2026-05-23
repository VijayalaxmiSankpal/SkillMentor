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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
];

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
  byPlatform = {},
  topTopics = [],
}) => {
  const DIFFICULTY_DATA = [
    {
      name: "Easy",
      solved:
        difficulty.Easy ||
        difficulty.easy ||
        0,
    },
    {
      name: "Medium",
      solved:
        difficulty.Medium ||
        difficulty.medium ||
        0,
    },
    {
      name: "Hard",
      solved:
        difficulty.Hard ||
        difficulty.hard ||
        0,
    },
  ];

  const PLATFORM_DATA =
    Object.entries(byPlatform).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">

      {/* Weekly Activity */}
      <div className="card p-6 xl:col-span-2">

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
          height={220}
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

      {/* Difficulty */}
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
          height={220}
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
      </div>

      {/* Platforms */}
      <div className="card p-6">

        <div className="mb-6">
          <h3 className="font-display text-lg font-bold text-white">
            Platforms
          </h3>

          <p className="text-slate-500 text-xs mt-0.5">
            Practice distribution
          </p>
        </div>

        <ResponsiveContainer
          width="100%"
          height={220}
        >
          <PieChart>

            <Pie
              data={PLATFORM_DATA}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
            >
              {PLATFORM_DATA.map(
                (entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>

      </div>

      {/* Top Topics */}
      <div className="card p-6 xl:col-span-4">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Top Practiced Topics
            </h3>

            <p className="text-slate-500 text-xs mt-0.5">
              Most solved categories
            </p>
          </div>

          <span className="badge badge-indigo">
            Analytics
          </span>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

          {topTopics.length === 0 ? (
            <div className="text-slate-500 text-sm">
              No topic data yet
            </div>
          ) : (
            topTopics.map(
              (topic, index) => (
                <div
                  key={topic.topic}
                  className="card p-4 border border-surface-border"
                >

                  <div className="flex items-center justify-between mb-2">

                    <span className="text-white font-medium text-sm">
                      {topic.topic}
                    </span>

                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background:
                          COLORS[
                            index %
                              COLORS.length
                          ],
                      }}
                    />

                  </div>

                  <p className="text-slate-400 text-xs">
                    {topic.count} solved
                  </p>

                </div>
              )
            )
          )}

        </div>
      </div>

    </div>
  );
};

export default ChartSection;