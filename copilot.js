const axios = require("axios");

/**
 * Sends a text prompt to the OpenAI API and returns the generated code snippet.
 * @param {string} prompt - The recognized speech or coding request.
 * @returns {Promise<string>} - The generated code snippet as plain text.
 */
async function getCodeFromPrompt(prompt) {
  const apiKey = process.env.OPENAI_API_KEY; // Set your API key in env
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`
  };

  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are GitHub Copilot. Generate code snippets only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 512,
    temperature: 0.2,
  };
  
  const response = await axios.post(apiUrl, data, { headers });
  const code = response.data.choices[0].message.content;
  return code;
}

module.exports = { getCodeFromPrompt };
