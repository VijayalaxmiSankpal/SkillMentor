import React from "react";
import InterviewCard from "./InterviewCard";

function InterviewHistory(props) {
  const interviews = props.interviews;

  if (interviews.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">No interview history</h3>
        <p className="text-gray-400 text-sm">Complete your first mock interview to see it here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {interviews.map(function (interview) {
        return (
          <InterviewCard
            key={interview.id}
            interview={interview}
            onShowFeedback={props.onShowFeedback}
            showActions={interview.status === "scheduled" && interview.date < new Date().toISOString().split("T")[0] ? true : false}
          />
        );
      })}
    </div>
  );
}

export default InterviewHistory;