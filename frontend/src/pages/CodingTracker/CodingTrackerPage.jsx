import React, { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaCode,
} from "react-icons/fa";
import toast from "react-hot-toast";
import ProblemTable from "./components/ProblemTable";
import ProblemCard from "./components/ProblemCard";
import ProblemModal from "./components/ProblemModal";
import DeleteProblemModal from "./components/DeleteProblemModal";
import PlatformFilter from "./components/PlatformFilter";
import StatsOverview from "./components/StatsOverview";
import codingService from "../../services/codingService";

const PAGE_TITLE = "Coding Practice Tracker";
const PAGE_SUBTITLE =
  "Track your solved problems across platforms and monitor your progress";

const SEARCH_PLACEHOLDER = "Search problems by title or topic...";
const ADD_BUTTON_TEXT = "Add Problem";
const NO_RESULTS_TITLE = "No problems found";
const NO_RESULTS_MESSAGE =
  "Try adjusting your filters or add a new problem to get started.";

const FILTER_ALL = "all";
const FILTER_EASY = "Easy";
const FILTER_MEDIUM = "Medium";
const FILTER_HARD = "Hard";

const TAB_ALL = "all";
const TAB_SOLVED = "solved";
const TAB_UNSOLVED = "unsolved";
const TAB_BOOKMARKED = "bookmarked";

const VIEW_GRID = "grid";
const VIEW_LIST = "list";

const DIFFICULTY_FILTERS = [
  { label: "All", value: FILTER_ALL },
  { label: "Easy", value: FILTER_EASY },
  { label: "Medium", value: FILTER_MEDIUM },
  { label: "Hard", value: FILTER_HARD },
];

const STATUS_TABS = [
  { label: "All", value: TAB_ALL },
  { label: "Solved", value: TAB_SOLVED },
  { label: "Unsolved", value: TAB_UNSOLVED },
  { label: "Bookmarked", value: TAB_BOOKMARKED },
];

const platformToBackend = (platform) => {
  const map = {
    LeetCode: "leetcode",
    Codeforces: "codeforces",
    GeeksforGeeks: "gfg",
    HackerRank: "hackerrank",
    CodeChef: "codechef",
    Other: "other",
  };

  return map[platform] || "other";
};

const platformToFrontend = (platform) => {
  const map = {
    leetcode: "LeetCode",
    codeforces: "Codeforces",
    gfg: "GeeksforGeeks",
    hackerrank: "HackerRank",
    codechef: "CodeChef",
    atcoder: "AtCoder",
    other: "Other",
  };

  return map[platform] || "Other";
};

const difficultyToBackend = (difficulty) => difficulty.toLowerCase();

const difficultyToFrontend = (difficulty) => {
  if (!difficulty) return "Easy";
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
};

const statusToBackend = (status) => {
  if (status === "unsolved") return "attempted";
  return status;
};

const statusToFrontend = (status) => {
  if (status === "attempted" || status === "revisit") return "unsolved";
  return status;
};

const formatProblemFromBackend = (log) => ({
  id: log._id,
  title: log.questionTitle,
  platform: platformToFrontend(log.platform),
  difficulty: difficultyToFrontend(log.difficulty),
  topic: log.topic || "Other",
  status: statusToFrontend(log.status),
  bookmarked: log.bookmarked || false,
  timeSpent: log.timeSpentMinutes || 0,
  notes: log.notes || "",
  link: log.questionUrl || "",
  solvedDate: log.solvedAt ? log.solvedAt.split("T")[0] : null,
});

const formatProblemForBackend = (problemData) => ({
  questionTitle: problemData.title,
  platform: platformToBackend(problemData.platform),
  difficulty: difficultyToBackend(problemData.difficulty),
  topic: problemData.topic.toLowerCase(),
  status: statusToBackend(problemData.status),
  questionUrl: problemData.link,
  timeSpentMinutes: Number(problemData.timeSpent) || 0,
  notes: problemData.notes || "",
bookmarked: problemData.bookmarked || false,
  solvedAt:
    problemData.status === "solved"
      ? new Date().toISOString()
      : new Date().toISOString(),
});

function CodingTrackerPage() {
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState(FILTER_ALL);
  const [platformFilter, setPlatformFilter] = useState(FILTER_ALL);
  const [topicFilter, setTopicFilter] = useState(FILTER_ALL);
  const [statusTab, setStatusTab] = useState(TAB_ALL);
  const [viewMode, setViewMode] = useState(VIEW_GRID);
  const [showModal, setShowModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [deletingProblem, setDeletingProblem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProblems = async () => {
    try {
      setLoading(true);
      const response = await codingService.getProblems();
      const logs = response.data?.items || [];
      setProblems(logs.map(formatProblemFromBackend));
    } catch (error) {
      console.error("Failed to load coding problems:", error);
      toast.error("Failed to load coding problems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const topics = useMemo(() => {
    const allTopics = problems.map((p) => p.topic);
    return [...new Set(allTopics)].sort();
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.topic.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty =
        difficultyFilter === FILTER_ALL ||
        problem.difficulty === difficultyFilter;

      const matchesPlatform =
        platformFilter === FILTER_ALL || problem.platform === platformFilter;

      const matchesTopic =
        topicFilter === FILTER_ALL || problem.topic === topicFilter;

      let matchesStatus = true;

      if (statusTab === TAB_SOLVED) {
        matchesStatus = problem.status === "solved";
      } else if (statusTab === TAB_UNSOLVED) {
        matchesStatus = problem.status === "unsolved";
      } else if (statusTab === TAB_BOOKMARKED) {
        matchesStatus = problem.bookmarked === true;
      }

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesPlatform &&
        matchesTopic &&
        matchesStatus
      );
    });
  }, [
    problems,
    searchQuery,
    difficultyFilter,
    platformFilter,
    topicFilter,
    statusTab,
  ]);

  const stats = useMemo(() => {
    const total = problems.length;
    const solved = problems.filter((p) => p.status === "solved").length;
    const unsolved = problems.filter((p) => p.status === "unsolved").length;
    const bookmarked = problems.filter((p) => p.bookmarked === true).length;

    const easySolved = problems.filter(
      (p) => p.status === "solved" && p.difficulty === "Easy"
    ).length;

    const mediumSolved = problems.filter(
      (p) => p.status === "solved" && p.difficulty === "Medium"
    ).length;

    const hardSolved = problems.filter(
      (p) => p.status === "solved" && p.difficulty === "Hard"
    ).length;

    const totalTime = problems.reduce((sum, p) => sum + p.timeSpent, 0);
    const streak = 0;

    return {
      total,
      solved,
      unsolved,
      bookmarked,
      easySolved,
      mediumSolved,
      hardSolved,
      totalTime,
      streak,
    };
  }, [problems]);

  const tabCounts = useMemo(() => {
    return {
      all: problems.length,
      solved: problems.filter((p) => p.status === "solved").length,
      unsolved: problems.filter((p) => p.status === "unsolved").length,
      bookmarked: problems.filter((p) => p.bookmarked === true).length,
    };
  }, [problems]);

  function handleAddClick() {
    setEditingProblem(null);
    setShowModal(true);
  }

  function handleEditClick(problem) {
    setEditingProblem(problem);
    setShowModal(true);
  }

  function handleDeleteClick(problem) {
    setDeletingProblem(problem);
  }

  function handleModalClose() {
    setShowModal(false);
    setEditingProblem(null);
  }

  function handleDeleteModalClose() {
    setDeletingProblem(null);
  }

  async function handleSaveProblem(problemData) {
    try {
      const backendPayload = formatProblemForBackend(problemData);

      if (editingProblem) {
        await codingService.updateProblem(editingProblem.id, backendPayload);
        toast.success("Problem updated successfully!");
      } else {
        await codingService.createProblem(backendPayload);
        toast.success("Problem added successfully!");
      }

      setShowModal(false);
      setEditingProblem(null);
      await loadProblems();
    } catch (error) {
      console.error("Save problem failed:", error);
      toast.error(error?.response?.data?.message || "Failed to save problem");
    }
  }

  async function handleConfirmDelete() {
    if (!deletingProblem) return;

    try {
      await codingService.deleteProblem(deletingProblem.id);
      toast.success("Problem deleted successfully!");
      setDeletingProblem(null);
      await loadProblems();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete problem");
    }
  }

  async function handleToggleStatus(problemId) {
    const problem = problems.find((p) => p.id === problemId);
    if (!problem) return;

    const nextStatus = problem.status === "solved" ? "unsolved" : "solved";

    try {
      await codingService.updateProblem(problemId, {
        status: statusToBackend(nextStatus),
        solvedAt: new Date().toISOString(),
      });

      toast.success("Status updated!");
      await loadProblems();
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Failed to update status");
    }
  }

  async function handleToggleBookmark(problemId) {
  const problem = problems.find(
    (p) => p.id === problemId
  );

  if (!problem) return;

  try {
    await codingService.updateProblem(
      problemId,
      {
        bookmarked:
          !problem.bookmarked,
      }
    );

    toast.success(
      problem.bookmarked
        ? "Bookmark removed"
        : "Bookmarked"
    );

    await loadProblems();
  } catch (error) {
    console.error(
      "Bookmark update failed:",
      error
    );

    toast.error(
      "Failed to update bookmark"
    );
  }
}

  function handleOpenLink(url) {
    window.open(url, "_blank");
  }

  const searchInputClass =
    "w-full bg-surface-card border border-surface-border rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all";

  const filterBtnBase =
    "px-4 py-2 rounded-lg text-sm font-medium transition-all border";
  const filterBtnActive = "bg-brand-500 text-white border-brand-500";
  const filterBtnInactive =
    "bg-surface-card text-gray-400 border-surface-border hover:border-gray-500";

  const tabBase =
    "px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2";
  const tabActive =
    "bg-brand-500/20 text-brand-400 border border-brand-500/30";
  const tabInactive =
    "text-gray-400 hover:text-white hover:bg-surface-card border border-transparent";

  const viewBtnBase = "p-2.5 rounded-lg transition-all border";
  const viewBtnActive =
    "bg-surface-card text-brand-400 border-brand-500/30";
  const viewBtnInactive = "text-gray-500 hover:text-white border-transparent";

  return (
    <React.Fragment>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">
              {PAGE_TITLE}
            </h1>
            <p className="text-gray-400 text-sm">{PAGE_SUBTITLE}</p>
          </div>

          <button
            onClick={handleAddClick}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm self-start"
          >
            <FaPlus size={14} />
            {ADD_BUTTON_TEXT}
          </button>
        </div>

        <StatsOverview stats={stats} />

        <div className="card p-4 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type="text"
                placeholder={SEARCH_PLACEHOLDER}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={searchInputClass}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {DIFFICULTY_FILTERS.map((filter) => {
                const isActive = difficultyFilter === filter.value;
                const btnClass = isActive ? filterBtnActive : filterBtnInactive;

                return (
                  <button
                    key={filter.value}
                    onClick={() => setDifficultyFilter(filter.value)}
                    className={filterBtnBase + " " + btnClass}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1 bg-surface rounded-lg p-1">
              <button
                onClick={() => setViewMode(VIEW_GRID)}
                className={
                  viewBtnBase +
                  " " +
                  (viewMode === VIEW_GRID ? viewBtnActive : viewBtnInactive)
                }
                title="Grid view"
              >
                Grid
              </button>

              <button
                onClick={() => setViewMode(VIEW_LIST)}
                className={
                  viewBtnBase +
                  " " +
                  (viewMode === VIEW_LIST ? viewBtnActive : viewBtnInactive)
                }
                title="List view"
              >
                List
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-card border border-surface-border text-gray-400 hover:text-white text-sm font-medium transition-all"
            >
              <FaFilter size={14} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="pt-4 border-t border-surface-border space-y-4">
              <PlatformFilter
                selectedPlatform={platformFilter}
                onPlatformChange={setPlatformFilter}
                selectedTopic={topicFilter}
                onTopicChange={setTopicFilter}
                topics={topics}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_TABS.map((tab) => {
            const isActive = statusTab === tab.value;
            const tabClass = isActive ? tabActive : tabInactive;
            const count = tabCounts[tab.value] || 0;

            return (
              <button
                key={tab.value}
                onClick={() => setStatusTab(tab.value)}
                className={tabBase + " " + tabClass}
              >
                {tab.label}
                <span className="bg-surface px-2 py-0.5 rounded-full text-xs text-gray-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="card p-12 text-center">
            <p className="text-gray-400 text-sm">Loading coding problems...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
              <FaCode size={28} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {NO_RESULTS_TITLE}
            </h3>
            <p className="text-gray-400 text-sm">{NO_RESULTS_MESSAGE}</p>
          </div>
        ) : viewMode === VIEW_GRID ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProblems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onToggleStatus={handleToggleStatus}
                onToggleBookmark={handleToggleBookmark}
                onOpenLink={handleOpenLink}
              />
            ))}
          </div>
        ) : (
          <ProblemTable
            problems={filteredProblems}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onToggleStatus={handleToggleStatus}
            onToggleBookmark={handleToggleBookmark}
            onOpenLink={handleOpenLink}
          />
        )}
      </div>

      {showModal && (
        <ProblemModal
          problem={editingProblem}
          onClose={handleModalClose}
          onSave={handleSaveProblem}
        />
      )}

      {deletingProblem && (
        <DeleteProblemModal
          problem={deletingProblem}
          onClose={handleDeleteModalClose}
          onConfirm={handleConfirmDelete}
        />
      )}
    </React.Fragment>
  );
}

export default CodingTrackerPage;