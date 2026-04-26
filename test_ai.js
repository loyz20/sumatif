require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");

async function testAI() {
    console.log("Testing Gemini-2.5 API with Key:", process.env.GEMINI_API_KEY ? "FOUND" : "NOT FOUND");
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Halo, apakah kamu aktif?",
        });

        console.log("Response:", response.text);
        console.log("TEST SUCCESSFUL!");
    } catch (error) {
        console.error("TEST FAILED:", error.message);
    }
}

testAI();
