import React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  FaCalendarPlus,
  FaHistory,
  FaClock,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../services/api";

import ScheduleForm from "./components/ScheduleForm";
import InterviewHistory from "./components/InterviewHistory";
import UpcomingInterviews from "./components/UpcomingInterviews";
import StatsCards from "./components/StatsCards";
import FeedbackModal from "./components/FeedbackModal";

const PAGE_TITLE = "Mock Interviews";
const PAGE_SUBTITLE =
  "Schedule practice interviews, track your performance, and review feedback";

const TAB_UPCOMING = "upcoming";
const TAB_HISTORY = "history";
const TAB_SCHEDULE = "schedule";

const INTERVIEW_TYPES = [
  "technical",
  "system-design",
  "behavioral",
  "coding",
  "hr",
];

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile Developer",
  "Software Engineer",
];

function MockInterviewPage() {
  const [interviews, setInterviews] = useState([]);
  const [activeTab, setActiveTab] = useState(TAB_UPCOMING);
  const [showFeedbackId, setShowFeedbackId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    fetchInterviews();
  }, []);

  async function fetchInterviews() {
    try {
      setLoading(true);

      const response = await api.get("/mock-interviews");

      const items =
        response.data?.data?.items ||
        response.data?.data ||
        [];

      setInterviews(items);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  const upcomingInterviews = useMemo(function () {
    return interviews
      .filter(function (i) {
        return (
          i.status === "scheduled" &&
          i.date >= today
        );
      })
      .sort(function (a, b) {
        return (
          new Date(a.date + "T" + a.time) -
          new Date(b.date + "T" + b.time)
        );
      });
  }, [interviews, today]);

  const pastInterviews = useMemo(function () {
    return interviews
      .filter(function (i) {
        return (
          i.status === "completed" ||
          (i.status === "scheduled" &&
            i.date < today)
        );
      })
      .sort(function (a, b) {
        return (
          new Date(b.date + "T" + b.time) -
          new Date(a.date + "T" + a.time)
        );
      });
  }, [interviews, today]);

  const stats = useMemo(function () {
    const total = interviews.length;

    const completed = interviews.filter(function (i) {
      return i.status === "completed";
    }).length;

    const scheduled = upcomingInterviews.length;

    const missed = interviews.filter(function (i) {
      return (
        i.status === "scheduled" &&
        i.date < today
      );
    }).length;

    const rated = interviews.filter(function (i) {
      return i.overallScore;
    });

    const avgRating =
      rated.length > 0
        ? Math.round(
            rated.reduce(function (sum, i) {
              return sum + i.overallScore;
            }, 0) / rated.length
          )
        : 0;

    const totalMinutes = interviews.reduce(
      function (sum, i) {
        return sum + (i.durationMinutes || 0);
      },
      0
    );

    return {
      total,
      completed,
      scheduled,
      missed,
      avgRating,
      totalMinutes,
    };
  }, [interviews, upcomingInterviews, today]);

  function handleTabChange(tab) {
    return function () {
      setActiveTab(tab);
    };
  }

  async function handleScheduleInterview(interviewData) {
  try {
    await api.post("/mock-interviews", {
      role: interviewData.role,
      type: interviewData.type,
      difficulty: interviewData.difficulty || "medium",
      durationMinutes: Number(interviewData.durationMinutes || interviewData.duration || 30),
      scheduledAt: new Date(`${interviewData.date}T${interviewData.time}`).toISOString(),
      questions: [],
      status: "scheduled",
    });

    toast.success("Interview scheduled successfully!");
    await fetchInterviews();
    setActiveTab(TAB_UPCOMING);
  } catch (error) {
    console.error("Schedule interview error:", error);
    toast.error(error?.response?.data?.message || "Failed to schedule interview");
  }
}

  async function handleCancelInterview(interviewId) {
    try {
      await api.delete(
        `/mock-interviews/${interviewId}`
      );

      setInterviews(function (prev) {
        return prev.filter(function (i) {
          return i._id !== interviewId;
        });
      });

      toast.success("Interview cancelled!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel interview");
    }
  }

  async function handleCompleteInterview(interviewId) {
    try {
      await api.patch(
        `/mock-interviews/${interviewId}`,
        {
          status: "completed",
        }
      );

      setInterviews(function (prev) {
        return prev.map(function (i) {
          if (i._id === interviewId) {
            return {
              ...i,
              status: "completed",
            };
          }

          return i;
        });
      });

      toast.success(
        "Interview marked as completed!"
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update interview");
    }
  }

  function handleShowFeedback(interviewId) {
    setShowFeedbackId(interviewId);
  }

  function handleCloseFeedback() {
    setShowFeedbackId(null);
  }

  async function handleSaveFeedback(
    interviewId,
    feedbackData
  ) {
    try {
      await api.post(
        `/mock-interviews/${interviewId}/feedback`,
        {
          overallScore: feedbackData.rating,
          overallFeedback:
            feedbackData.feedback,
          strengths:
            feedbackData.strengths || [],
          weaknesses:
            feedbackData.improvements || [],
        }
      );

      toast.success("Feedback saved!");

      fetchInterviews();

      setShowFeedbackId(null);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to save feedback"
      );
    }
  }

  const selectedFeedbackInterview =
    useMemo(function () {
      if (!showFeedbackId) return null;

      return interviews.find(function (i) {
        return i._id === showFeedbackId;
      });
    }, [interviews, showFeedbackId]);

  const tabBase =
    "px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border";

  const tabActive =
    "bg-brand-500/20 text-brand-400 border-brand-500/30";

  const tabInactive =
    "text-gray-400 hover:text-white hover:bg-surface-card border-transparent";

  return (
    <React.Fragment>
      <div className="space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">
              {PAGE_TITLE}
            </h1>

            <p className="text-gray-400 text-sm">
              {PAGE_SUBTITLE}
            </p>
          </div>
        </div>

        <StatsCards stats={stats} />

        <div className="flex items-center gap-2 flex-wrap">

          <button
            onClick={handleTabChange(
              TAB_UPCOMING
            )}
            className={
              tabBase +
              " " +
              (activeTab === TAB_UPCOMING
                ? tabActive
                : tabInactive)
            }
          >
            <FaClock size={14} />
            Upcoming

            <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-400">
              {upcomingInterviews.length}
            </span>
          </button>

          <button
            onClick={handleTabChange(
              TAB_HISTORY
            )}
            className={
              tabBase +
              " " +
              (activeTab === TAB_HISTORY
                ? tabActive
                : tabInactive)
            }
          >
            <FaHistory size={14} />
            History

            <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-400">
              {pastInterviews.length}
            </span>
          </button>

          <button
            onClick={handleTabChange(
              TAB_SCHEDULE
            )}
            className={
              tabBase +
              " " +
              (activeTab === TAB_SCHEDULE
                ? tabActive
                : tabInactive)
            }
          >
            <FaCalendarPlus size={14} />
            Schedule New
          </button>

        </div>

        {loading ? (
          <div className="card p-10 text-center text-gray-400">
            Loading interviews...
          </div>
        ) : (
          <>
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
                onShowFeedback={
                  handleShowFeedback
                }
              />
            )}

            {activeTab === TAB_SCHEDULE && (
              <ScheduleForm
                onSchedule={
                  handleScheduleInterview
                }
                interviewTypes={
                  INTERVIEW_TYPES
                }
                roles={ROLES}
              />
            )}
          </>
        )}
      </div>

      {showFeedbackId &&
        selectedFeedbackInterview && (
          <FeedbackModal
            interview={
              selectedFeedbackInterview
            }
            onClose={handleCloseFeedback}
            onSave={handleSaveFeedback}
          />
        )}
    </React.Fragment>
  );
}

export default MockInterviewPage;