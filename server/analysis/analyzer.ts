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

export async function analyzeContract(
  data: TExtractedData,
  opts: IAnalyzeOptions,
) {
  const ai = makeGemini();
  const {
    prompt: userPrompt,
    responseType = "application/json",
    responseSchema = "JSON",
    thinking,
  } = opts;

  const model = process.env.AI_ACTIVE_MODEL ?? "gemini-2.5-pro";
  const system =
    opts.system ?? "Analyze the provided contract as an expert lawyer.";

  const payload = normalizeContent(data);
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${userPrompt}\n\nDATA:\n${payload}`,
          },
        ],
      },
    ],
    config: {
      systemInstruction: system,
      responseMimeType: responseType,
      responseSchema: responseSchema,
      thinkingConfig: thinking,
    },
  });

  // SDK provides a convenient .text; if JSON requested, prefer .text then parse.
  const text = response.text ?? "";
  if (responseType === "application/json") {
    try {
      return JSON.parse(text);
    } catch {
      return { _raw: text };
    }
  }
  return text;
}
