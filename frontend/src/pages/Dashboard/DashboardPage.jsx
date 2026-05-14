import {
  RiCodeSSlashLine,
  RiFileTextLine,
  RiRoadMapLine,
  RiCalendarLine,
  RiTrophyLine,
  RiFireLine,
} from "react-icons/ri";
import StatsCard       from "./components/StatsCard";
import ProgressSection from "./components/ProgressSection";
import ChartSection    from "./components/ChartSection";
import ActivityFeed    from "./components/ActivityFeed";
import { useAuth }     from "../../context/AuthContext";

const STATS = [
  {
    title:    "Problems Solved",
    value:    "81",
    subtitle: "LeetCode + HackerRank",
    icon:     RiCodeSSlashLine,
    color:    "brand",
    trend:    "+12 this week",
  },
  {
    title:    "Notes Created",
    value:    "24",
    subtitle: "Across all topics",
    icon:     RiFileTextLine,
    color:    "yellow",
    trend:    "+3 this week",
  },
  {
    title:    "Roadmap Progress",
    value:    "38%",
    subtitle: "Frontend Developer Path",
    icon:     RiRoadMapLine,
    color:    "accent",
    trend:    "+5% this week",
  },
  {
    title:    "Mock Interviews",
    value:    "6",
    subtitle: "Avg score: 78/100",
    icon:     RiCalendarLine,
    color:    "purple",
    trend:    "+2 this week",
  },
  {
    title:    "Day Streak",
    value:    "14",
    subtitle: "Keep it going!",
    icon:     RiFireLine,
    color:    "orange",
    trend:    "Personal best",
  },
  {
    title:    "Achievements",
    value:    "9",
    subtitle: "Badges earned",
    icon:     RiTrophyLine,
    color:    "pink",
    trend:    "+2 new",
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const DashboardPage = () => {
  const { user } = useAuth();
  const firstName = user && user.name ? user.name.split(" ")[0] : "there";

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            {getGreeting()}, {firstName}! 👋
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Here's your progress overview for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="badge badge-green">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
            14 Day Streak
          </div>
          <div className="badge badge-indigo">
            Pro Plan
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {STATS.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Charts */}
      <ChartSection />

      {/* Progress + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <ProgressSection />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;