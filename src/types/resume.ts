// Typed Resume model shared by the editor, importers, exporters, and templates.

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
  description: string;
  pageSize: PageSize;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "dark-sidebar",
    name: "Technical Sidebar",
    description: "Dense two-column layout for engineering and technical roles.",
    pageSize: "A4"
  },
  {
    id: "classic-blue-lines",
    name: "Corporate Classic",
    description: "Traditional profile-first resume for corporate applications.",
    pageSize: "Letter"
  },
  {
    id: "purple-compact",
    name: "Compact Professional",
    description: "Space-efficient layout for concise one-page resumes.",
    pageSize: "A4"
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean editorial structure for general professional use.",
    pageSize: "A4"
  },
  {
    id: "executive",
    name: "Executive Leadership",
    description: "Polished leadership format for senior and management roles.",
    pageSize: "Letter"
  },
  {
    id: "teal-pro",
    name: "Product & Design",
    description: "Balanced sidebar resume for product, design, and hybrid roles.",
    pageSize: "A4"
  },
  {
    id: "warm-earth",
    name: "Creative Editorial",
    description: "Warm visual layout for creative and storytelling-heavy profiles.",
    pageSize: "A4"
  },
  {
    id: "ats-clean",
    name: "ATS Plain Text",
    description: "Plain, parser-friendly structure for applicant tracking systems.",
    pageSize: "Letter"
  }
];
