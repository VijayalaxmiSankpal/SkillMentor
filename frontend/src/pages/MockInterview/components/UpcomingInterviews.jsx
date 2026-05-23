import React from "react";
import InterviewCard from "./InterviewCard";

function UpcomingInterviews(props) {
  const interviews = props.interviews || [];

  if (interviews.length === 0) {
    return (
      <div className="card p-12 text-center">
        <h3 className="text-lg font-semibold text-white mb-1">
          No upcoming interviews
        </h3>
        <p className="text-gray-400 text-sm">
          Create a mock interview to start practicing.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {interviews.map((interview) => (
        <InterviewCard
          key={interview._id || interview.id}
          interview={{
            ...interview,
            id: interview._id || interview.id,
            date: interview.scheduledAt
              ? new Date(interview.scheduledAt).toISOString().split("T")[0]
              : interview.date || "",
            time: interview.scheduledAt
              ? new Date(interview.scheduledAt).toTimeString().slice(0, 5)
              : interview.time || "",
            duration: interview.durationMinutes || interview.duration || 30,
          }}
          onStart={props.onStart}
          onCancel={props.onCancel}
          showFeedback={false}
        />
      ))}
    </div>
  );
}

export default UpcomingInterviews;