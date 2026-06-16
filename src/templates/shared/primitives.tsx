import type { ReactNode } from "react";
import type {
  CustomSection,
  EducationItem,
  CertificationItem,
  ExperienceItem,
  LanguageItem,
  ProjectItem,
  PublicationItem,
  Resume,
  SkillItem
} from "../../types/resume";
import { compact, itemVisible } from "../../data/text";

// Each primitive reproduces the exact markup + class names of the legacy
// render* functions in resume-core.js so the ported print.css applies as-is.

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

export function Contact({ r }: { r: Resume }) {
  const fields: Array<[string, string]> = (
    [
      ["mail", r.basics.email],
      ["pin", r.basics.location],
      ["phone", r.basics.phone],
      ["in", r.basics.linkedin],
      ["info", r.basics.extra]
    ] as Array<[string, string]>
  ).filter((entry) => entry[1]);
  return (
    <div className="contact">
      {fields.map(([icon, value]) => (
        <span key={icon}>
          <b>{icon}</b>
          {value}
        </span>
      ))}
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

export function Skills({ skills, bullets }: { skills: SkillItem[]; bullets: boolean }) {
  const visible = (skills || []).filter(itemVisible);
  if (!visible.length) return null;
  return (
    <section className="resume-section skills">
      <h2>SKILLS</h2>
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

export function Education({ items }: { items: EducationItem[] }) {
  const visible = (items || []).filter(itemVisible);
  if (!visible.length) return null;
  return (
    <section className="resume-section">
      <h2>EDUCATION</h2>
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

export function Certifications({ items }: { items: CertificationItem[] }) {
  const visible = (items || []).filter(itemVisible);
  if (!visible.length) return null;
  return (
    <section className="resume-section">
      <h2>COURSES</h2>
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

export function Projects({ items }: { items: ProjectItem[] }) {
  const visible = (items || []).filter(itemVisible);
  if (!visible.length) return null;
  return (
    <section className="resume-section">
      <h2>PROJECTS</h2>
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

export function Publications({ items }: { items: PublicationItem[] }) {
  const visible = (items || []).filter(itemVisible);
  if (!visible.length) return null;
  return (
    <section className="resume-section">
      <h2>PUBLICATIONS</h2>
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

export function LanguagesInline({ items }: { items: LanguageItem[] }) {
  const visible = (items || []).filter(itemVisible).map((item) => item.language);
  return <Pills title="LANGUAGES" items={visible} />;
}

export function LanguagesWithDots({ items }: { items: LanguageItem[] }) {
  const visible = (items || []).filter(itemVisible);
  if (!visible.length) return null;
  return (
    <section className="resume-section language-dots">
      <h2>LANGUAGES</h2>
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
