'use strict';

const { groq } = require('../../config/ai.config');
const ApiError = require('../../utils/ApiError');
const logger = require('../../utils/logger');

const cleanJsonString = (raw) => {
  if (!raw) return '';

  let cleaned = raw
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  cleaned = cleaned
    .replace(/[\u0000-\u001F]+/g, ' ')
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    .trim();

  return cleaned;
};

const safeParseJSON = (raw) => {
  const cleaned = cleanJsonString(raw);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.log('FAILED CLEANED JSON:', cleaned);
    throw error;
  }
};

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
    console.log('GROQ ERROR:', error);
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
    console.log('GROQ ERROR:', error);
    logger.error(`Groq generateChat failed: ${error.message}`);
    throw ApiError.internal('AI service temporarily unavailable');
  }
};

const generateJSON = async (prompt) => {
  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0,
        messages: [
          {
            role: 'system',
            content:
              'You are a strict JSON API. Return only valid JSON. No markdown. No explanation. No unescaped newlines inside strings.',
          },
          {
            role: 'user',
            content: `${prompt}

IMPORTANT:
Return ONLY valid JSON.
Use double quotes for all keys and string values.
Do NOT use markdown.
Do NOT wrap in code fences.
Do NOT add explanations.
Do NOT include raw line breaks inside string values.`,
          },
        ],
      });

      const raw = response.choices[0].message.content;

      console.log(`RAW AI RESPONSE attempt ${attempt}:`, raw);

      return safeParseJSON(raw);
    } catch (error) {
      lastError = error;

      console.log(`GROQ JSON ERROR attempt ${attempt}:`, error.message);

      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    }
  }

  logger.error(`Groq generateJSON failed after retries: ${lastError.message}`);
  throw ApiError.internal('AI service temporarily unavailable');
};

module.exports = {
  generateText,
  generateChat,
  generateJSON,
};