// JSON Resume standard (jsonresume.org) importer.
import type { Resume } from "../../types/resume";
import { emptyResume, uid } from "../defaults";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

export function importJsonResume(input: string | Record<string, unknown>): Resume {
  const src: Any = typeof input === "string" ? JSON.parse(input) : input;
  const resume = emptyResume();

  const basics: Any = src.basics || {};
  const [firstName = "", ...rest] = (basics.name || "").trim().split(/\s+/);
  resume.basics = {
    firstName,
    lastName: rest.join(" "),
    headline: basics.label || "",
    email: basics.email || "",
    phone: basics.phone || "",
    location: typeof basics.location === "string" ? basics.location : [basics.location?.city, basics.location?.countryCode].filter(Boolean).join(", "),
    website: basics.url || "",
    linkedin: (basics.profiles || []).find((p: Any) => /linkedin/i.test(p.network || ""))?.url || "",
    extra: basics.summary ? "" : "",
    photo: basics.image || basics.picture || ""
  };
  resume.summary = basics.summary || "";

  resume.experience = (src.work || []).map((w: Any) => ({
    id: uid(),
    hidden: false,
    organization: w.name || w.company || "",
    title: w.position || "",
    location: w.location || "",
    period: [w.startDate, w.endDate || "Present"].filter(Boolean).join(" – "),
    bullets: Array.isArray(w.highlights) ? w.highlights : []
  }));

  resume.education = (src.education || []).map((e: Any) => ({
    id: uid(),
    hidden: false,
    organization: e.institution || "",
    degree: [e.studyType, e.area].filter(Boolean).join(", "),
    period: [e.startDate, e.endDate].filter(Boolean).join(" – "),
    location: "",
    description: e.score ? `GPA: ${e.score}` : ""
  }));

  resume.skills = (src.skills || []).map((s: Any) => ({
    id: uid(),
    hidden: false,
    name: s.name || "",
    level: s.level || "",
    keywords: Array.isArray(s.keywords) ? s.keywords : []
  }));

  resume.projects = (src.projects || []).map((p: Any) => ({
    id: uid(),
    hidden: false,
    name: p.name || "",
    period: p.startDate || "",
    website: p.url || "",
    bullets: Array.isArray(p.highlights) ? p.highlights : [p.description].filter(Boolean)
  }));

  resume.certifications = (src.certificates || src.awards || []).map((c: Any) => ({
    id: uid(),
    hidden: false,
    title: c.title || c.name || "",
    issuer: c.awarder || c.issuer || "",
    date: c.date || "",
    description: c.summary || ""
  }));

  resume.languages = (src.languages || []).map((l: Any) => ({
    id: uid(),
    hidden: false,
    language: l.language || "",
    fluency: l.fluency || "",
    level: ""
  }));

  resume.interests = (src.interests || []).map((i: Any) => ({
    id: uid(),
    hidden: false,
    name: i.name || "",
    keywords: Array.isArray(i.keywords) ? i.keywords : []
  }));

  resume.publications = (src.publications || []).map((p: Any) => ({
    id: uid(),
    hidden: false,
    title: p.name || "",
    publisher: p.publisher || "",
    date: p.releaseDate || "",
    description: p.summary || ""
  }));

  return resume;
}
