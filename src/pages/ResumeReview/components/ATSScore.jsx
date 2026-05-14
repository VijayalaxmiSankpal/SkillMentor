import React from "react";

function ATSScore(props) {
  const score = props.score;

  let colorClass = "text-rose-400";
  let bgClass = "bg-rose-500";
  let label = "Needs Work";

  if (score >= 80) {
    colorClass = "text-emerald-400";
    bgClass = "bg-emerald-500";
    label = "Excellent";
  } else if (score >= 60) {
    colorClass = "text-amber-400";
    bgClass = "bg-amber-500";
    label = "Good";
  }

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#1e1e35"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={colorClass + " transition-all duration-1000"}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={"text-2xl font-bold " + colorClass}>{score}</span>
            <span className="text-gray-500 text-xs">/100</span>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-white font-semibold text-base mb-1">ATS Compatibility Score</h3>
          <p className={"text-sm font-medium mb-2 " + colorClass}>{label}</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            This score indicates how well your resume will perform with Applicant Tracking Systems.
            Higher scores mean better chances of getting past automated filters.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ATSScore;