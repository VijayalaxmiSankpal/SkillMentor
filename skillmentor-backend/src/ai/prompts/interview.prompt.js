'use strict';

const buildInterviewPrompt = ({ role, type, difficulty, skills = [], count = 10 }) => `
Generate exactly ${count} ${difficulty}-level **${type}** interview questions for the role of **${role}**.
${skills.length ? `Focus areas: ${skills.join(', ')}.` : ''}

Requirements:
- Questions must be realistic and asked in actual interviews
- Mix conceptual and applied questions
- For technical questions, include scenario-based ones
- Avoid duplicates

Return ONLY valid JSON in this exact shape:
{
  "questions": [
    {
      "question": "string",
      "category": "string",
      "difficulty": "easy" | "medium" | "hard",
      "expectedTopics": ["string"]
    }
  ]
}
`.trim();

module.exports = { buildInterviewPrompt };