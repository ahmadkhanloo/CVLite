import type { CSSProperties } from "react";
import type { DesignTokens } from "../types/library";
import type { Resume, TemplateId } from "../types/resume";
import { TEMPLATES } from "../types/resume";
import { normalizeResume } from "../data/defaults";
import {
  Certifications, Contact, CustomSections, Education, Identity,
  InlineContact, LanguagesInline, LanguagesWithDots, Name, Photo,
  Pills, Projects, Publications, Skills, TextSection, Timeline
} from "./shared/primitives";

export { TEMPLATES };

// Resolve per-template CSS overrides from design tokens.
function designStyle(tokens: DesignTokens | undefined, vars: Record<string, string>): CSSProperties {
  if (!tokens && Object.keys(vars).length === 0) return {};
  const result: Record<string, string | number | undefined> = { ...vars };
  if (tokens?.accentColor) result["--resume-accent-override"] = tokens.accentColor;
  if (tokens?.fontScale) result["fontSize"] = `${10.5 * tokens.fontScale}px`;
  if (tokens?.lineHeight) result["lineHeight"] = tokens.lineHeight;
  return result as CSSProperties;
}

// ── Template 1: Dark Sidebar ──────────────────────────────────────────────────
function DarkSidebar({ r, design }: { r: Resume; design?: DesignTokens }) {
  const style = designStyle(design, design?.accentColor ? { "--ds-sidebar": design.accentColor } : {});
  return (
    <article className="resume resume-dark" style={style}>
      <aside className="resume-side">
        <Identity r={r} />
        <Contact r={r} />
        <TextSection title="SUMMARY" text={r.summary} />
        <Skills skills={r.skills} bullets />
        <Pills title="INTERESTS" items={r.interests.map((i) => i.name)} />
        <Pills title="LANGUAGES" items={r.languages.map((l) => l.language)} />
      </aside>
      <section className="resume-main">
        <Timeline title="EXPERIENCE" items={r.experience} />
        <Education items={r.education} />
        <Certifications items={r.certifications} />
        <Projects items={r.projects} />
        <Publications items={r.publications} />
        <CustomSections sections={r.customSections} />
      </section>
    </article>
  );
}

// ── Template 2: Classic Blue ──────────────────────────────────────────────────
function ClassicBlue({ r, design }: { r: Resume; design?: DesignTokens }) {
  const style = designStyle(design, design?.accentColor ? { "--cb-accent": design.accentColor } : {});
  return (
    <article className="resume resume-classic" style={style}>
      <header className="classic-head">
        <div>
          <Name r={r} />
          <p>{r.basics.headline}</p>
          <InlineContact r={r} />
        </div>
        <Photo r={r} />
      </header>
      <div className="classic-grid">
        <section>
          <Timeline title="EXPERIENCE" items={r.experience} />
          <Education items={r.education} />
          <Certifications items={r.certifications} />
          <Projects items={r.projects} />
        </section>
        <aside>
          <TextSection title="SUMMARY" text={r.summary} />
          <Skills skills={r.skills} bullets={false} />
          <LanguagesWithDots items={r.languages} />
          <Pills title="ACHIEVEMENTS" items={r.achievements.map((a) => a.title)} />
          <Pills title="INTERESTS" items={r.interests.map((i) => i.name)} />
          <Publications items={r.publications} />
        </aside>
      </div>
    </article>
  );
}

// ── Template 3: Purple Compact ────────────────────────────────────────────────
function PurpleCompact({ r, design }: { r: Resume; design?: DesignTokens }) {
  const style = designStyle(design, design?.accentColor ? { "--pc-accent": design.accentColor } : {});
  return (
    <article className="resume resume-purple" style={style}>
      <div className="purple-grid">
        <aside className="purple-left">
          <Identity r={r} />
          <Contact r={r} />
          <TextSection title="SUMMARY" text={r.summary} />
          <Skills skills={r.skills} bullets />
        </aside>
        <section className="purple-right">
          <Timeline title="EXPERIENCE" items={r.experience} />
          <Education items={r.education} />
          <Certifications items={r.certifications} />
          <LanguagesInline items={r.languages} />
          <Pills title="INTERESTS" items={r.interests.map((i) => i.name)} />
          <Projects items={r.projects} />
          <Publications items={r.publications} />
        </section>
      </div>
    </article>
  );
}

// ── Template 4: Modern Minimal ────────────────────────────────────────────────
function ModernMinimal({ r, design }: { r: Resume; design?: DesignTokens }) {
  const accent = design?.accentColor || "#0a7ea4";
  const style = designStyle(design, { "--mm-accent": accent });
  return (
    <article className="resume resume-minimal" style={style}>
      <header className="minimal-head">
        <div className="minimal-name-wrap">
          <h1><span>{r.basics.firstName}</span> <span className="minimal-last">{r.basics.lastName}</span></h1>
          <p className="minimal-headline">{r.basics.headline}</p>
        </div>
        <div className="minimal-contact">
          {[r.basics.email, r.basics.phone, r.basics.location, r.basics.linkedin].filter(Boolean).map((v, i) => (
            <span key={i}>{v}</span>
          ))}
        </div>
      </header>
      {r.summary ? <section className="minimal-summary"><p>{r.summary}</p></section> : null}
      <div className="minimal-body">
        <Timeline title="EXPERIENCE" items={r.experience} />
        <Education items={r.education} />
        <Projects items={r.projects} />
        <Certifications items={r.certifications} />
        <CustomSections sections={r.customSections} />
      </div>
      <div className="minimal-sidebar">
        <Skills skills={r.skills} bullets={false} />
        <LanguagesWithDots items={r.languages} />
        <Pills title="INTERESTS" items={r.interests.map((i) => i.name)} />
        <Publications items={r.publications} />
      </div>
    </article>
  );
}

// ── Template 5: Executive ─────────────────────────────────────────────────────
function Executive({ r, design }: { r: Resume; design?: DesignTokens }) {
  const accent = design?.accentColor || "#1a1a2e";
  const style = designStyle(design, { "--ex-accent": accent });
  return (
    <article className="resume resume-executive" style={style}>
      <header className="executive-head">
        <div>
          <h1 className="executive-name">
            <span>{r.basics.firstName}</span>{" "}<span>{r.basics.lastName}</span>
          </h1>
          <p className="executive-headline">{r.basics.headline}</p>
        </div>
        <Photo r={r} />
      </header>
      <div className="executive-contact">
        {[r.basics.email, r.basics.phone, r.basics.location, r.basics.linkedin, r.basics.website].filter(Boolean).map((v, i) => (
          <span key={i}>{v}</span>
        ))}
      </div>
      {r.summary ? (
        <section className="resume-section executive-summary">
          <h2>EXECUTIVE SUMMARY</h2>
          <p className="summary-text">{r.summary}</p>
        </section>
      ) : null}
      <div className="executive-grid">
        <section className="executive-main">
          <Timeline title="EXPERIENCE" items={r.experience} />
          <Projects items={r.projects} />
          <CustomSections sections={r.customSections} />
        </section>
        <aside className="executive-side">
          <Skills skills={r.skills} bullets />
          <Education items={r.education} />
          <Certifications items={r.certifications} />
          <LanguagesWithDots items={r.languages} />
          <Pills title="ACHIEVEMENTS" items={r.achievements.map((a) => a.title)} />
        </aside>
      </div>
    </article>
  );
}

// ── Template 6: Teal Pro ──────────────────────────────────────────────────────
function TealPro({ r, design }: { r: Resume; design?: DesignTokens }) {
  const accent = design?.accentColor || "#0d9488";
  const style = designStyle(design, { "--tp-accent": accent });
  return (
    <article className="resume resume-teal" style={style}>
      <aside className="teal-side">
        <Identity r={r} />
        <Contact r={r} />
        <Skills skills={r.skills} bullets />
        <LanguagesWithDots items={r.languages} />
        <Pills title="INTERESTS" items={r.interests.map((i) => i.name)} />
      </aside>
      <section className="teal-main">
        {r.summary ? <TextSection title="PROFILE" text={r.summary} /> : null}
        <Timeline title="EXPERIENCE" items={r.experience} />
        <Education items={r.education} />
        <Projects items={r.projects} />
        <Certifications items={r.certifications} />
        <Publications items={r.publications} />
        <CustomSections sections={r.customSections} />
      </section>
    </article>
  );
}

// ── Template 7: Warm Earth ────────────────────────────────────────────────────
function WarmEarth({ r, design }: { r: Resume; design?: DesignTokens }) {
  const accent = design?.accentColor || "#b45309";
  const style = designStyle(design, { "--we-accent": accent });
  return (
    <article className="resume resume-warm" style={style}>
      <header className="warm-head">
        <div className="warm-name-area">
          <h1><span>{r.basics.firstName}</span> <span>{r.basics.lastName}</span></h1>
          <p>{r.basics.headline}</p>
        </div>
        <Photo r={r} />
      </header>
      <div className="warm-body">
        <aside className="warm-left">
          <Contact r={r} />
          <Skills skills={r.skills} bullets />
          <LanguagesWithDots items={r.languages} />
          <Pills title="INTERESTS" items={r.interests.map((i) => i.name)} />
          <Certifications items={r.certifications} />
        </aside>
        <section className="warm-right">
          {r.summary ? <TextSection title="ABOUT" text={r.summary} /> : null}
          <Timeline title="EXPERIENCE" items={r.experience} />
          <Education items={r.education} />
          <Projects items={r.projects} />
          <CustomSections sections={r.customSections} />
        </section>
      </div>
    </article>
  );
}

// ── Template 8: ATS Clean ─────────────────────────────────────────────────────
function ATSClean({ r }: { r: Resume; design?: DesignTokens }) {
  return (
    <article className="resume resume-ats">
      <header className="ats-head">
        <h1>{[r.basics.firstName, r.basics.lastName].join(" ")}</h1>
        <p className="ats-headline">{r.basics.headline}</p>
        <p className="ats-contact">
          {[r.basics.email, r.basics.phone, r.basics.location, r.basics.linkedin].filter(Boolean).join("  |  ")}
        </p>
      </header>
      {r.summary ? (
        <section className="ats-section">
          <h2>SUMMARY</h2>
          <p>{r.summary}</p>
        </section>
      ) : null}
      <section className="ats-section">
        <h2>EXPERIENCE</h2>
        {r.experience.filter((e) => !e.hidden).map((e) => (
          <div key={e.id} className="ats-entry">
            <p><strong>{e.organization}</strong> — {e.title} | {e.period}{e.location ? `, ${e.location}` : ""}</p>
            {e.bullets.length > 0 && <ul>{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>}
          </div>
        ))}
      </section>
      <section className="ats-section">
        <h2>EDUCATION</h2>
        {r.education.filter((e) => !e.hidden).map((e) => (
          <div key={e.id} className="ats-entry">
            <p><strong>{e.organization}</strong> — {e.degree} | {e.period}</p>
          </div>
        ))}
      </section>
      {r.skills.length > 0 && (
        <section className="ats-section">
          <h2>SKILLS</h2>
          {r.skills.filter((s) => !s.hidden).map((s) => (
            <p key={s.id}><strong>{s.name}:</strong> {s.keywords.join(", ")}</p>
          ))}
        </section>
      )}
      {r.certifications.length > 0 && (
        <section className="ats-section">
          <h2>CERTIFICATIONS</h2>
          {r.certifications.filter((c) => !c.hidden).map((c) => (
            <p key={c.id}>{c.title}{c.issuer ? ` — ${c.issuer}` : ""}{c.date ? `, ${c.date}` : ""}</p>
          ))}
        </section>
      )}
      {r.languages.length > 0 && (
        <section className="ats-section">
          <h2>LANGUAGES</h2>
          <p>{r.languages.filter((l) => !l.hidden).map((l) => `${l.language}${l.fluency ? ` (${l.fluency})` : ""}`).join("  |  ")}</p>
        </section>
      )}
    </article>
  );
}

// ── Registry & render ─────────────────────────────────────────────────────────

export const EXTENDED_TEMPLATES = [
  ...TEMPLATES,
  { id: "modern-minimal" as TemplateId, name: "Modern Minimal", pageSize: "A4" as const },
  { id: "executive" as TemplateId, name: "Executive", pageSize: "Letter" as const },
  { id: "teal-pro" as TemplateId, name: "Teal Pro", pageSize: "A4" as const },
  { id: "warm-earth" as TemplateId, name: "Warm Earth", pageSize: "A4" as const },
  { id: "ats-clean" as TemplateId, name: "ATS Clean", pageSize: "Letter" as const }
];

const ALL_IDS = EXTENDED_TEMPLATES.map((t) => t.id);

export function ResumeView({ resume, templateId, design }: { resume: Partial<Resume>; templateId?: TemplateId; design?: DesignTokens }) {
  const r = normalizeResume(resume);
  const id = ALL_IDS.includes(templateId as TemplateId) ? templateId! : "dark-sidebar";
  if (id === "classic-blue-lines") return <ClassicBlue r={r} design={design} />;
  if (id === "purple-compact") return <PurpleCompact r={r} design={design} />;
  if (id === "modern-minimal") return <ModernMinimal r={r} design={design} />;
  if (id === "executive") return <Executive r={r} design={design} />;
  if (id === "teal-pro") return <TealPro r={r} design={design} />;
  if (id === "warm-earth") return <WarmEarth r={r} design={design} />;
  if (id === "ats-clean") return <ATSClean r={r} design={design} />;
  return <DarkSidebar r={r} design={design} />;
}
