import React from "react";
import { useState, useMemo } from "react";
import { FaCalendarPlus, FaHistory, FaChartLine, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import toast from "react-hot-toast";
import ScheduleForm from "./components/ScheduleForm";
import InterviewHistory from "./components/InterviewHistory";
import UpcomingInterviews from "./components/UpcomingInterviews";
import StatsCards from "./components/StatsCards";
import FeedbackModal from "./components/FeedbackModal";

const PAGE_TITLE = "Mock Interviews";
const PAGE_SUBTITLE = "Schedule practice interviews, track your performance, and review feedback";

const TAB_UPCOMING = "upcoming";
const TAB_HISTORY = "history";
const TAB_SCHEDULE = "schedule";

const INITIAL_INTERVIEWS = [
  {
    id: 1,
    type: "Technical",
    role: "Frontend Developer",
    company: "Self",
    date: "2025-05-15",
    time: "10:00",
    duration: 60,
    status: "scheduled",
    notes: "Focus on React hooks and performance optimization",
    feedback: null,
    rating: null,
    strengths: [],
    improvements: [],
  },
  {
    id: 2,
    type: "System Design",
    role: "Full Stack Developer",
    company: "Self",
    date: "2025-05-10",
    time: "14:00",
    duration: 90,
    status: "completed",
    notes: "Design a URL shortener",
    feedback: "Good understanding of hashing. Need to work on database sharding.",
    rating: 4,
    strengths: ["Hash function design", "API design", "Load balancing basics"],
    improvements: ["Database sharding", "Cache eviction policies", "Rate limiting"],
  },
  {
    id: 3,
    type: "Behavioral",
    role: "Software Engineer",
    company: "Self",
    date: "2025-05-08",
    time: "11:00",
    duration: 45,
    status: "completed",
    notes: "STAR method practice",
    feedback: "Clear communication. Provide more quantifiable results.",
    rating: 3,
    strengths: ["Structured answers", "Good eye contact", "Concise responses"],
    improvements: ["Add metrics to answers", "More specific examples", "Confidence"],
  },
  {
    id: 4,
    type: "Technical",
    role: "Backend Developer",
    company: "Self",
    date: "2025-05-05",
    time: "16:00",
    duration: 60,
    status: "completed",
    notes: "Node.js and database queries",
    feedback: "Strong SQL skills. Need to practice async patterns.",
    rating: 4,
    strengths: ["SQL optimization", "Index usage", "Transaction handling"],
    improvements: ["Async/await patterns", "Error handling", "Connection pooling"],
  },
  {
    id: 5,
    type: "Coding",
    role: "Frontend Developer",
    company: "Self",
    date: "2025-05-01",
    time: "09:00",
    duration: 45,
    status: "completed",
    notes: "LeetCode medium problems",
    feedback: "Good problem decomposition. Work on edge cases.",
    rating: 3,
    strengths: ["Problem breakdown", "Clean code", "Time complexity analysis"],
    improvements: ["Edge case handling", "Space optimization", "Dry run practice"],
  },
  {
    id: 6,
    type: "Technical",
    role: "Data Scientist",
    company: "Self",
    date: "2025-05-20",
    time: "13:00",
    duration: 60,
    status: "scheduled",
    notes: "Machine learning concepts and statistics",
    feedback: null,
    rating: null,
    strengths: [],
    improvements: [],
  },
];

const INTERVIEW_TYPES = ["Technical", "System Design", "Behavioral", "Coding", "HR Round"];
const ROLES = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "DevOps Engineer", "Mobile Developer", "Software Engineer"];

function MockInterviewPage() {
  const [interviews, setInterviews] = useState(INITIAL_INTERVIEWS);
  const [activeTab, setActiveTab] = useState(TAB_UPCOMING);
  const [showFeedbackId, setShowFeedbackId] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const upcomingInterviews = useMemo(function () {
    return interviews.filter(function (i) {
      return i.status === "scheduled" && i.date >= today;
    }).sort(function (a, b) {
      return new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time);
    });
  }, [interviews, today]);

  const pastInterviews = useMemo(function () {
    return interviews.filter(function (i) {
      return i.status === "completed" || (i.status === "scheduled" && i.date < today);
    }).sort(function (a, b) {
      return new Date(b.date + "T" + b.time) - new Date(a.date + "T" + a.time);
    });
  }, [interviews, today]);

  const stats = useMemo(function () {
    const total = interviews.length;
    const completed = interviews.filter(function (i) {
      return i.status === "completed";
    }).length;
    const scheduled = upcomingInterviews.length;
    const missed = interviews.filter(function (i) {
      return i.status === "scheduled" && i.date < today;
    }).length;
    const avgRating = completed > 0
      ? Math.round(
          interviews
            .filter(function (i) {
              return i.status === "completed" && i.rating;
            })
            .reduce(function (sum, i) {
              return sum + i.rating;
            }, 0) / completed * 10
        ) / 10
      : 0;
    const totalMinutes = interviews
      .filter(function (i) {
        return i.status === "completed";
      })
      .reduce(function (sum, i) {
        return sum + i.duration;
      }, 0);

    return { total, completed, scheduled, missed, avgRating, totalMinutes };
  }, [interviews, upcomingInterviews, today]);

  function handleTabChange(tab) {
    return function () {
      setActiveTab(tab);
    };
  }

  function handleScheduleInterview(interviewData) {
    const newInterview = {
      id: Date.now(),
      ...interviewData,
      status: "scheduled",
      feedback: null,
      rating: null,
      strengths: [],
      improvements: [],
    };
    setInterviews(function (prev) {
      return [...prev, newInterview];
    });
    toast.success("Interview scheduled successfully!");
    setActiveTab(TAB_UPCOMING);
  }

  function handleCancelInterview(interviewId) {
    setInterviews(function (prev) {
      return prev.filter(function (i) {
        return i.id !== interviewId;
      });
    });
    toast.success("Interview cancelled!");
  }

  function handleCompleteInterview(interviewId) {
    setInterviews(function (prev) {
      return prev.map(function (i) {
        if (i.id === interviewId) {
          return { ...i, status: "completed" };
        }
        return i;
      });
    });
    toast.success("Interview marked as completed!");
  }

  function handleShowFeedback(interviewId) {
    setShowFeedbackId(interviewId);
  }

  function handleCloseFeedback() {
    setShowFeedbackId(null);
  }

  function handleSaveFeedback(interviewId, feedbackData) {
    setInterviews(function (prev) {
      return prev.map(function (i) {
        if (i.id === interviewId) {
          return {
            ...i,
            feedback: feedbackData.feedback,
            rating: feedbackData.rating,
            strengths: feedbackData.strengths,
            improvements: feedbackData.improvements,
          };
        }
        return i;
      });
    });
    toast.success("Feedback saved!");
    setShowFeedbackId(null);
  }

  const tabBase = "px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border";
  const tabActive = "bg-brand-500/20 text-brand-400 border-brand-500/30";
  const tabInactive = "text-gray-400 hover:text-white hover:bg-surface-card border-transparent";

  const selectedFeedbackInterview = useMemo(function () {
    if (!showFeedbackId) return null;
    return interviews.find(function (i) {
      return i.id === showFeedbackId;
    });
  }, [interviews, showFeedbackId]);

  return (
    <React.Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">{PAGE_TITLE}</h1>
            <p className="text-gray-400 text-sm">{PAGE_SUBTITLE}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleTabChange(TAB_UPCOMING)}
            className={tabBase + " " + (activeTab === TAB_UPCOMING ? tabActive : tabInactive)}
          >
            <FaClock size={14} />
            Upcoming
            <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-400">
              {upcomingInterviews.length}
            </span>
          </button>
          <button
            onClick={handleTabChange(TAB_HISTORY)}
            className={tabBase + " " + (activeTab === TAB_HISTORY ? tabActive : tabInactive)}
          >
            <FaHistory size={14} />
            History
            <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-400">
              {pastInterviews.length}
            </span>
          </button>
          <button
            onClick={handleTabChange(TAB_SCHEDULE)}
            className={tabBase + " " + (activeTab === TAB_SCHEDULE ? tabActive : tabInactive)}
          >
            <FaCalendarPlus size={14} />
            Schedule New
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === TAB_UPCOMING && (
          <UpcomingInterviews
            interviews={upcomingInterviews}
            onCancel={handleCancelInterview}
            onComplete={handleCompleteInterview}
          />
        )}

        {activeTab === TAB_HISTORY && (
          <InterviewHistory
            interviews={pastInterviews}
            onShowFeedback={handleShowFeedback}
          />
        )}

        {activeTab === TAB_SCHEDULE && (
          <ScheduleForm
            onSchedule={handleScheduleInterview}
            interviewTypes={INTERVIEW_TYPES}
            roles={ROLES}
          />
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackId && selectedFeedbackInterview && (
        <FeedbackModal
          interview={selectedFeedbackInterview}
          onClose={handleCloseFeedback}
          onSave={handleSaveFeedback}
        />
      )}
    </React.Fragment>
  );
}

export default MockInterviewPage;