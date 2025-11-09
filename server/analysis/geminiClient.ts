import { GoogleGenAI } from "@google/genai";

// Initialize Google Gemini AI with the API key
export function makeGemini() {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.error("GOOGLE_API_KEY is not configured!");
    throw new Error("Google API key is required for AI analysis");
  }
  
  console.log("Initializing Google Gemini with API key...");
  return new GoogleGenAI({ apiKey: apiKey });
}
