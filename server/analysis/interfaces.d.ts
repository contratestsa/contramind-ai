export type TExtractedData =
  | string
  | Record<string, unknown>
  | Array<string | Record<string, unknown>>;

export type TSupportedModels = "gemini-2.5-pro" | "gemini-2.5-flash";
export type TAnalisysResponse = "application/json" | "text/plain";

export interface AnalyzeOptions {
  model?: TSupportedModels;
  system?: string; // High-level instruction for the agent
  prompt: string; // Task-specific instruction
  responseMimeType?: TAnalisysResponse;
  responseSchema?: unknown; // JSON Schema if you want structured output
  thinking?: {
    budgetTokens?: number;
  };
}
