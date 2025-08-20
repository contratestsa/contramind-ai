import { makeGemini } from "./geminiClient";
import type { IAnalyzeOptions, TExtractedData } from "./interfaces";

function normalizeContent(data: TExtractedData) {
  if (Array.isArray(data)) {
    return data
      .map((d) => (typeof d === "string" ? d : JSON.stringify(d, null, 2)))
      .join("\n---\n");
  }
  return typeof data === "string" ? data : JSON.stringify(data, null, 2);
}

export async function analyzeWithGemini(
  data: TExtractedData,
  opts: IAnalyzeOptions,
) {
  const ai = makeGemini();
  const model = opts.model ?? "gemini-2.5-pro";
  const system =
    opts.system ?? "Analyze the provided contract as an expert lawyer.";
  const userPrompt = opts.prompt;
  const payload = normalizeContent(data);

  const response = await ai.models.generateContent({
    model,
    // The SDK accepts simple strings; it will wrap into proper Content[].
    // For structured schemas and JSON output, pass response_mime_type + schema.  [oai_citation:5‡GitHub](https://github.com/googleapis/js-genai) [oai_citation:6‡Google AI for Developers](https://ai.google.dev/gemini-api/docs/text-generation?utm_source=chatgpt.com)
    contents: [
      { role: "user", parts: [{ text: `${userPrompt}\n\nDATA:\n${payload}` }] },
    ],
    config: {
      systemInstruction: system,
      responseMimeType: opts.responseMimeType ?? "application/json",
      responseSchema: opts.responseSchema, // JSON Schema object (optional)
      // Some 2.x models allow thinking budget configuration (varies by model).  [oai_citation:7‡Google AI for Developers](https://ai.google.dev/gemini-api/docs/models?utm_source=chatgpt.com)
      thinkingConfig: opts.thinking?.budgetTokens
        ? { budgetTokens: opts.thinking.budgetTokens }
        : undefined,
    },
  });

  // SDK provides a convenient .text; if JSON requested, prefer .text then parse.
  const text = response.text;
  if ((opts.responseMimeType ?? "application/json") === "application/json") {
    try {
      return JSON.parse(text);
    } catch {
      // Fall back to raw text if model didn’t fully comply
      return { _raw: text };
    }
  }
  return text;
}
