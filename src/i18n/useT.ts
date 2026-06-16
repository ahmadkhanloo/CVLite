import { useCallback } from "react";
import { useSettings } from "../store/settings";
import { translate, type TranslationKey } from "./dictionaries";

/** Returns a translate function bound to the current language. */
export function useT() {
  const language = useSettings((s) => s.language);
  return useCallback((key: TranslationKey) => translate(language, key), [language]);
}
