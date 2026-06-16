import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AIProvider, AISettings } from "../types/ai";

interface AIState extends AISettings {
  setProvider: (provider: AIProvider) => void;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  clear: () => void;
}

export const useAI = create<AIState>()(
  persist(
    (set) => ({
      provider: "anthropic",
      apiKey: "",
      model: "",
      setProvider: (provider) => set({ provider }),
      setApiKey: (apiKey) => set({ apiKey }),
      setModel: (model) => set({ model }),
      clear: () => set({ apiKey: "", model: "" })
    }),
    { name: "cvlite.ai.v1" }
  )
);
