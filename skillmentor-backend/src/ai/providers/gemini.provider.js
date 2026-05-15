'use strict';

const { groq } = require('../../config/ai.config');
const ApiError = require('../../utils/ApiError');
const logger = require('../../utils/logger');

const generateText = async (prompt) => {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.log("GROQ ERROR:", error);
    logger.error(`Groq generateText failed: ${error.message}`);
    throw ApiError.internal('AI service temporarily unavailable');
  }
};

const generateChat = async (history, userMessage) => {
  try {
    const messages = [
      ...history,
      {
        role: 'user',
        content: userMessage,
      },
    ];

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.log("GROQ ERROR:", error);
    logger.error(`Groq generateChat failed: ${error.message}`);
    throw ApiError.internal('AI service temporarily unavailable');
  }
};

const generateJSON = async (prompt) => {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `${prompt}
          
IMPORTANT:
- Return ONLY valid JSON
- Do NOT use markdown
- Do NOT wrap in \`\`\`
- No explanations
- No extra text`,
        },
      ],
    });

    const raw = response.choices[0].message.content;

    console.log("RAW AI RESPONSE:", raw);

    // Remove markdown if AI still sends it
    const cleaned = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.log("GROQ ERROR:", error);
    logger.error(`Groq generateJSON failed: ${error.message}`);
    throw ApiError.internal('AI service temporarily unavailable');
  }
};

module.exports = {
  generateText,
  generateChat,
  generateJSON,
};