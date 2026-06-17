import type { Resume } from "../types/resume";

export const uid = (): string => Math.random().toString(36).slice(2, 10);

/** Empty starter resume. Guidance belongs in placeholders, not saved data. */
export function emptyResume(): Resume {
  return {
    basics: {
      firstName: "",
      lastName: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      extra: "",
      photo: ""
    },
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    interests: [],
    publications: [],
    achievements: [],
    customSections: []
  };
}

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

/** Merge a partial/loaded resume onto a complete default — ported from normalizeResume(). */
export function normalizeResume(resume: Partial<Resume> | null | undefined): Resume {
  const base = emptyResume();
  return Object.assign(base, clone(resume || {}), {
    basics: Object.assign(base.basics, (resume && resume.basics) || {})
  });
}
