import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "../i18n/dictionaries";

export type ThemeMode = "system" | "light" | "dark";

interface SettingsState {
  language: Language;
  theme: ThemeMode;
  setLanguage: (language: Language) => void;
  setTheme: (theme: ThemeMode) => void;
}

function detectLanguage(): Language {
  return typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("fa") ? "fa" : "en";
}

// One-time read of the legacy settings key written by the vanilla app.
function legacySettings(): Partial<SettingsState> {
  try {
    const saved = JSON.parse(localStorage.getItem("cvlite.settings.v1") || "{}");
    return { language: saved.language, theme: saved.theme };
  } catch {
    return {};
  }
}

const legacy = typeof localStorage !== "undefined" ? legacySettings() : {};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      language: (legacy.language as Language) || detectLanguage(),
      theme: (legacy.theme as ThemeMode) || "system",
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme })
    }),
    { name: "cvlite.settings.v2" }
  )
);
