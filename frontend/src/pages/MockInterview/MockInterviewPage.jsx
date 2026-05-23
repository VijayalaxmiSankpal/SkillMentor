import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import mockInterviewService from "../../services/mockInterviewService";
import UpcomingInterviews from "./components/UpcomingInterviews";
import InterviewHistory from "./components/InterviewHistory";

function MockInterviewPage() {
  const [interviews, setInterviews] = useState([]);
  const [activeInterview, setActiveInterview] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadInterviews() {
    try {
      const response = await mockInterviewService.getInterviews();

      const data = response.data?.items || response.data?.data?.items || [];

      setInterviews(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load interviews");
    }
  }

  useEffect(() => {
    loadInterviews();
  }, []);

  async function handleCreateInterview(domain = "frontend") {
  try {
    setLoading(true);

    const domainMap = {
      frontend: {
        role: "Frontend Developer",
        type: "technical",
        skills: ["React", "JavaScript", "HTML", "CSS"],
      },
      backend: {
        role: "Backend Developer",
        type: "technical",
        skills: ["Node.js", "Express", "MongoDB", "REST API"],
      },
      fullstack: {
        role: "Full Stack Developer",
        type: "mixed",
        skills: ["React", "Node.js", "Express", "MongoDB"],
      },
      hr: {
        role: "Software Developer",
        type: "hr",
        skills: ["Communication", "Behavioral Questions"],
      },
    };

    const selected = domainMap[domain];

    const aiResponse = await mockInterviewService.generateQuestions({
      role: selected.role,
      type: selected.type,
      difficulty: "medium",
      skills: selected.skills,
      count: 5,
    });

    const data = aiResponse.data?.data || aiResponse.data;

    const questions = (data.questions || []).map((q) => ({
      question: q.question,
      answer: "",
      score: 0,
      feedback: "",
    }));

    await mockInterviewService.createInterview({
      role: selected.role,
      type: selected.type,
      difficulty: "medium",
      durationMinutes: 30,
      status: "scheduled",
      questions,
      isAIGenerated: true,
    });

    toast.success("AI mock interview created!");
    await loadInterviews();
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Failed to create AI interview");
  } finally {
    setLoading(false);
  }
}

  function handleStartInterview(interview) {
    setActiveInterview(interview);

    const initialAnswers = interview.questions.map((q) => ({
      question: q.question,
      answer: "",
    }));

    setAnswers(initialAnswers);
  }

  function handleAnswerChange(index, value) {
    const updated = [...answers];

    updated[index].answer = value;

    setAnswers(updated);
  }

  async function handleSubmitInterview() {
    try {
      if (!activeInterview) return;

      setLoading(true);

      const response =
        await mockInterviewService.evaluateInterview(
          activeInterview._id,
          answers
        );

      const updatedInterview =
        response.data?.interview ||
        response.data?.data?.interview;

      toast.success("Interview evaluated by AI!");

      setActiveInterview(updatedInterview);

      loadInterviews();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "AI evaluation failed"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    try {
      await mockInterviewService.deleteInterview(id);

      toast.success("Interview cancelled");

      loadInterviews();
    } catch (error) {
      console.error(error);
      toast.error("Failed");
    }
  }

  const upcoming = interviews.filter(
    (i) => i.status === "scheduled"
  );

  const completed = interviews.filter(
    (i) => i.status === "completed"
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            AI Mock Interviews
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            Practice interviews with AI evaluation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
  <button
    onClick={() => handleCreateInterview("frontend")}
    className="btn-primary px-4 py-2 rounded-xl"
  >
    Frontend
  </button>

  <button
    onClick={() => handleCreateInterview("backend")}
    className="btn-primary px-4 py-2 rounded-xl"
  >
    Backend
  </button>

  <button
    onClick={() => handleCreateInterview("fullstack")}
    className="btn-primary px-4 py-2 rounded-xl"
  >
    Full Stack
  </button>

  <button
    onClick={() => handleCreateInterview("hr")}
    className="btn-primary px-4 py-2 rounded-xl"
  >
    HR
  </button>
</div>
      </div>

      {activeInterview && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white text-xl font-bold">
                {activeInterview.role}
              </h3>

              <p className="text-slate-400 text-sm">
                {activeInterview.type} interview
              </p>
            </div>

            {activeInterview.overallScore > 0 && (
              <div className="text-right">
                <p className="text-3xl font-bold text-brand-400">
                  {activeInterview.overallScore}/10
                </p>

                <p className="text-slate-400 text-xs">
                  AI Score
                </p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {activeInterview.questions.map((q, index) => (
              <div
                key={index}
                className="border border-surface-border rounded-2xl p-5"
              >
                <h4 className="text-white font-semibold mb-3">
                  Q{index + 1}. {q.question}
                </h4>

                {activeInterview.status !== "completed" ? (
                  <textarea
                    value={answers[index]?.answer || ""}
                    onChange={(e) =>
                      handleAnswerChange(
                        index,
                        e.target.value
                      )
                    }
                    placeholder="Write your answer..."
                    rows={5}
                    className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white"
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="bg-surface p-4 rounded-xl">
                      <p className="text-xs text-slate-400 mb-1">
                        Your Answer
                      </p>

                      <p className="text-sm text-white">
                        {q.answer}
                      </p>
                    </div>

                    <div className="bg-brand-500/5 border border-brand-500/10 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-brand-400 font-semibold">
                          AI Feedback
                        </p>

                        <span className="text-white font-bold">
                          {q.score}/10
                        </span>
                      </div>

                      <p className="text-sm text-slate-300">
                        {q.feedback}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {activeInterview.status !== "completed" && (
            <button
              onClick={handleSubmitInterview}
              disabled={loading}
              className="mt-6 btn-primary px-5 py-3 rounded-xl"
            >
              {loading
                ? "Evaluating with AI..."
                : "Submit Answers"}
            </button>
          )}

          {activeInterview.status === "completed" && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="card p-4 border border-emerald-500/10">
                <h4 className="text-emerald-400 font-semibold mb-3">
                  Strengths
                </h4>

                <ul className="space-y-2">
                  {(activeInterview.strengths || []).map(
                    (s, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-300"
                      >
                        • {s}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="card p-4 border border-amber-500/10">
                <h4 className="text-amber-400 font-semibold mb-3">
                  Weaknesses
                </h4>

                <ul className="space-y-2">
                  {(activeInterview.weaknesses || []).map(
                    (w, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-300"
                      >
                        • {w}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <h3 className="text-white font-semibold text-lg mb-4">
          Upcoming Interviews
        </h3>

        <UpcomingInterviews
          interviews={upcoming}
          onCancel={handleCancel}
          onStart={handleStartInterview}
        />
      </div>

      <div>
        <h3 className="text-white font-semibold text-lg mb-4">
          Interview History
        </h3>

        <InterviewHistory
          interviews={completed}
        />
      </div>
    </div>
  );
}

export default MockInterviewPage;