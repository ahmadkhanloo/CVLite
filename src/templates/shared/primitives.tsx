import type { ReactNode } from "react";
import { Info, Link2, Mail, MapPin, Phone } from "lucide-react";
import type {
  CustomSection,
  EducationItem,
  CertificationItem,
  ExperienceItem,
  LanguageItem,
  ProjectItem,
  PublicationItem,
  Resume,
  ResumeLocale,
  SkillItem
} from "../../types/resume";
import { compact, itemVisible } from "../../data/text";

// Each primitive reproduces the exact markup + class names of the legacy
// render* functions in resume-core.js so the ported print.css applies as-is.

export const SECTION_LABELS: Record<ResumeLocale, Record<string, string>> = {
  en: {
    about: "ABOUT",
    achievements: "ACHIEVEMENTS",
    certifications: "CERTIFICATIONS",
    courses: "COURSES",
    education: "EDUCATION",
    experience: "EXPERIENCE",
    executiveSummary: "EXECUTIVE SUMMARY",
    impact: "IMPACT",
    interests: "INTERESTS",
    languages: "LANGUAGES",
    metrics: "METRICS",
    profile: "PROFILE",
    projects: "PROJECTS",
    publications: "PUBLICATIONS",
    skills: "SKILLS",
    summary: "SUMMARY",
    personalInfo: "PERSONAL INFO",
    aboutMe: "ABOUT ME",
    achievementsImpact: "ACHIEVEMENTS & IMPACT",
    experienceRole: "EXPERIENCE",
    approach: "APPROACH",
    strengths: "STRENGTHS",
    skillsAbilities: "SKILLS & ABILITIES",
    lifePath: "CAREER PATH"
  },
  fa: {
    about: "درباره",
    achievements: "دستاوردها",
    certifications: "گواهی نامه ها",
    courses: "دوره ها",
    education: "تحصیلات",
    experience: "تجربه",
    executiveSummary: "خلاصه مدیریتی",
    impact: "اثرگذاری",
    interests: "علایق",
    languages: "زبان ها",
    metrics: "شاخص ها",
    profile: "پروفایل",
    projects: "پروژه ها",
    publications: "انتشارات",
    skills: "مهارت ها",
    summary: "خلاصه",
    personalInfo: "اطلاعات فردی",
    aboutMe: "درباره من",
    achievementsImpact: "دستاوردها و تاثیرگذاری",
    experienceRole: "تجربه و نقش آفرینی",
    approach: "نگرش و رویکرد",
    strengths: "نقاط قوت",
    skillsAbilities: "مهارت ها و توانمندی ها",
    lifePath: "مسیر زندگی و تجربه"
  }
};

export function label(locale: ResumeLocale, key: string) {
  return SECTION_LABELS[locale]?.[key] || SECTION_LABELS.en[key] || key;
}

export function Name({ r }: { r: Resume }) {
  return (
    <h1>
      <span>{r.basics.firstName}</span>
      <span>{r.basics.lastName}</span>
    </h1>
  );
}

export function Photo({ r }: { r: Resume }) {
  if (!r.basics.photo) return <div className="photo placeholder" />;
  return <img className="photo" src={r.basics.photo} alt="" />;
}

export function Identity({ r }: { r: Resume }) {
  return (
    <div className="identity">
      <Name r={r} />
      <p>{r.basics.headline}</p>
      <Photo r={r} />
    </div>
  );
}

export function InlineContact({ r }: { r: Resume }) {
  const parts = [r.basics.phone, r.basics.email, r.basics.linkedin, r.basics.location].filter(Boolean);
  return <p className="inline-contact">{parts.join(" · ")}</p>;
}

const CONTACT_ICONS = { mail: Mail, pin: MapPin, phone: Phone, in: Link2, info: Info } as const;

export function Contact({ r }: { r: Resume }) {
  const fields: Array<[keyof typeof CONTACT_ICONS, string]> = (
    [
      ["mail", r.basics.email],
      ["pin", r.basics.location],
      ["phone", r.basics.phone],
      ["in", r.basics.linkedin],
      ["info", r.basics.extra]
    ] as Array<[keyof typeof CONTACT_ICONS, string]>
  ).filter((entry) => entry[1]);
  return (
    <div className="contact">
      {fields.map(([icon, value]) => {
        const Icon = CONTACT_ICONS[icon];
        return (
          <span key={icon}>
            <b><Icon size={9} strokeWidth={2.4} aria-hidden /></b>
            {value}
          </span>
        );
      })}
    </div>
  );
}

export function TextSection({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  return (
    <section className="resume-section">
      <h2>{title}</h2>
      <p className="summary-text">{text}</p>
    </section>
  );
}

export function Bullets({ bullets }: { bullets?: string[] }) {
  const visible = (bullets || []).filter(Boolean);
  if (!visible.length) return null;
  return (
    <ul>
      {visible.map((bullet, i) => (
        <li key={i}>{bullet}</li>
      ))}
    </ul>
  );
}

export function Skills({ skills, bullets, locale = "en" }: { skills: SkillItem[]; bullets: boolean; locale?: ResumeLocale }) {
  const visible = (skills || []).filter(itemVisible);
  if (!visible.length) return null;
  return (
    <section className="resume-section skills">
      <h2>{label(locale, "skills")}</h2>
      {visible.map((skill) => (
        <div className="skill-group" key={skill.id}>
          <h3>{skill.name}</h3>
          {bullets ? (
            <ul>
              {(skill.keywords || []).map((kw, i) => (
                <li key={i}>{kw}</li>
              ))}
            </ul>
          ) : (
            <p>
              {(skill.keywords || []).map((kw, i) => (
                <span key={i}>{kw}</span>
              ))}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}

export function Timeline({ title, items }: { title: string; items: ExperienceItem[] }) {
  const visible = (items || []).filter(itemVisible);
  if (!visible.length) return null;
  return (
    <section className="resume-section timeline">
      <h2>{title}</h2>
      {visible.map((item) => (
        <div className="entry" key={item.id}>
          <h3>{item.organization || item.title}</h3>
          <p className="entry-role">{item.title || ""}</p>
          <p className="entry-meta">{compact([item.period, item.location])}</p>
          <Bullets bullets={item.bullets} />
        </div>
      ))}
    </section>
  );
}

export function Education({ items, locale = "en" }: { items: EducationItem[]; locale?: ResumeLocale }) {
  const visible = (items || []).filter(itemVisible);
  if (!visible.length) return null;
  return (
    <section className="resume-section">
      <h2>{label(locale, "education")}</h2>
      {visible.map((item) => (
        <div className="entry compact-entry" key={item.id}>
          <h3>{item.degree || item.organization}</h3>
          <p>{item.organization || ""}</p>
          <p className="entry-meta">{compact([item.period, item.location])}</p>
          {item.description ? <p>{item.description}</p> : null}
        </div>
      ))}
    </section>
  );
}

export function Certifications({ items, locale = "en" }: { items: CertificationItem[]; locale?: ResumeLocale }) {
  const visible = (items || []).filter(itemVisible);
  if (!visible.length) return null;
  return (
    <section className="resume-section">
      <h2>{label(locale, "courses")}</h2>
      {visible.map((item) => (
        <div className="entry compact-entry" key={item.id}>
          <h3>{item.title}</h3>
          <p>{compact([item.issuer, item.date])}</p>
          {item.description ? <p>{item.description}</p> : null}
        </div>
      ))}
    </section>
  );
}

export function Projects({ items, locale = "en" }: { items: ProjectItem[]; locale?: ResumeLocale }) {
  const visible = (items || []).filter(itemVisible);
  if (!visible.length) return null;
  return (
    <section className="resume-section">
      <h2>{label(locale, "projects")}</h2>
      {visible.map((item) => (
        <div className="entry compact-entry" key={item.id}>
          <h3>{item.name}</h3>
          <p className="entry-meta">{compact([item.period, item.website])}</p>
          <Bullets bullets={item.bullets} />
        </div>
      ))}
    </section>
  );
}

export function Publications({ items, locale = "en" }: { items: PublicationItem[]; locale?: ResumeLocale }) {
  const visible = (items || []).filter(itemVisible);
  if (!visible.length) return null;
  return (
    <section className="resume-section">
      <h2>{label(locale, "publications")}</h2>
      {visible.map((item) => (
        <div className="entry compact-entry" key={item.id}>
          <h3>{item.title}</h3>
          <p>{compact([item.publisher, item.date])}</p>
          {item.description ? <p>{item.description}</p> : null}
        </div>
      ))}
    </section>
  );
}

export function CustomSections({ sections }: { sections: CustomSection[] }) {
  return (
    <>
      {(sections || []).filter(itemVisible).map((section) => (
        <section className="resume-section" key={section.id}>
          <h2>{section.title}</h2>
          {(section.items || []).filter(itemVisible).map((item) => (
            <div className="entry compact-entry" key={item.id}>
              <h3>{item.title}</h3>
              <p>{compact([item.subtitle, item.period])}</p>
              <Bullets bullets={item.bullets} />
            </div>
          ))}
        </section>
      ))}
    </>
  );
}

export function Pills({ title, items }: { title: string; items: Array<string | undefined> }) {
  const visible = items.filter(Boolean) as string[];
  if (!visible.length) return null;
  return (
    <section className="resume-section pills">
      <h2>{title}</h2>
      <p>
        {visible.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </p>
    </section>
  );
}

export function LanguagesInline({ items, locale = "en" }: { items: LanguageItem[]; locale?: ResumeLocale }) {
  const visible = (items || []).filter(itemVisible).map((item) => item.language);
  return <Pills title={label(locale, "languages")} items={visible} />;
}

export function LanguagesWithDots({ items, locale = "en" }: { items: LanguageItem[]; locale?: ResumeLocale }) {
  const visible = (items || []).filter(itemVisible);
  if (!visible.length) return null;
  return (
    <section className="resume-section language-dots">
      <h2>{label(locale, "languages")}</h2>
      {visible.map((item) => {
        const level = Math.max(1, Math.min(5, Number(item.level) || 4));
        return (
          <p key={item.id}>
            <span>{item.language}</span>
            <b>
              {"●".repeat(level)}
              <i>{"●".repeat(5 - level)}</i>
            </b>
          </p>
        );
      })}
    </section>
  );
}

export type WithChildren = { children: ReactNode };
