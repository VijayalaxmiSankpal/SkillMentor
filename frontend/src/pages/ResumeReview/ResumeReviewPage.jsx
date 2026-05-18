import React, { useEffect, useState } from "react";
import {
  FaUpload,
  FaFilePdf,
  FaCheckCircle,
  FaHistory,
  FaRedo,
} from "react-icons/fa";
import toast from "react-hot-toast";
import UploadZone from "./components/UploadZone";
import ATSScore from "./components/ATSScore";
import ReviewResult from "./components/ReviewResult";
import ImprovementCard from "./components/ImprovementCard";
import SectionAnalysis from "./components/SectionAnalysis";
import KeywordMatch from "./components/KeywordMatch";
import ResumeHistory from "./components/ResumeHistory";
import resumeService from "../../services/resumeService";

const TAB_UPLOAD = "upload";
const TAB_RESULT = "result";
const TAB_HISTORY = "history";

const formatReview = (review) => ({
  id: review._id,
  fileName: review.fileName,
  atsScore: review.atsScore || 0,
  reviewedAt: review.createdAt,
  status: review.status,
  overallFeedback: review.feedback?.summary || "",
  sections: [],
  keywords: {
    matched: [],
    missing: review.feedback?.missingKeywords || [],
    score: review.atsScore || 0,
  },
  improvements: [
    {
      category: "Strengths",
      priority: "low",
      suggestions: review.feedback?.strengths || [],
    },
    {
      category: "Weaknesses",
      priority: "high",
      suggestions: review.feedback?.weaknesses || [],
    },
    {
      category: "Suggestions",
      priority: "medium",
      suggestions: review.feedback?.suggestions || [],
    },
  ],
});

function ResumeReviewPage() {
  const [activeTab, setActiveTab] = useState(TAB_UPLOAD);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    try {
      const response = await resumeService.getReviews();
      const items = response.data?.items || [];
      setHistory(items.map(formatReview));
    } catch (error) {
      console.error("Failed to load resume history:", error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleTabChange = (tab) => () => {
    setActiveTab(tab);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsAnalyzing(true);
    setActiveTab(TAB_RESULT);

    try {
      const response = await resumeService.uploadResume(
        file,
        "Frontend Developer"
      );

      const review = response.data?.review;
      const formatted = formatReview(review);

      setReviewResult(formatted);
      toast.success("Resume analysis complete!");
      await loadHistory();
    } catch (error) {
      console.error("Resume upload failed:", error);
      toast.error(error?.response?.data?.message || "Resume analysis failed");
      setActiveTab(TAB_UPLOAD);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReanalyze = () => {
    setReviewResult(null);
    setActiveTab(TAB_UPLOAD);
  };

  const handleDeleteHistory = async (id) => {
    try {
      await resumeService.deleteReview(id);
      toast.success("Removed from history");
      await loadHistory();

      if (reviewResult?.id === id) {
        setReviewResult(null);
        setActiveTab(TAB_UPLOAD);
      }
    } catch (error) {
      console.error("Delete resume review failed:", error);
      toast.error("Failed to delete resume review");
    }
  };

  const handleViewHistory = (item) => () => {
    setReviewResult(item);
    setActiveTab(TAB_RESULT);
  };

  const tabBase =
    "px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border";
  const tabActive = "bg-brand-500/20 text-brand-400 border-brand-500/30";
  const tabInactive =
    "text-gray-400 hover:text-white hover:bg-surface-card border-transparent";

  return (
    <React.Fragment>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">
              AI Resume Review
            </h1>
            <p className="text-gray-400 text-sm">
              Upload your resume and get AI-powered feedback, ATS scoring, and
              improvement suggestions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleTabChange(TAB_UPLOAD)}
            className={
              tabBase +
              " " +
              (activeTab === TAB_UPLOAD ? tabActive : tabInactive)
            }
          >
            <FaUpload size={14} />
            Upload
          </button>

          <button
            onClick={handleTabChange(TAB_RESULT)}
            className={
              tabBase +
              " " +
              (activeTab === TAB_RESULT ? tabActive : tabInactive)
            }
          >
            <FaCheckCircle size={14} />
            Results
          </button>

          <button
            onClick={handleTabChange(TAB_HISTORY)}
            className={
              tabBase +
              " " +
              (activeTab === TAB_HISTORY ? tabActive : tabInactive)
            }
          >
            <FaHistory size={14} />
            History
            <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-400">
              {history.length}
            </span>
          </button>
        </div>

        {activeTab === TAB_UPLOAD && (
          <UploadZone onUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
        )}

        {activeTab === TAB_RESULT && (
          <React.Fragment>
            {isAnalyzing ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <FaFilePdf size={32} className="text-brand-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Analyzing your resume...
                </h3>
                <p className="text-gray-400 text-sm">
                  Our AI is reviewing your resume for ATS compatibility,
                  keywords, and improvements.
                </p>
              </div>
            ) : reviewResult ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaFilePdf size={20} className="text-rose-400" />
                    <div>
                      <p className="text-white font-medium text-sm">
                        {reviewResult.fileName}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Reviewed on{" "}
                        {new Date(reviewResult.reviewedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleReanalyze}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-border text-gray-300 hover:text-white text-sm font-medium transition-all border border-surface-border"
                  >
                    <FaRedo size={12} />
                    Upload New
                  </button>
                </div>

                <ATSScore score={reviewResult.atsScore} />

                <ReviewResult feedback={reviewResult.overallFeedback} />

                <SectionAnalysis sections={reviewResult.sections} />

                <KeywordMatch keywords={reviewResult.keywords} />

                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-base">
                    Improvement Suggestions
                  </h3>

                  {reviewResult.improvements.map((improvement, index) => (
                    <ImprovementCard
                      key={index}
                      improvement={improvement}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
                  <FaUpload size={28} className="text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  No resume analyzed yet
                </h3>
                <p className="text-gray-400 text-sm">
                  Upload your resume to see AI-powered feedback.
                </p>
              </div>
            )}
          </React.Fragment>
        )}

        {activeTab === TAB_HISTORY && (
          <ResumeHistory
            history={history}
            onDelete={handleDeleteHistory}
            onView={handleViewHistory}
          />
        )}
      </div>
    </React.Fragment>
  );
}

export default ResumeReviewPage;