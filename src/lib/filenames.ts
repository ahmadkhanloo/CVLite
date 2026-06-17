import type { Resume, TemplateId } from "../types/resume";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function fileSlug(value: string | undefined, fallback = "resume"): string {
  const slug = (value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/[^a-zA-Z0-9\u0600-\u06ff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return slug || fallback;
}

export function resumeBaseName(resume: Partial<Resume>, docName?: string): string {
  const person = [resume.basics?.firstName, resume.basics?.lastName].filter(Boolean).join(" ");
  return fileSlug(person || docName, "resume");
}

export function resumeExportName(
  kind: "pdf" | "json" | "md" | "jsonresume",
  resume: Partial<Resume>,
  docName?: string,
  templateId?: TemplateId
): string {
  const base = resumeBaseName(resume, docName);
  const date = today();
  if (kind === "pdf") return `cvlite-${base}-${templateId || "template"}-${date}.pdf`;
  if (kind === "jsonresume") return `cvlite-${base}-jsonresume-${date}.json`;
  return `cvlite-${base}-${date}.${kind}`;
}

export function backupFileName(): string {
  return `cvlite-backup-${today()}.json`;
}
