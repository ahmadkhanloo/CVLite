export type AIProvider = "anthropic" | "openai";

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}
