import { create } from "zustand";
import type { ArraySectionKey, PageSize, Resume, TemplateId } from "../types/resume";
import type { DesignTokens, ResumeDoc } from "../types/library";
import { TEMPLATES } from "../types/resume";
import { emptyResume, normalizeResume, uid } from "../data/defaults";

type FieldValue = string | boolean | string[];

interface EditorState {
  docId: string;
  docName: string;
  resume: Resume;
  templateId: TemplateId;
  pageSize: PageSize;
  design: DesignTokens;
  coverLetter: string;
  isDirty: boolean;
  loadDoc: (doc: ResumeDoc) => void;
  toDoc: () => ResumeDoc;
  setResume: (resume: Resume) => void;
  setField: (path: string, value: FieldValue) => void;
  setTemplate: (templateId: TemplateId) => void;
  setPageSize: (pageSize: PageSize) => void;
  setDesign: (design: Partial<DesignTokens>) => void;
  setCoverLetter: (text: string) => void;
  setDocName: (name: string) => void;
  addItem: (key: ArraySectionKey) => void;
  removeItem: (key: ArraySectionKey, index: number) => void;
  moveItem: (key: ArraySectionKey, index: number, direction: number) => void;
  reorderItem: (key: ArraySectionKey, fromIndex: number, toIndex: number) => void;
  addCustomSection: () => void;
  removeCustomSection: (index: number) => void;
  addCustomItem: (sectionIndex: number) => void;
  removeCustomItem: (sectionIndex: number, itemIndex: number) => void;
  markSaved: () => void;
}

function setByPath(resume: Resume, path: string, value: FieldValue): Resume {
  const next = structuredClone(resume);
  const parts = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cursor: any = next;
  for (const part of parts.slice(0, -1)) cursor = cursor[part];
  cursor[parts[parts.length - 1]] = value;
  return next;
}

function emptyItem(key: ArraySectionKey): Resume[ArraySectionKey][number] {
  const base = { id: uid(), hidden: false };
  switch (key) {
    case "experience": return { ...base, organization: "", title: "", period: "", location: "", bullets: [] };
    case "education": return { ...base, organization: "", degree: "", period: "", location: "", description: "" };
    case "skills": return { ...base, name: "", level: "", keywords: [] };
    case "projects": return { ...base, name: "", period: "", website: "", bullets: [] };
    case "certifications": return { ...base, title: "", issuer: "", date: "", description: "" };
    case "languages": return { ...base, language: "", fluency: "", level: "4" };
    case "interests": return { ...base, name: "", keywords: [] };
    case "publications": return { ...base, title: "", publisher: "", date: "", description: "" };
    case "achievements": return { ...base, title: "", description: "" };
  }
}

// One-time read of the legacy raw resume draft written by the vanilla app.
function legacyDraft(): Resume | null {
  try {
    const saved = localStorage.getItem("cvlite.resumeDraft.v1");
    return saved ? normalizeResume(JSON.parse(saved)) : null;
  } catch { return null; }
}

const NOW = Date.now();

export const useEditor = create<EditorState>()((set, get) => ({
  docId: uid(),
  docName: "My Resume",
  resume: legacyDraft() || emptyResume(),
  templateId: "dark-sidebar",
  pageSize: "A4",
  design: {},
  coverLetter: "",
  isDirty: false,

  loadDoc: (doc) => set({
    docId: doc.id,
    docName: doc.name,
    resume: normalizeResume(doc.resume),
    templateId: doc.templateId,
    pageSize: doc.pageSize,
    design: doc.design || {},
    coverLetter: doc.coverLetter || "",
    isDirty: false
  }),

  toDoc: (): ResumeDoc => {
    const s = get();
    return {
      id: s.docId,
      name: s.docName,
      createdAt: NOW,
      updatedAt: Date.now(),
      resume: s.resume,
      templateId: s.templateId,
      pageSize: s.pageSize,
      design: s.design,
      coverLetter: s.coverLetter
    };
  },

  setResume: (resume) => set({ resume, isDirty: true }),
  setField: (path, value) => set((s) => ({ resume: setByPath(s.resume, path, value), isDirty: true })),
  setTemplate: (templateId) => set(() => ({ templateId, pageSize: TEMPLATES.find((t) => t.id === templateId)?.pageSize ?? "A4", isDirty: true })),
  setPageSize: (pageSize) => set({ pageSize, isDirty: true }),
  setDesign: (design) => set((s) => ({ design: { ...s.design, ...design }, isDirty: true })),
  setCoverLetter: (coverLetter) => set({ coverLetter, isDirty: true }),
  setDocName: (docName) => set({ docName, isDirty: true }),

  addItem: (key) => set((s) => {
    const resume = structuredClone(s.resume);
    (resume[key] as unknown[]).push(emptyItem(key));
    return { resume, isDirty: true };
  }),
  removeItem: (key, index) => set((s) => {
    const resume = structuredClone(s.resume);
    (resume[key] as unknown[]).splice(index, 1);
    return { resume, isDirty: true };
  }),
  moveItem: (key, index, direction) => set((s) => {
    const resume = structuredClone(s.resume);
    const list = resume[key] as unknown[];
    const target = index + direction;
    if (target < 0 || target >= list.length) return {};
    const [item] = list.splice(index, 1);
    list.splice(target, 0, item);
    return { resume, isDirty: true };
  }),
  reorderItem: (key, fromIndex, toIndex) => set((s) => {
    if (fromIndex === toIndex) return {};
    const resume = structuredClone(s.resume);
    const list = resume[key] as unknown[];
    const [item] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, item);
    return { resume, isDirty: true };
  }),

  addCustomSection: () => set((s) => {
    const resume = structuredClone(s.resume);
    resume.customSections.push({ id: uid(), hidden: false, title: "Custom Section", items: [] });
    return { resume, isDirty: true };
  }),
  removeCustomSection: (index) => set((s) => {
    const resume = structuredClone(s.resume);
    resume.customSections.splice(index, 1);
    return { resume, isDirty: true };
  }),
  addCustomItem: (sectionIndex) => set((s) => {
    const resume = structuredClone(s.resume);
    resume.customSections[sectionIndex].items.push({ id: uid(), hidden: false, title: "", subtitle: "", period: "", bullets: [] });
    return { resume, isDirty: true };
  }),
  removeCustomItem: (sectionIndex, itemIndex) => set((s) => {
    const resume = structuredClone(s.resume);
    resume.customSections[sectionIndex].items.splice(itemIndex, 1);
    return { resume, isDirty: true };
  }),
  markSaved: () => set({ isDirty: false })
}));
