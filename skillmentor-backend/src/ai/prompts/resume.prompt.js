'use strict';

const buildResumePrompt = ({ resumeText, targetRole }) => `
You are an expert ATS (Applicant Tracking System) and senior tech recruiter.

Analyze the following resume ${targetRole ? `for the role of **${targetRole}**` : ''}.

RESUME CONTENT:
"""
${resumeText}
"""

Evaluate the resume on:
1. ATS compatibility (formatting, keywords, structure)
2. Clarity and impact of bullet points
3. Quantified achievements
4. Skill relevance ${targetRole ? `for ${targetRole}` : ''}
5. Missing critical sections or keywords

Return ONLY valid JSON in this exact shape:
{
  "atsScore": 0-100,
  "summary": "string (2-3 sentences)",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "suggestions": ["string (specific, actionable)"],
  "missingKeywords": ["string"]
}
`.trim();

module.exports = { buildResumePrompt };