import type { ResumeDoc } from "../types/library";
import { backupAllDocs, restoreAllDocs } from "../db";
import { backupFileName } from "./filenames";
import { downloadText } from "./files";

export async function exportBackup(): Promise<void> {
  const docs = await backupAllDocs();
  const payload = JSON.stringify({ version: 1, docs, exportedAt: new Date().toISOString() }, null, 2);
  downloadText(backupFileName(), payload, "application/json");
}

export async function importBackup(file: File): Promise<number> {
  const text = await file.text();
  const data = JSON.parse(text);
  const docs: ResumeDoc[] = Array.isArray(data) ? data : (data.docs || []);
  if (!Array.isArray(docs) || docs.length === 0) throw new Error("Invalid backup file");
  await restoreAllDocs(docs);
  return docs.length;
}
