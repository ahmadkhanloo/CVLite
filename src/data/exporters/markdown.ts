import type { Resume } from "../../types/resume";
import { normalizeResume } from "../defaults";
import { compact, itemVisible } from "../text";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

function markdownItems(
  parts: string[],
  title: string,
  items: Any[],
  heading: (item: Any) => string,
  meta: (item: Any) => string,
  bullets: (item: Any) => string[]
): void {
  const visible = (items || []).filter(itemVisible);
  if (!visible.length) return;
  parts.push("", `## ${title}`);
  visible.forEach((item) => {
    parts.push("", `### ${heading(item)}`);
    const metaText = meta(item);
    if (metaText) parts.push(`**${metaText}**`);
    (bullets(item) || []).forEach((bullet) => parts.push(`- ${bullet}`));
  });
}

/** Serialize a Resume to Markdown. Ported from resumeToMarkdown(). */
export function resumeToMarkdown(resume: Partial<Resume>): string {
  const r = normalizeResume(resume);
  const parts: string[] = [
    `# ${compact([r.basics.firstName, r.basics.lastName])}`,
    "",
    `**${r.basics.headline || ""}**`,
    compact([r.basics.location, r.basics.email, r.basics.phone, r.basics.linkedin && `LinkedIn: ${r.basics.linkedin}`]),
    "",
    "## Summary",
    r.summary || ""
  ];
  markdownItems(parts, "Professional Experience", r.experience, (item) => `${item.organization} — ${item.title}`, (item) => compact([item.period, item.location]), (item) => item.bullets);
  markdownItems(parts, "Selected Projects", r.projects, (item) => item.name, (item) => item.period, (item) => item.bullets);
  markdownItems(parts, "Education", r.education, (item) => item.organization, (item) => compact([item.degree, item.period, item.location]), (item) => (item.description ? [item.description] : []));
  markdownItems(parts, "Certifications & Courses", r.certifications, (item) => item.title, (item) => compact([item.issuer, item.date]), (item) => (item.description ? [item.description] : []));
  parts.push("", "## Core Skills", ...r.skills.filter(itemVisible).map((item) => `- **${item.name}:** ${(item.keywords || []).join(", ")}`));
  parts.push("", "## Languages", `- ${r.languages.filter(itemVisible).map((item) => compact([item.language, item.fluency])).join(" · ")}`);
  return parts.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
