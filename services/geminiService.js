const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini client using the API key from environment variables.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

/**
 * Sends a prompt to the Gemini API and returns the raw text response.
 * @param {string} prompt - The fully constructed prompt string.
 * @returns {Promise<string>} - The raw text returned by Gemini.
 */
const generateContent = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw new Error('Failed to generate AI content. Please try again later.');
  }
};

/**
 * Cleans a raw Gemini text response and parses it as JSON.
 * Gemini sometimes wraps JSON in markdown code fences, so we strip those first.
 * @param {string} rawText
 * @returns {object}
 */
const parseJSONResponse = (rawText) => {
  try {
    const cleaned = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('JSON Parse Error:', error.message, '\nRaw text:', rawText);
    throw new Error('Failed to parse AI response as JSON.');
  }
};

module.exports = { generateContent, parseJSONResponse };
