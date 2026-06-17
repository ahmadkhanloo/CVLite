import type { PageSize, Resume, TemplateId } from "./resume";

export interface DesignTokens {
  accentColor?: string;
  fontScale?: number;
  lineHeight?: number;
}

export interface ResumeDoc {
  id: string;
  name: string;
  targetJob?: string;
  createdAt: number;
  updatedAt: number;
  resume?: Resume;
  templateId: TemplateId;
  pageSize: PageSize;
  design?: DesignTokens;
  coverLetter?: string;
}

/** Metadata-only shape returned by the cloud list endpoint (no resume body). */
export type ResumeDocMeta = Omit<ResumeDoc, "resume">;
