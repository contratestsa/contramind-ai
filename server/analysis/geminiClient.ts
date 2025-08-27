import { GoogleGenAI } from "@google/genai";

// Automatically picks Vertex AI if GOOGLE_GENAI_USE_VERTEXAI=true
// or AI Studio if AI_GEMINI_API_KEY is present.
export function makeGemini() {
  return new GoogleGenAI({ apiKey: process.env.AI_GEMINI_API_KEY });
}
