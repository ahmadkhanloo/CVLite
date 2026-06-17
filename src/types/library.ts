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
