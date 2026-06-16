// JSON Resume standard (jsonresume.org) exporter.
import type { Resume } from "../../types/resume";
import { normalizeResume } from "../defaults";
import { itemVisible } from "../text";

export function exportJsonResume(resume: Partial<Resume>): string {
  const r = normalizeResume(resume);
  const doc = {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: [r.basics.firstName, r.basics.lastName].filter(Boolean).join(" "),
      label: r.basics.headline,
      image: r.basics.photo,
      email: r.basics.email,
      phone: r.basics.phone,
      url: r.basics.website,
      summary: r.summary,
      location: { address: r.basics.location },
      profiles: r.basics.linkedin ? [{ network: "LinkedIn", url: r.basics.linkedin, username: r.basics.linkedin }] : []
    },
    work: r.experience.filter(itemVisible).map((e) => ({
      name: e.organization,
      position: e.title,
      location: e.location,
      startDate: e.period?.split(/\s*[–\-]\s*/)[0] || "",
      endDate: e.period?.split(/\s*[–\-]\s*/)[1] || "",
      highlights: e.bullets
    })),
    education: r.education.filter(itemVisible).map((e) => ({
      institution: e.organization,
      area: e.degree,
      studyType: "",
      startDate: e.period?.split(/\s*[–\-]\s*/)[0] || "",
      endDate: e.period?.split(/\s*[–\-]\s*/)[1] || ""
    })),
    skills: r.skills.filter(itemVisible).map((s) => ({
      name: s.name,
      level: s.level,
      keywords: s.keywords
    })),
    languages: r.languages.filter(itemVisible).map((l) => ({
      language: l.language,
      fluency: l.fluency
    })),
    interests: r.interests.filter(itemVisible).map((i) => ({
      name: i.name,
      keywords: i.keywords
    })),
    projects: r.projects.filter(itemVisible).map((p) => ({
      name: p.name,
      url: p.website,
      highlights: p.bullets
    })),
    certificates: r.certifications.filter(itemVisible).map((c) => ({
      name: c.title,
      issuer: c.issuer,
      date: c.date,
      summary: c.description
    })),
    publications: r.publications.filter(itemVisible).map((p) => ({
      name: p.title,
      publisher: p.publisher,
      releaseDate: p.date,
      summary: p.description
    }))
  };
  return JSON.stringify(doc, null, 2);
}
