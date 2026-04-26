require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // We can't directly list models easily with the current SDK without a different client
        // but we can try a fallback model like 'gemini-1.0-pro'
        console.log("Trying gemini-1.0-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await model.generateContent("Test");
        console.log("Success with gemini-1.0-pro!");
    } catch (error) {
        console.error("Failed with gemini-1.0-pro:", error.message);
    }
}

listModels();
