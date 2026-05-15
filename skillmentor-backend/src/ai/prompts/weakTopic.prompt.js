'use strict';

const buildWeakTopicPrompt = ({ codingSummary, interviewWeak }) => `
Analyze this learner's progress data and identify weak areas, then suggest a focused improvement plan.

CODING ACTIVITY SUMMARY:
${JSON.stringify(codingSummary, null, 2)}

WEAK INTERVIEW TOPICS (confidence <= 2 out of 5):
${JSON.stringify(interviewWeak, null, 2)}

Provide a detailed analysis. Return ONLY valid JSON in this exact shape:
{
  "weakAreas": [
    { "area": "string", "reason": "string", "priority": "high" | "medium" | "low" }
  ],
  "recommendations": [
    { "title": "string", "action": "string", "resources": ["string"] }
  ],
  "revisionPlan": {
    "week1": ["string"],
    "week2": ["string"]
  },
  "motivationalNote": "string"
}
`.trim();

module.exports = { buildWeakTopicPrompt };