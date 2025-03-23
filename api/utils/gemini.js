const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load your API key from env or paste directly
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Or hardcode for testing

async function runGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    console.log("Gemini Response:", response);
    return response;
  } catch (err) {
    console.error("Gemini Error:", err.message);
    return "❌ Gemini failed";
  }
}

module.exports = runGemini;
