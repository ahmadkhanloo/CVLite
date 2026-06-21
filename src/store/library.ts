import { create } from "zustand";
import type { ResumeDoc } from "../types/library";
import { saveDoc as dbSave, loadDoc as dbLoad, deleteDoc as dbDelete, deleteAllDocs as dbDeleteAll, listDocs as dbList } from "../db";
import { emptyResume, uid } from "../data/defaults";

interface LibraryState {
  docs: ResumeDoc[];
  loading: boolean;
  load: () => Promise<void>;
  createDoc: (name?: string) => Promise<ResumeDoc>;
  duplicateDoc: (id: string) => Promise<ResumeDoc | null>;
  removeDoc: (id: string) => Promise<void>;
  removeAllDocs: () => Promise<void>;
  saveDoc: (doc: ResumeDoc) => Promise<void>;
  getDoc: (id: string) => Promise<ResumeDoc | undefined>;
}

function makeDoc(overrides?: Partial<ResumeDoc>): ResumeDoc {
  const now = Date.now();
  return {
    id: uid(),
    name: "My Resume",
    createdAt: now,
    updatedAt: now,
    resume: emptyResume(),
    templateId: "dark-sidebar",
    pageSize: "A4",
    ...overrides
  };
}

export const useLibrary = create<LibraryState>((set, get) => ({
  docs: [],
  loading: true,

  load: async () => {
    set({ loading: true });
    try {
      const docs = await dbList();
      set({ docs });
    } finally {
      set({ loading: false });
    }
  },

  createDoc: async (name = "My Resume") => {
    const doc = makeDoc({ name });
    await dbSave(doc);
    set((s) => ({ docs: [doc, ...s.docs] }));
    return doc;
  },

  duplicateDoc: async (id) => {
    const { docs } = get();
    const src = docs.find((d) => d.id === id);
    if (!src) return null;
    const now = Date.now();
    const doc: ResumeDoc = {
      ...JSON.parse(JSON.stringify(src)),
      id: uid(),
      name: `${src.name} (copy)`,
      createdAt: now,
      updatedAt: now
    };
    await dbSave(doc);
    set((s) => ({ docs: [doc, ...s.docs] }));
    return doc;
  },

  removeDoc: async (id) => {
    await dbDelete(id);
    set((s) => ({ docs: s.docs.filter((d) => d.id !== id) }));
  },

  removeAllDocs: async () => {
    await dbDeleteAll();
    set({ docs: [] });
  },

  saveDoc: async (doc) => {
    const updated = { ...doc, updatedAt: Date.now() };
    await dbSave(updated);
    set((s) => ({ docs: s.docs.map((d) => (d.id === updated.id ? updated : d)) }));
  },

  getDoc: async (id) => {
    return dbLoad(id);
  },
}));
