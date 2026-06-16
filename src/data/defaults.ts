import type { Resume } from "../types/resume";

export const uid = (): string => Math.random().toString(36).slice(2, 10);

/** Default starter resume — ported from emptyResume() in legacy resume-core.js. */
export function emptyResume(): Resume {
  return {
    basics: {
      firstName: "Arash",
      lastName: "Rezaei",
      headline: "Product Manager | Data Analyst | AI Solutions",
      email: "arash.rezaei@example.com",
      phone: "+98-912-000-0000",
      location: "Tehran, Iran",
      website: "",
      linkedin: "arash-rezaei",
      extra: "",
      photo: ""
    },
    summary:
      "Product-minded professional with experience in data analysis, stakeholder communication, and building practical digital tools. Skilled at turning user needs into clear requirements, structured workflows, and polished deliverables.",
    skills: [
      { id: uid(), hidden: false, name: "Product Skills", level: "", keywords: ["Product Discovery", "Roadmapping", "Requirements Writing"] },
      { id: uid(), hidden: false, name: "Technical Skills", level: "", keywords: ["Data Analysis", "Prototyping", "Automation"] },
      { id: uid(), hidden: false, name: "Professional Skills", level: "", keywords: ["Stakeholder Communication", "Team Coordination", "Documentation"] }
    ],
    experience: [
      {
        id: uid(),
        hidden: false,
        title: "Product Specialist",
        organization: "Sample Technology Studio",
        location: "Tehran",
        period: "2024 - Present",
        bullets: ["Defined product requirements, coordinated delivery tasks, and prepared stakeholder-facing documentation."]
      }
    ],
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
