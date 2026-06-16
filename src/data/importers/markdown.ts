import type { CustomItem, CustomSection, Resume } from "../../types/resume";
import { emptyResume, uid } from "../defaults";
import { cleanMd, splitName } from "../text";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const SECTION_TITLES: Record<string, string> = {
  experience: "EXPERIENCE",
  education: "EDUCATION",
  projects: "PROJECTS",
  certifications: "COURSES",
  languages: "LANGUAGES",
  interests: "INTERESTS",
  publications: "PUBLICATIONS",
  achievements: "ACHIEVEMENTS",
  skills: "SKILLS"
};

function classifySection(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("summary")) return "summary";
  if (t.includes("experience") || t.includes("professional")) return "experience";
  if (t.includes("education")) return "education";
  if (t.includes("project") || t.includes("product work")) return "projects";
  if (t.includes("skill")) return "skills";
  if (t.includes("language")) return "languages";
  if (t.includes("interest")) return "interests";
  if (t.includes("publication") || t.includes("output")) return "publications";
  if (t.includes("certification") || t.includes("course") || t.includes("training") || t.includes("workshop")) return "certifications";
  if (t.includes("achievement")) return "achievements";
  return "custom";
}

function parseHeadingItem(text: string): Any {
  const parts = cleanMd(text).split(/\s+—\s+|\s+-\s+/);
  return {
    id: uid(),
    hidden: false,
    title: parts.slice(1).join(" - ") || parts[0] || "",
    organization: parts[0] || "",
    period: "",
    location: "",
    bullets: [] as string[]
  };
}

function parseMeta(text: string): { period: string; location: string } {
  const parts = cleanMd(text).split("|").map((part) => part.trim()).filter(Boolean);
  return { period: parts[0] || "", location: parts[1] || "" };
}

function addCustom(resume: Resume, key: string, title: string, item: CustomItem): void {
  const sectionTitle = title || SECTION_TITLES[key] || "Custom Section";
  let section: CustomSection | undefined = resume.customSections.find((entry) => entry.title === sectionTitle);
  if (!section) {
    section = { id: uid(), hidden: false, title: sectionTitle, items: [] };
    resume.customSections.push(section);
  }
  section.items.push(item);
}

function pushParsedItem(resume: Resume, key: string, item: Any): void {
  const meta = parseMeta(item.meta || "");
  if (key === "experience") {
    resume.experience.push({ id: item.id, hidden: false, title: item.title, organization: item.organization, period: meta.period || item.period, location: meta.location || item.location, bullets: item.bullets });
  } else if (key === "education") {
    resume.education.push({ id: item.id, hidden: false, degree: item.title || item.description || "", organization: item.organization, period: meta.period || "", location: meta.location || "", description: item.description || "" });
  } else if (key === "projects") {
    resume.projects.push({ id: item.id, hidden: false, name: item.organization || item.title, period: meta.period || "", website: "", bullets: item.bullets });
  } else if (key === "publications") {
    resume.publications.push({ id: item.id, hidden: false, title: item.organization || item.title, publisher: item.title || "", date: meta.period || "", description: item.bullets.join(" ") || item.description || "" });
  } else {
    addCustom(resume, key, key === "custom" ? "Custom Section" : SECTION_TITLES[key], {
      id: item.id,
      hidden: false,
      title: item.organization || item.title,
      subtitle: item.title || "",
      period: meta.period || "",
      bullets: item.bullets
    });
  }
}

function pushLooseLine(resume: Resume, key: string, line: string, title: string): void {
  if (key === "skills") {
    const [name, rest] = line.split(":");
    resume.skills.push({ id: uid(), hidden: false, name: name.trim(), level: "", keywords: rest ? rest.split(",").map((x) => x.trim()).filter(Boolean) : [line] });
  } else if (key === "languages") {
    cleanMd(line).split(/[·|,]/).map((x) => x.trim()).filter(Boolean).forEach((language) => {
      const [name, fluency] = language.split(":");
      resume.languages.push({ id: uid(), hidden: false, language: name.trim(), fluency: (fluency || "").trim(), level: "" });
    });
  } else if (key === "interests") {
    cleanMd(line).split(/[·|,]/).map((x) => x.trim()).filter(Boolean).forEach((name) => {
      resume.interests.push({ id: uid(), hidden: false, name, keywords: [] });
    });
  } else if (key === "certifications") {
    const [certTitle, issuerDate] = line.split("—");
    resume.certifications.push({ id: uid(), hidden: false, title: certTitle.trim(), issuer: (issuerDate || "").trim(), date: "", description: "" });
  } else {
    addCustom(resume, key, title, { id: uid(), hidden: false, title: line, subtitle: "", period: "", bullets: [] });
  }
}

/** Parse a Markdown resume into our Resume model. Ported from parseMarkdown(). */
export function parseMarkdown(markdown: string): Resume {
  const resume = emptyResume();
  resume.experience = [];
  resume.education = [];
  resume.projects = [];
  resume.certifications = [];
  resume.languages = [];
  resume.interests = [];
  resume.publications = [];
  resume.achievements = [];
  resume.customSections = [];

  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const titleLine = lines.find((line) => /^#\s+/.test(line));
  if (titleLine) {
    const name = splitName(titleLine.replace(/^#\s+/, ""));
    resume.basics.firstName = name.firstName.toUpperCase();
    resume.basics.lastName = name.lastName.toUpperCase();
  }

  const contactLine = lines.find((line) => line.includes("@") && /·|\|/.test(line));
  if (contactLine) {
    const parts = cleanMd(contactLine).split(/[·|]/).map((part) => part.trim()).filter(Boolean);
    resume.basics.location = parts.find((part) => !part.includes("@") && !/^\+/.test(part) && !/linkedin/i.test(part)) || resume.basics.location;
    resume.basics.email = parts.find((part) => part.includes("@")) || resume.basics.email;
    resume.basics.phone = parts.find((part) => /^\+/.test(part)) || resume.basics.phone;
    const linkedin = parts.find((part) => /linkedin/i.test(part));
    if (linkedin) resume.basics.linkedin = linkedin.replace(/linkedin:/i, "").trim();
  }

  const headlineIndex = lines.findIndex((line) => /^\*\*.*\*\*/.test(line));
  if (headlineIndex > -1) resume.basics.headline = cleanMd(lines[headlineIndex]);

  let section = "";
  let currentItem: Any = null;
  const commit = () => {
    if (!currentItem) return;
    const key = classifySection(section);
    pushParsedItem(resume, key, currentItem);
    currentItem = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line === "---") continue;
    if (/^##\s+/.test(line)) {
      commit();
      section = cleanMd(line.replace(/^##\s+/, ""));
      if (classifySection(section) === "summary") resume.summary = "";
      continue;
    }
    if (/^###\s+/.test(line)) {
      commit();
      currentItem = parseHeadingItem(line.replace(/^###\s+/, ""));
      continue;
    }
    if (!section || /^#\s+/.test(line)) continue;

    const key = classifySection(section);
    if (key === "summary") {
      resume.summary += `${resume.summary ? "\n" : ""}${cleanMd(line)}`;
    } else if (/^[-*]\s+/.test(line)) {
      const bullet = cleanMd(line.replace(/^[-*]\s+/, ""));
      if (currentItem) currentItem.bullets.push(bullet);
      else pushLooseLine(resume, key, bullet, section);
    } else if (/^\*\*.*\*\*/.test(line) && currentItem) {
      currentItem.meta = cleanMd(line);
    } else if (currentItem) {
      currentItem.description = [currentItem.description, cleanMd(line)].filter(Boolean).join(" ");
    }
  }
  commit();
  resume.summary = resume.summary.trim();
  return resume;
}
