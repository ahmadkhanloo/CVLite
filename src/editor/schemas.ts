import type { ArraySectionKey } from "../types/resume";
import type { TranslationKey } from "../i18n/dictionaries";

export interface SectionSchema {
  titleKey: TranslationKey;
  fields: Array<[field: string, labelKey: TranslationKey]>;
  textarea?: Array<[field: string, labelKey: TranslationKey]>;
  list?: string;
}

// Ported from getSchemas() in legacy app.js. Labels are translation keys.
export const SECTION_SCHEMAS: Record<ArraySectionKey, SectionSchema> = {
  experience: {
    titleKey: "experience",
    fields: [["organization", "organization"], ["title", "roleTitle"], ["period", "period"], ["location", "location"]],
    list: "bullets"
  },
  education: {
    titleKey: "education",
    fields: [["organization", "organization"], ["degree", "degree"], ["period", "period"], ["location", "location"]],
    textarea: [["description", "description"]]
  },
  skills: {
    titleKey: "skills",
    fields: [["name", "skillGroup"], ["level", "level"]],
    list: "keywords"
  },
  projects: {
    titleKey: "projects",
    fields: [["name", "projectName"], ["period", "period"], ["website", "link"]],
    list: "bullets"
  },
  certifications: {
    titleKey: "certifications",
    fields: [["title", "title"], ["issuer", "issuer"], ["date", "date"]],
    textarea: [["description", "description"]]
  },
  languages: {
    titleKey: "languages",
    fields: [["language", "languageName"], ["fluency", "fluency"], ["level", "numericLevel"]]
  },
  interests: {
    titleKey: "interests",
    fields: [["name", "projectName"]],
    list: "keywords"
  },
  publications: {
    titleKey: "publications",
    fields: [["title", "title"], ["publisher", "publisher"], ["date", "date"]],
    textarea: [["description", "description"]]
  },
  achievements: {
    titleKey: "achievements",
    fields: [["title", "title"]],
    textarea: [["description", "description"]]
  }
};

export const SECTION_ORDER: ArraySectionKey[] = [
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "interests",
  "publications",
  "achievements"
];
