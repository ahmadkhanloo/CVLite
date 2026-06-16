import type { Resume } from "../../types/resume";
import { emptyResume, uid } from "../defaults";
import { compact, normalizeBullets, splitName, textFromRich } from "../text";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

function mapItems<T>(section: Any, mapper: (item: Any) => T): T[] {
  return ((section && section.items) || []).map(mapper);
}

/** Import an RxResume-format export into our Resume model. Ported from normalizeRxResume(). */
export function normalizeRxResume(input: string | Record<string, unknown>): Resume {
  const source: Any = typeof input === "string" ? JSON.parse(input) : input;
  const resume = emptyResume();
  const basics: Any = source.basics || {};
  const name = splitName(basics.name || "");

  resume.basics = {
    firstName: name.firstName || resume.basics.firstName,
    lastName: name.lastName || resume.basics.lastName,
    headline: basics.headline || "",
    email: basics.email || "",
    phone: basics.phone || "",
    location: basics.location || "",
    website: basics.website || "",
    linkedin: "",
    extra: "",
    photo: source.picture?.url || source.picture || basics.picture || ""
  };

  const profiles: Any[] = source.sections?.profiles?.items || [];
  const linkedIn = profiles.find((profile) => /linkedin/i.test(profile.network || "")) || profiles[0];
  if (linkedIn) resume.basics.linkedin = linkedIn.username || linkedIn.website || "";
  if (Array.isArray(basics.customFields)) {
    resume.basics.extra = basics.customFields.map((field: Any) => field.value || field.name).filter(Boolean).join(" · ");
  }

  resume.summary = textFromRich(source.summary);
  const sections: Any = source.sections || {};

  resume.experience = mapItems(sections.experience, (item) => ({
    id: item.id || uid(),
    hidden: item.hidden === true,
    title: item.position || "",
    organization: item.company || "",
    location: item.location || "",
    period: item.period || "",
    bullets: normalizeBullets(item.description).concat((item.roles || []).map((role: Any) => role.name || role).filter(Boolean))
  }));

  resume.education = mapItems(sections.education, (item) => ({
    id: item.id || uid(),
    hidden: item.hidden === true,
    degree: compact([item.degree, item.area]),
    organization: item.school || "",
    location: item.location || "",
    period: item.period || "",
    description: textFromRich(item.description || item.grade)
  }));

  resume.projects = mapItems(sections.projects, (item) => ({
    id: item.id || uid(),
    hidden: item.hidden === true,
    name: item.name || "",
    period: item.period || "",
    website: item.website || "",
    bullets: normalizeBullets(item.description)
  }));

  resume.skills = mapItems(sections.skills, (item) => ({
    id: item.id || uid(),
    hidden: item.hidden === true,
    name: item.name || "",
    level: item.proficiency || item.level || "",
    keywords: Array.isArray(item.keywords) ? item.keywords : normalizeBullets(item.keywords)
  }));

  resume.languages = mapItems(sections.languages, (item) => ({
    id: item.id || uid(),
    hidden: item.hidden === true,
    language: item.language || "",
    fluency: item.fluency || "",
    level: item.level || ""
  }));

  resume.interests = mapItems(sections.interests, (item) => ({
    id: item.id || uid(),
    hidden: item.hidden === true,
    name: item.name || "",
    keywords: Array.isArray(item.keywords) ? item.keywords : []
  }));

  resume.certifications = mapItems(sections.certifications, (item) => ({
    id: item.id || uid(),
    hidden: item.hidden === true,
    title: item.title || "",
    issuer: item.issuer || "",
    date: item.date || "",
    description: textFromRich(item.description)
  }));

  resume.publications = mapItems(sections.publications, (item) => ({
    id: item.id || uid(),
    hidden: item.hidden === true,
    title: item.title || "",
    publisher: item.publisher || "",
    date: item.date || "",
    description: textFromRich(item.description)
  }));

  resume.customSections = (source.customSections || []).map((section: Any) => ({
    id: section.id || uid(),
    title: section.name || section.title || "Custom Section",
    hidden: section.hidden === true,
    items: (section.items || []).map((item: Any) => ({
      id: item.id || uid(),
      hidden: item.hidden === true,
      title: item.name || item.title || "",
      subtitle: item.subtitle || item.organization || "",
      period: item.period || item.date || "",
      bullets: normalizeBullets(item.description || item.summary)
    }))
  }));

  return resume;
}
