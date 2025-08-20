import { google } from "@ai-sdk/google";
import { generateText } from "ai";

// src/geminiClient.ts
import { GoogleGenAI } from "@google/genai";

export function makeGemini() {
  // Automatically picks Vertex AI if GOOGLE_GENAI_USE_VERTEXAI=true
  // or AI Studio if GEMINI_API_KEY is present.  [oai_citation:4‡GitHub](https://github.com/googleapis/js-genai)
  return new GoogleGenAI();
}
