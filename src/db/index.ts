import { get, set, del, keys } from "idb-keyval";
import type { ResumeDoc } from "../types/library";

const PREFIX = "cvlite:doc:";

export async function saveDoc(doc: ResumeDoc): Promise<void> {
  await set(PREFIX + doc.id, doc);
}

export async function loadDoc(id: string): Promise<ResumeDoc | undefined> {
  return get<ResumeDoc>(PREFIX + id);
}

export async function deleteDoc(id: string): Promise<void> {
  await del(PREFIX + id);
}

export async function deleteAllDocs(): Promise<void> {
  const allKeys = await keys();
  const docKeys = (allKeys as string[]).filter((k) => k.startsWith(PREFIX));
  await Promise.all(docKeys.map((k) => del(k)));
}

export async function listDocs(): Promise<ResumeDoc[]> {
  const allKeys = await keys();
  const docKeys = (allKeys as string[]).filter((k) => k.startsWith(PREFIX));
  const docs = await Promise.all(docKeys.map((k) => get<ResumeDoc>(k)));
  return (docs.filter(Boolean) as ResumeDoc[]).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function backupAllDocs(): Promise<ResumeDoc[]> {
  return listDocs();
}

export async function restoreAllDocs(docs: ResumeDoc[]): Promise<void> {
  await Promise.all(docs.map((doc) => saveDoc(doc)));
}
