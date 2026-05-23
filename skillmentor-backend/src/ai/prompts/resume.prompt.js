'use strict';

const buildResumePrompt = ({ resumeText, targetRole }) => `
You are an expert ATS resume reviewer and senior tech recruiter.

Analyze this resume ${targetRole ? `for the role of ${targetRole}` : ''}.

RESUME CONTENT:
"""
${resumeText}
"""

Return ONLY valid JSON in this exact shape:

{
  "atsScore": 0,
  "summary": "2-3 sentence overall feedback",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestions": ["specific improvement 1", "specific improvement 2"],
  "matchedKeywords": ["keyword found in resume"],
  "missingKeywords": ["important missing keyword"],
  "sections": [
    {
      "name": "Contact Information",
      "score": 0,
      "status": "good",
      "feedback": "short feedback"
    },
    {
      "name": "Summary",
      "score": 0,
      "status": "warning",
      "feedback": "short feedback"
    },
    {
      "name": "Skills",
      "score": 0,
      "status": "good",
      "feedback": "short feedback"
    },
    {
      "name": "Projects",
      "score": 0,
      "status": "warning",
      "feedback": "short feedback"
    },
    {
      "name": "Education",
      "score": 0,
      "status": "good",
      "feedback": "short feedback"
    }
  ]
}

Rules:
- atsScore must be between 0 and 100.
- section score must be between 0 and 100.
- section status must be only: good, warning, error.
- suggestions must be practical and specific.
- matchedKeywords should include skills/tools already present in resume.
- missingKeywords should include useful keywords for the target role.
`.trim();

module.exports = { buildResumePrompt };