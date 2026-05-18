import { useEffect, useState } from "react";
import {
  RiCodeSSlashLine,
  RiFileTextLine,
  RiRoadMapLine,
  RiCalendarLine,
  RiTrophyLine,
  RiFireLine,
} from "react-icons/ri";
import StatsCard from "./components/StatsCard";
import ProgressSection from "./components/ProgressSection";
import ChartSection from "./components/ChartSection";
import ActivityFeed from "./components/ActivityFeed";
import { useAuth } from "../../context/AuthContext";
import dashboardService from "../../services/dashboardService";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const DashboardPage = () => {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const firstName = user && user.name ? user.name.split(" ")[0] : "there";

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardService.getDashboard();
        setDashboardData(response.data);
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = dashboardData?.stats || {};
  const difficulty = dashboardData?.difficulty || {};
  const weeklyActivity = dashboardData?.weeklyActivity || [];
  const recentActivity = dashboardData?.recentActivity || [];

  const STATS = [
    {
      title: "Problems Solved",
      value: stats.problemsSolved ?? 0,
      subtitle: "LeetCode + HackerRank",
      icon: RiCodeSSlashLine,
      color: "brand",
      trend: "From MongoDB",
    },
    {
      title: "Notes Created",
      value: stats.notesCreated ?? 0,
      subtitle: "Across all topics",
      icon: RiFileTextLine,
      color: "yellow",
      trend: "From MongoDB",
    },
    {
      title: "Roadmap Progress",
      value: `${stats.roadmapProgress ?? 0}%`,
      subtitle: "Learning roadmap",
      icon: RiRoadMapLine,
      color: "accent",
      trend: "From MongoDB",
    },
    {
      title: "Mock Interviews",
      value: stats.mockInterviews ?? 0,
      subtitle: "Practice sessions",
      icon: RiCalendarLine,
      color: "purple",
      trend: "From MongoDB",
    },
    {
      title: "Day Streak",
      value: stats.streak ?? 0,
      subtitle: "Keep it going!",
      icon: RiFireLine,
      color: "orange",
      trend: "From MongoDB",
    },
    {
      title: "Achievements",
      value: stats.achievements ?? 0,
      subtitle: "Badges earned",
      icon: RiTrophyLine,
      color: "pink",
      trend: "From MongoDB",
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
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
            {stats.streak ?? 0} Day Streak
          </div>

          <div className="badge badge-indigo">Pro Plan</div>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading dashboard...</p>
      ) : (
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
      )}

      <ChartSection
        weeklyActivity={weeklyActivity}
        difficulty={difficulty}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <ProgressSection stats={stats} />
        </div>

        <div>
          <ActivityFeed activities={recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;