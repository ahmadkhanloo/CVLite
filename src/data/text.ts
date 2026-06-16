// Shared text helpers — ported from legacy resume-core.js.

export const compact = (items: Array<string | false | null | undefined>): string =>
  items.filter(Boolean).join(" · ");

export function textFromRich(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(textFromRich).filter(Boolean).join("\n");
  if (typeof value === "object" && typeof (value as { content?: unknown }).content === "string") {
    return (value as { content: string }).content;
  }
  return "";
}

export function splitName(name = ""): { firstName: string; lastName: string } {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstName: parts[0] || "", lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export function itemVisible(item: { hidden?: boolean } | null | undefined): boolean {
  return !item || item.hidden !== true;
}

export function normalizeBullets(value: unknown): string[] {
  const text = textFromRich(value);
  if (!text) return [];
  return text
    .replace(/<\/?[^>]+>/g, "")
    .split(/\n+|(?:^|\s)[•●]\s*/g)
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

export function cleanMd(text: unknown): string {
  return String(text || "")
    .replace(/\*\*/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}
