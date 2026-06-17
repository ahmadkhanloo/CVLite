import { create } from "zustand";
import type { ResumeDoc } from "../types/library";
import { saveDoc as dbSave, loadDoc as dbLoad, deleteDoc as dbDelete, listDocs as dbList } from "../db";
import { apiListResumes, apiSyncResume, apiPatchResume, apiDeleteResume, apiGetResume } from "../api/client";
import { emptyResume, uid } from "../data/defaults";

export type LibraryMode = "local" | "cloud";

interface LibraryState {
  docs: ResumeDoc[];
  loading: boolean;
  mode: LibraryMode;
  setMode: (mode: LibraryMode) => void;
  load: () => Promise<void>;
  createDoc: (name?: string) => Promise<ResumeDoc>;
  duplicateDoc: (id: string) => Promise<ResumeDoc | null>;
  removeDoc: (id: string) => Promise<void>;
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
  mode: "local",

  setMode: (mode) => set({ mode }),

  load: async () => {
    set({ loading: true });
    try {
      if (get().mode === "cloud") {
        const resumes = await apiListResumes();
        // Cloud list returns ResumeDocMeta — cast; resume field will be undefined
        set({ docs: resumes as ResumeDoc[] });
      } else {
        const docs = await dbList();
        set({ docs });
      }
    } finally {
      set({ loading: false });
    }
  },

  createDoc: async (name = "My Resume") => {
    const { mode } = get();
    const doc = makeDoc({ name });
    if (mode === "cloud") {
      await apiSyncResume(doc);
      set((s) => ({ docs: [doc, ...s.docs] }));
    } else {
      await dbSave(doc);
      set((s) => ({ docs: [doc, ...s.docs] }));
    }
    return doc;
  },

  duplicateDoc: async (id) => {
    const { mode, docs } = get();
    const src = docs.find((d) => d.id === id);
    if (!src) return null;
    const now = Date.now();
    // For cloud mode, fetch full doc first if resume is not yet loaded
    let fullSrc = src;
    if (mode === "cloud" && !src.resume) {
      try { fullSrc = await apiGetResume(id); } catch { return null; }
    }
    const doc: ResumeDoc = {
      ...JSON.parse(JSON.stringify(fullSrc)),
      id: uid(),
      name: `${fullSrc.name} (copy)`,
      createdAt: now,
      updatedAt: now
    };
    if (mode === "cloud") {
      await apiSyncResume(doc);
      set((s) => ({ docs: [doc, ...s.docs] }));
    } else {
      await dbSave(doc);
      set((s) => ({ docs: [doc, ...s.docs] }));
    }
    return doc;
  },

  removeDoc: async (id) => {
    const { mode } = get();
    if (mode === "cloud") {
      await apiDeleteResume(id);
    } else {
      await dbDelete(id);
    }
    set((s) => ({ docs: s.docs.filter((d) => d.id !== id) }));
  },

  saveDoc: async (doc) => {
    const { mode } = get();
    const updated = { ...doc, updatedAt: Date.now() };
    if (mode === "cloud") {
      await apiPatchResume(updated.id, updated);
    } else {
      await dbSave(updated);
    }
    set((s) => ({ docs: s.docs.map((d) => (d.id === updated.id ? updated : d)) }));
  },

  getDoc: async (id) => {
    const { mode } = get();
    if (mode === "cloud") {
      try { return await apiGetResume(id); } catch { return undefined; }
    }
    return dbLoad(id);
  },
}));
