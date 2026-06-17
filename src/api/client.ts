import type { ResumeDoc } from "../types/library";

export type ResumeDocMeta = Omit<ResumeDoc, "resume">;

// ── Resume list (metadata only) ───────────────────────────────────────────────

export async function apiListResumes(): Promise<ResumeDocMeta[]> {
  const res = await fetch("/api/resumes");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json() as { resumes: ResumeDocMeta[] };
  return data.resumes;
}

// ── Full resume ───────────────────────────────────────────────────────────────

export async function apiGetResume(id: string): Promise<ResumeDoc> {
  const res = await fetch(`/api/resumes/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<ResumeDoc>;
}

// ── Create / sync ─────────────────────────────────────────────────────────────

export class ResumeLimitError extends Error {
  code = "resume_limit_reached";
  constructor() { super("Resume limit reached"); }
}

export async function apiSyncResume(doc: ResumeDoc): Promise<{ id: string }> {
  const res = await fetch("/api/resumes", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      id: doc.id,
      name: doc.name,
      resume: doc.resume,
      templateId: doc.templateId,
      pageSize: doc.pageSize,
      design: doc.design,
      coverLetter: doc.coverLetter,
      targetJob: doc.targetJob,
      createdAt: doc.createdAt,
    }),
  });
  if (res.status === 409) throw new ResumeLimitError();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<{ id: string }>;
}

// ── Patch ─────────────────────────────────────────────────────────────────────

export async function apiPatchResume(id: string, patch: Partial<ResumeDoc>): Promise<void> {
  const body: Record<string, unknown> = {};
  if (patch.name        !== undefined) body.name        = patch.name;
  if (patch.resume      !== undefined) body.resume      = patch.resume;
  if (patch.templateId  !== undefined) body.templateId  = patch.templateId;
  if (patch.pageSize    !== undefined) body.pageSize    = patch.pageSize;
  if (patch.design      !== undefined) body.design      = patch.design;
  if (patch.coverLetter !== undefined) body.coverLetter = patch.coverLetter;
  if (patch.targetJob   !== undefined) body.targetJob   = patch.targetJob;
  const res = await fetch(`/api/resumes/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function apiDeleteResume(id: string): Promise<void> {
  await fetch(`/api/resumes/${id}`, { method: "DELETE" });
}

// ── Backup (full docs for export) ─────────────────────────────────────────────

export async function apiExportAllResumes(): Promise<ResumeDoc[]> {
  const meta = await apiListResumes();
  return Promise.all(meta.map((m) => apiGetResume(m.id)));
}
