import React from "react";
import InterviewCard from "./InterviewCard";

function UpcomingInterviews(props) {
  const interviews = props.interviews;

  if (interviews.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">No upcoming interviews</h3>
        <p className="text-gray-400 text-sm">Schedule a mock interview to start practicing!</p>
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
            onCancel={props.onCancel}
            onComplete={props.onComplete}
            showFeedback={false}
          />
        );
      })}
    </div>
  );
}

export default UpcomingInterviews;