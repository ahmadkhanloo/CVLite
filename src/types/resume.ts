// Typed Resume model — ported 1:1 from the shape produced by emptyResume()
// and normalizeRxResume() in the legacy public/resume-core.js.

export interface Basics {
  firstName: string;
  lastName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  extra: string;
  photo: string;
}

export interface ExperienceItem {
  id: string;
  hidden: boolean;
  title: string;
  organization: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  hidden: boolean;
  organization: string;
  degree: string;
  period: string;
  location: string;
  description: string;
}

export interface SkillItem {
  id: string;
  hidden: boolean;
  name: string;
  level: string;
  keywords: string[];
}

export interface ProjectItem {
  id: string;
  hidden: boolean;
  name: string;
  period: string;
  website: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  hidden: boolean;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface LanguageItem {
  id: string;
  hidden: boolean;
  language: string;
  fluency: string;
  level: string;
}

export interface InterestItem {
  id: string;
  hidden: boolean;
  name: string;
  keywords: string[];
}

export interface PublicationItem {
  id: string;
  hidden: boolean;
  title: string;
  publisher: string;
  date: string;
  description: string;
}

export interface AchievementItem {
  id: string;
  hidden: boolean;
  title: string;
  description: string;
}

export interface CustomItem {
  id: string;
  hidden: boolean;
  title: string;
  subtitle: string;
  period: string;
  bullets: string[];
}

export interface CustomSection {
  id: string;
  hidden: boolean;
  title: string;
  items: CustomItem[];
}

export interface Resume {
  basics: Basics;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  interests: InterestItem[];
  publications: PublicationItem[];
  achievements: AchievementItem[];
  customSections: CustomSection[];
}

/** Keys of Resume that hold a flat array of editable items. */
export type ArraySectionKey =
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "interests"
  | "publications"
  | "achievements";

export type TemplateId =
  | "dark-sidebar"
  | "classic-blue-lines"
  | "purple-compact"
  | "modern-minimal"
  | "executive"
  | "teal-pro"
  | "warm-earth"
  | "ats-clean";
export type PageSize = "A4" | "Letter";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  pageSize: PageSize;
}

export const TEMPLATES: TemplateMeta[] = [
  { id: "dark-sidebar", name: "Dark Sidebar", pageSize: "A4" },
  { id: "classic-blue-lines", name: "Classic Blue", pageSize: "Letter" },
  { id: "purple-compact", name: "Purple Compact", pageSize: "A4" }
];
