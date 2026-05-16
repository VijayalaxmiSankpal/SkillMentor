'use strict';

const buildStudyPlanPrompt = ({ targetRole, durationWeeks, hoursPerDay, currentLevel, focusAreas = [] }) => `
Create a detailed ${durationWeeks}-week study plan for someone targeting the role of **${targetRole}**.

Learner profile:
- Current level: ${currentLevel}
- Daily commitment: ${hoursPerDay} hours
- Focus areas: ${focusAreas.length ? focusAreas.join(', ') : 'general preparation'}

Requirements:
- Realistic daily/weekly breakdown
- Mix of theory, coding practice, projects, and mock interviews
- Include specific topics and resources
- Plan should ramp up in difficulty

Return ONLY valid JSON in this exact shape:
{
  "summary": "string",
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "string",
      "goals": ["string"],
      "dailyTasks": ["string"],
      "deliverables": ["string"]
    }
  ],
  "tips": ["string"]
}
`.trim();

module.exports = { buildStudyPlanPrompt };