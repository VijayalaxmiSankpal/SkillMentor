import React from "react";
import { useState } from "react";
import { FaUpload, FaFilePdf, FaCheckCircle, FaHistory, FaRedo } from "react-icons/fa";
import toast from "react-hot-toast";
import UploadZone from "./components/UploadZone";
import ATSScore from "./components/ATSScore";
import ReviewResult from "./components/ReviewResult";
import ImprovementCard from "./components/ImprovementCard";
import SectionAnalysis from "./components/SectionAnalysis";
import KeywordMatch from "./components/KeywordMatch";
import ResumeHistory from "./components/ResumeHistory";

const PAGE_TITLE = "AI Resume Review";
const PAGE_SUBTITLE = "Upload your resume and get AI-powered feedback, ATS scoring, and improvement suggestions";

const TAB_UPLOAD = "upload";
const TAB_RESULT = "result";
const TAB_HISTORY = "history";

const MOCK_REVIEW_RESULT = {
<<<<<<< HEAD
    atsScore: 72,
    overallFeedback: "Your resume has a solid foundation but needs optimization for ATS systems and stronger action verbs. The structure is clean but some sections lack quantifiable achievements.",
    sections: [
        {
            name: "Contact Information",
            score: 95,
            status: "good",
            feedback: "Complete and well-formatted. Email and phone are clear.",
        },
        {
            name: "Professional Summary",
            score: 60,
            status: "warning",
            feedback: "Too generic. Tailor it to the specific role you're applying for. Include years of experience and key specializations.",
        },
        {
            name: "Work Experience",
            score: 65,
            status: "warning",
            feedback: "Good structure but lacks metrics. Use STAR method and quantify achievements (%, $, time saved).",
        },
        {
            name: "Skills",
            score: 80,
            status: "good",
            feedback: "Good technical coverage. Consider grouping by category (Frontend, Backend, Tools, Cloud).",
        },
        {
            name: "Education",
            score: 90,
            status: "good",
            feedback: "Clear and concise. Add relevant coursework or certifications if applicable.",
        },
        {
            name: "Projects",
            score: 55,
            status: "error",
            feedback: "Missing or too brief. Add 2-3 strong projects with tech stack, your role, and measurable impact.",
        },
    ],
    keywords: {
        matched: ["React", "JavaScript", "Node.js", "Git", "REST API", "Agile", "SQL", "HTML/CSS"],
        missing: ["TypeScript", "Docker", "AWS", "CI/CD", "Microservices", "GraphQL", "Jest", "Redux"],
        score: 62,
    },
    improvements: [
        {
            category: "Action Verbs",
            priority: "high",
            suggestions: [
                "Replace 'Responsible for' with 'Led', 'Built', 'Architected'",
                "Use 'Optimized' instead of 'Made better'",
                "Start bullets with strong verbs: Implemented, Designed, Deployed",
            ],
        },
        {
            category: "Quantifiable Results",
            priority: "high",
            suggestions: [
                "Add metrics: 'Reduced load time by 40%'",
                "Include team size: 'Led team of 5 developers'",
                "Show scale: 'Handled 10K+ daily active users'",
            ],
        },
        {
            category: "ATS Optimization",
            priority: "medium",
            suggestions: [
                "Use standard section headings: Experience, Education, Skills",
                "Avoid tables, columns, and graphics",
                "Include keywords from job description",
                "Use .docx or plain PDF format",
            ],
        },
        {
            category: "Formatting",
            priority: "low",
            suggestions: [
                "Keep to 1 page for <5 years experience",
                "Use consistent date format",
                "Ensure readable font size (10-12pt)",
                "Add white space between sections",
            ],
        },
    ],
    fileName: "John_Doe_Resume.pdf",
    reviewedAt: "2025-05-14T12:00:00",
};

const INITIAL_HISTORY = [
    {
        id: 1,
        fileName: "John_Doe_Resume_v1.pdf",
        atsScore: 72,
        reviewedAt: "2025-05-14T12:00:00",
        status: "completed",
    },
    {
        id: 2,
        fileName: "John_Doe_Resume_v2.pdf",
        atsScore: 85,
        reviewedAt: "2025-05-10T15:30:00",
        status: "completed",
    },
];

function ResumeReviewPage() {
    const [activeTab, setActiveTab] = useState(TAB_UPLOAD);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [reviewResult, setReviewResult] = useState(null);
    const [history, setHistory] = useState(INITIAL_HISTORY);

    function handleTabChange(tab) {
        return function () {
            setActiveTab(tab);
        };
    }

    function handleFileUpload(file) {
        if (!file) return;
        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        setUploadedFile(file);
        setIsAnalyzing(true);
        setActiveTab(TAB_RESULT);

        setTimeout(function () {
            const result = {
                ...MOCK_REVIEW_RESULT,
                fileName: file.name,
                reviewedAt: new Date().toISOString(),
            };
            setReviewResult(result);
            setIsAnalyzing(false);

            setHistory(function (prev) {
                return [
                    {
                        id: Date.now(),
                        fileName: file.name,
                        atsScore: result.atsScore,
                        reviewedAt: result.reviewedAt,
                        status: "completed",
                    },
                    ...prev,
                ];
            });

            toast.success("Resume analysis complete!");
        }, 3000);
    }

    function handleReanalyze() {
        setUploadedFile(null);
        setReviewResult(null);
        setActiveTab(TAB_UPLOAD);
    }

    function handleDeleteHistory(id) {
        setHistory(function (prev) {
            return prev.filter(function (h) {
                return h.id !== id;
            });
        });
        toast.success("Removed from history");
    }

    function handleViewHistory(item) {
        return function () {
            const mockResult = {
                ...MOCK_REVIEW_RESULT,
                fileName: item.fileName,
                reviewedAt: item.reviewedAt,
                atsScore: item.atsScore,
            };
            setReviewResult(mockResult);
            setActiveTab(TAB_RESULT);
        };
    }

    const tabBase = "px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border";
    const tabActive = "bg-brand-500/20 text-brand-400 border-brand-500/30";
    const tabInactive = "text-gray-400 hover:text-white hover:bg-surface-card border-transparent";

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

                {/* Tabs */}
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={handleTabChange(TAB_UPLOAD)}
                        className={tabBase + " " + (activeTab === TAB_UPLOAD ? tabActive : tabInactive)}
                    >
                        <FaUpload size={14} />
                        Upload
                    </button>
                    <button
                        onClick={handleTabChange(TAB_RESULT)}
                        className={tabBase + " " + (activeTab === TAB_RESULT ? tabActive : tabInactive)}
                    >
                        <FaCheckCircle size={14} />
                        Results
                    </button>
                    <button
                        onClick={handleTabChange(TAB_HISTORY)}
                        className={tabBase + " " + (activeTab === TAB_HISTORY ? tabActive : tabInactive)}
                    >
                        <FaHistory size={14} />
                        History
                        <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-400">
                            {history.length}
                        </span>
                    </button>
                </div>

                {/* Upload Tab */}
                {activeTab === TAB_UPLOAD && (
                    <UploadZone
                        onUpload={handleFileUpload}
                        isAnalyzing={isAnalyzing}
                    />
                )}

                {/* Result Tab */}
                {activeTab === TAB_RESULT && (
                    <React.Fragment>
                        {isAnalyzing ? (
                            <div className="card p-12 text-center">
                                <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <FaFilePdf size={32} className="text-brand-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Analyzing your resume...</h3>
                                <p className="text-gray-400 text-sm">Our AI is reviewing your resume for ATS compatibility, keywords, and improvements.</p>
                            </div>
                        ) : reviewResult ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FaFilePdf size={20} className="text-rose-400" />
                                        <div>
                                            <p className="text-white font-medium text-sm">{reviewResult.fileName}</p>
                                            <p className="text-gray-500 text-xs">Reviewed on {new Date(reviewResult.reviewedAt).toLocaleDateString()}</p>
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
                                    <h3 className="text-white font-semibold text-base">Improvement Suggestions</h3>
                                    {reviewResult.improvements.map(function (improvement, index) {
                                        return (
                                            <ImprovementCard
                                                key={index}
                                                improvement={improvement}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="card p-12 text-center">
                                <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
                                    <FaUpload size={28} className="text-gray-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1">No resume analyzed yet</h3>
                                <p className="text-gray-400 text-sm">Upload your resume to see AI-powered feedback.</p>
                            </div>
                        )}
                    </React.Fragment>
                )}

                {/* History Tab */}
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
=======
  atsScore: 72,
  overallFeedback: "Your resume has a solid foundation but needs optimization for ATS systems and stronger action verbs. The structure is clean but some sections lack quantifiable achievements.",
  sections: [
    {
      name: "Contact Information",
      score: 95,
      status: "good",
      feedback: "Complete and well-formatted. Email and phone are clear.",
    },
    {
      name: "Professional Summary",
      score: 60,
      status: "warning",
      feedback: "Too generic. Tailor it to the specific role you're applying for. Include years of experience and key specializations.",
    },
    {
      name: "Work Experience",
      score: 65,
      status: "warning",
      feedback: "Good structure but lacks metrics. Use STAR method and quantify achievements (%, $, time saved).",
    },
    {
      name: "Skills",
      score: 80,
      status: "good",
      feedback: "Good technical coverage. Consider grouping by category (Frontend, Backend, Tools, Cloud).",
    },
    {
      name: "Education",
      score: 90,
      status: "good",
      feedback: "Clear and concise. Add relevant coursework or certifications if applicable.",
    },
    {
      name: "Projects",
      score: 55,
      status: "error",
      feedback: "Missing or too brief. Add 2-3 strong projects with tech stack, your role, and measurable impact.",
    },
  ],
  keywords: {
    matched: ["React", "JavaScript", "Node.js", "Git", "REST API", "Agile", "SQL", "HTML/CSS"],
    missing: ["TypeScript", "Docker", "AWS", "CI/CD", "Microservices", "GraphQL", "Jest", "Redux"],
    score: 62,
  },
  improvements: [
    {
      category: "Action Verbs",
      priority: "high",
      suggestions: [
        "Replace 'Responsible for' with 'Led', 'Built', 'Architected'",
        "Use 'Optimized' instead of 'Made better'",
        "Start bullets with strong verbs: Implemented, Designed, Deployed",
      ],
    },
    {
      category: "Quantifiable Results",
      priority: "high",
      suggestions: [
        "Add metrics: 'Reduced load time by 40%'",
        "Include team size: 'Led team of 5 developers'",
        "Show scale: 'Handled 10K+ daily active users'",
      ],
    },
    {
      category: "ATS Optimization",
      priority: "medium",
      suggestions: [
        "Use standard section headings: Experience, Education, Skills",
        "Avoid tables, columns, and graphics",
        "Include keywords from job description",
        "Use .docx or plain PDF format",
      ],
    },
    {
      category: "Formatting",
      priority: "low",
      suggestions: [
        "Keep to 1 page for <5 years experience",
        "Use consistent date format",
        "Ensure readable font size (10-12pt)",
        "Add white space between sections",
      ],
    },
  ],
  fileName: "John_Doe_Resume.pdf",
  reviewedAt: "2025-05-14T12:00:00",
};

const INITIAL_HISTORY = [
  {
    id: 1,
    fileName: "John_Doe_Resume_v1.pdf",
    atsScore: 72,
    reviewedAt: "2025-05-14T12:00:00",
    status: "completed",
  },
  {
    id: 2,
    fileName: "John_Doe_Resume_v2.pdf",
    atsScore: 85,
    reviewedAt: "2025-05-10T15:30:00",
    status: "completed",
  },
];

function ResumeReviewPage() {
  const [activeTab, setActiveTab] = useState(TAB_UPLOAD);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [history, setHistory] = useState(INITIAL_HISTORY);

  function handleTabChange(tab) {
    return function () {
      setActiveTab(tab);
    };
  }

  function handleFileUpload(file) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploadedFile(file);
    setIsAnalyzing(true);
    setActiveTab(TAB_RESULT);

    setTimeout(function () {
      const result = {
        ...MOCK_REVIEW_RESULT,
        fileName: file.name,
        reviewedAt: new Date().toISOString(),
      };
      setReviewResult(result);
      setIsAnalyzing(false);

      setHistory(function (prev) {
        return [
          {
            id: Date.now(),
            fileName: file.name,
            atsScore: result.atsScore,
            reviewedAt: result.reviewedAt,
            status: "completed",
          },
          ...prev,
        ];
      });

      toast.success("Resume analysis complete!");
    }, 3000);
  }

  function handleReanalyze() {
    setUploadedFile(null);
    setReviewResult(null);
    setActiveTab(TAB_UPLOAD);
  }

  function handleDeleteHistory(id) {
    setHistory(function (prev) {
      return prev.filter(function (h) {
        return h.id !== id;
      });
    });
    toast.success("Removed from history");
  }

  function handleViewHistory(item) {
    return function () {
      const mockResult = {
        ...MOCK_REVIEW_RESULT,
        fileName: item.fileName,
        reviewedAt: item.reviewedAt,
        atsScore: item.atsScore,
      };
      setReviewResult(mockResult);
      setActiveTab(TAB_RESULT);
    };
  }

  const tabBase = "px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border";
  const tabActive = "bg-brand-500/20 text-brand-400 border-brand-500/30";
  const tabInactive = "text-gray-400 hover:text-white hover:bg-surface-card border-transparent";

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

        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleTabChange(TAB_UPLOAD)}
            className={tabBase + " " + (activeTab === TAB_UPLOAD ? tabActive : tabInactive)}
          >
            <FaUpload size={14} />
            Upload
          </button>
          <button
            onClick={handleTabChange(TAB_RESULT)}
            className={tabBase + " " + (activeTab === TAB_RESULT ? tabActive : tabInactive)}
          >
            <FaCheckCircle size={14} />
            Results
          </button>
          <button
            onClick={handleTabChange(TAB_HISTORY)}
            className={tabBase + " " + (activeTab === TAB_HISTORY ? tabActive : tabInactive)}
          >
            <FaHistory size={14} />
            History
            <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-400">
              {history.length}
            </span>
          </button>
        </div>

        {/* Upload Tab */}
        {activeTab === TAB_UPLOAD && (
          <UploadZone
            onUpload={handleFileUpload}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* Result Tab */}
        {activeTab === TAB_RESULT && (
          <React.Fragment>
            {isAnalyzing ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <FaFilePdf size={32} className="text-brand-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Analyzing your resume...</h3>
                <p className="text-gray-400 text-sm">Our AI is reviewing your resume for ATS compatibility, keywords, and improvements.</p>
              </div>
            ) : reviewResult ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaFilePdf size={20} className="text-rose-400" />
                    <div>
                      <p className="text-white font-medium text-sm">{reviewResult.fileName}</p>
                      <p className="text-gray-500 text-xs">Reviewed on {new Date(reviewResult.reviewedAt).toLocaleDateString()}</p>
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
                  <h3 className="text-white font-semibold text-base">Improvement Suggestions</h3>
                  {reviewResult.improvements.map(function (improvement, index) {
                    return (
                      <ImprovementCard
                        key={index}
                        improvement={improvement}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
                  <FaUpload size={28} className="text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">No resume analyzed yet</h3>
                <p className="text-gray-400 text-sm">Upload your resume to see AI-powered feedback.</p>
              </div>
            )}
          </React.Fragment>
        )}

        {/* History Tab */}
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
>>>>>>> feat/notes-ui
}

export default ResumeReviewPage;