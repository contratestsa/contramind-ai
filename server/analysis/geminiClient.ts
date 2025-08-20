import { GoogleGenAI } from "@google/genai";

// Automatically picks Vertex AI if GOOGLE_GENAI_USE_VERTEXAI=true
// or AI Studio if GEMINI_API_KEY is present.  [oai_citation:4‡GitHub](https://github.com/googleapis/js-genai)
export function makeGemini() {
  return new GoogleGenAI();
}
