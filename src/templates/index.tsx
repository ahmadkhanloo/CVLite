import type { CSSProperties } from "react";
import type { DesignTokens } from "../types/library";
import type { Resume, ResumeLocale, TemplateId } from "../types/resume";
import { TEMPLATES } from "../types/resume";
import { normalizeResume } from "../data/defaults";
import {
  Bullets, Certifications, Contact, CustomSections, Education, Identity,
  InlineContact, label, LanguagesInline, LanguagesWithDots, Name, Photo,
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

function isResumeEmpty(r: Resume): boolean {
  const basics = Object.values(r.basics).some(Boolean);
  const sections = [
    r.summary,
    r.experience.length,
    r.education.length,
    r.skills.length,
    r.projects.length,
    r.certifications.length,
    r.languages.length,
    r.interests.length,
    r.publications.length,
    r.achievements.length,
    r.customSections.length
  ];
  return !basics && !sections.some(Boolean);
}

const dirFor = (locale: ResumeLocale) => locale === "fa" ? "rtl" : "ltr";

// Decorative copy + defaults for the Shahnameh-themed templates, per locale.
const HERITAGE: Record<ResumeLocale, Record<string, string | string[]>> = {
  fa: {
    contactBirthplace: "زادگاه",
    contactRole: "نقش",
    contactEmail: "ایمیل",
    contactWeb: "وب",
    gordName: "گردآفرید",
    gordHeadline: "استراتژیست دفاعی، رهبر میدانی و الهام بخش",
    gordQuote: "من به نام خویش، به نام ایران می جنگم و پاسدار مرزهایم.",
    gordFooter: "برای ایران، با ایمان، تا پای جان.",
    gordStrengths: ["شجاعت و تعهد", "تفکر استراتژیک", "رهبری الهام بخش", "مدافع مرزها"],
    gordValues: ["هدف محور", "مردم محور", "عادل و منصف", "پایدار و مقاوم"],
    rudName: "رودابه",
    rudHeadline: "بانوی دیپلماسی فرهنگی و پیوندساز خاندان ها",
    rudQuote: "عشق را با خرد درآمیختم تا پیوندی بسازم که دو خاندان را یکی کند.",
    rudFooter: "هر پیوندی که بر پایه احترام، عشق و خرد بنا شود، جاودانه خواهد ماند.",
    rudStrengths: ["بلندهمتی و اصالت", "خردمندی و آینده نگری", "وفاداری به ارزش ها", "توانایی ایجاد اتحاد"],
    rudSkills: ["دیپلماسی و مذاکره", "ارتباط بین فرهنگی", "نفوذ کلام", "مدیریت روابط"]
  },
  en: {
    contactBirthplace: "Origin",
    contactRole: "Role",
    contactEmail: "Email",
    contactWeb: "Web",
    gordName: "Gordafarid",
    gordHeadline: "Defense strategist, field leader, and inspiring force",
    gordQuote: "I fight in my own name, in the name of my homeland, and I guard its borders.",
    gordFooter: "For my homeland, with faith, to the very end.",
    gordStrengths: ["Courage & commitment", "Strategic thinking", "Inspiring leadership", "Border defender"],
    gordValues: ["Purpose-driven", "People-first", "Just & fair", "Resilient"],
    rudName: "Rudabeh",
    rudHeadline: "Lady of cultural diplomacy and uniter of houses",
    rudQuote: "I blended love with wisdom to build a bond that unites two houses as one.",
    rudFooter: "Any bond built on respect, love, and wisdom will endure forever.",
    rudStrengths: ["Ambition & authenticity", "Wisdom & foresight", "Loyalty to values", "Building alliances"],
    rudSkills: ["Diplomacy & negotiation", "Cross-cultural communication", "Persuasion", "Relationship management"]
  }
};

const ht = (locale: ResumeLocale, key: string): string => (HERITAGE[locale][key] as string) ?? (HERITAGE.en[key] as string);
const htList = (locale: ResumeLocale, key: string): string[] => (HERITAGE[locale][key] as string[]) ?? (HERITAGE.en[key] as string[]);

function EmptyTemplateHint() {
  return (
    <div className="template-empty">
      <h2>Start your resume</h2>
      <p>Add your name, headline, experience, and skills in the editor. This template will fill itself from your data.</p>
    </div>
  );
}

function AchievementCards({ items, locale = "en" }: { items: Resume["achievements"]; locale?: ResumeLocale }) {
  const visible = (items || []).filter((item) => !item.hidden && (item.title || item.description));
  if (!visible.length) return null;
  return (
    <section className="resume-section achievement-cards">
      <h2>{label(locale, "achievements")}</h2>
      <div>
        {visible.map((item) => (
          <article key={item.id}>
            <h3>{item.title}</h3>
            {item.description ? <p>{item.description}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function cleanList(items: Array<string | undefined>, fallback: string[]) {
  const values = items.filter(Boolean) as string[];
  return values.length ? values : fallback;
}

function TemplateContact({ r, locale }: { r: Resume; locale: ResumeLocale }) {
  const rows = [
    [ht(locale, "contactBirthplace"), r.basics.location],
    [ht(locale, "contactRole"), r.basics.extra || r.basics.headline],
    [ht(locale, "contactEmail"), r.basics.email],
    [ht(locale, "contactWeb"), r.basics.website || r.basics.linkedin]
  ].filter((row) => row[1]);
  if (!rows.length) return null;
  return (
    <div className="heritage-contact">
      {rows.map(([label, value]) => (
        <p key={label}>
          <span>{label}</span>
          <b>{value}</b>
        </p>
      ))}
    </div>
  );
}

function SkillBars({ skills, locale }: { skills: Resume["skills"]; locale: ResumeLocale }) {
  const visible = (skills || []).filter((skill) => !skill.hidden && skill.name);
  if (!visible.length) return null;
  return (
    <section className="heritage-skillbars">
      <h2>{label(locale, "skills")}</h2>
      {visible.flatMap((skill) => {
        const words = skill.keywords.length ? skill.keywords : [skill.name];
        const level = Math.max(62, Math.min(98, (Number(skill.level) || 4) * 18 + 8));
        return words.slice(0, 3).map((word, index) => (
          <p key={`${skill.id}-${word}`}>
            <span>{index === 0 ? skill.name : word}</span>
            <i><b style={{ width: `${level - index * 7}%` }} /></i>
          </p>
        ));
      })}
    </section>
  );
}

function MiniIconList({ items }: { items: string[] }) {
  return (
    <div className="mini-icon-list">
      {items.map((item, index) => (
        <p key={item}>
          <span>{["◇", "◈", "✦", "✧", "◆", "◉"][index % 6]}</span>
          <b>{item}</b>
        </p>
      ))}
    </div>
  );
}

function HeritageTimeline({ items, locale }: { items: Resume["experience"]; locale: ResumeLocale }) {
  const visible = (items || []).filter((item) => !item.hidden && (item.organization || item.title));
  if (!visible.length) return null;
  return (
    <section className="heritage-timeline">
      <h2>{label(locale, "lifePath")}</h2>
      <div>
        {visible.slice(0, 4).map((item) => (
          <article key={item.id}>
            <span />
            <h3>{item.period || item.organization}</h3>
            <p>{item.title || item.organization}</p>
            <small>{(item.bullets || [])[0] || item.location}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

// ── Template 1: Technical Sidebar ─────────────────────────────────────────────
function DarkSidebar({ r, design, locale }: { r: Resume; design?: DesignTokens; locale: ResumeLocale }) {
  const style = designStyle(design, design?.accentColor ? { "--ds-sidebar": design.accentColor } : {});
  return (
    <article className="resume resume-dark" style={style} dir={dirFor(locale)}>
      <aside className="resume-side">
        <Identity r={r} />
        <Contact r={r} />
        <TextSection title={label(locale, "summary")} text={r.summary} />
        <Skills skills={r.skills} bullets locale={locale} />
        <Pills title={label(locale, "interests")} items={r.interests.map((i) => i.name)} />
        <Pills title={label(locale, "languages")} items={r.languages.map((l) => l.language)} />
      </aside>
      <section className="resume-main">
        <Timeline title={label(locale, "experience")} items={r.experience} />
        <Education items={r.education} locale={locale} />
        <Certifications items={r.certifications} locale={locale} />
        <Projects items={r.projects} locale={locale} />
        <Publications items={r.publications} locale={locale} />
        <CustomSections sections={r.customSections} />
      </section>
    </article>
  );
}

// ── Template 2: Corporate Classic ─────────────────────────────────────────────
function ClassicBlue({ r, design, locale }: { r: Resume; design?: DesignTokens; locale: ResumeLocale }) {
  const style = designStyle(design, design?.accentColor ? { "--cb-accent": design.accentColor } : {});
  return (
    <article className="resume resume-classic" style={style} dir={dirFor(locale)}>
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
          <Timeline title={label(locale, "experience")} items={r.experience} />
          <Education items={r.education} locale={locale} />
          <Certifications items={r.certifications} locale={locale} />
          <Projects items={r.projects} locale={locale} />
        </section>
        <aside>
          <TextSection title={label(locale, "summary")} text={r.summary} />
          <Skills skills={r.skills} bullets={false} locale={locale} />
          <LanguagesWithDots items={r.languages} locale={locale} />
          <Pills title={label(locale, "achievements")} items={r.achievements.map((a) => a.title)} />
          <Pills title={label(locale, "interests")} items={r.interests.map((i) => i.name)} />
          <Publications items={r.publications} locale={locale} />
        </aside>
      </div>
    </article>
  );
}

// ── Template 3: Compact Professional ──────────────────────────────────────────
function PurpleCompact({ r, design, locale }: { r: Resume; design?: DesignTokens; locale: ResumeLocale }) {
  const style = designStyle(design, design?.accentColor ? { "--pc-accent": design.accentColor } : {});
  return (
    <article className="resume resume-purple" style={style} dir={dirFor(locale)}>
      <div className="purple-grid">
        <aside className="purple-left">
          <Identity r={r} />
          <Contact r={r} />
          <TextSection title={label(locale, "summary")} text={r.summary} />
          <Skills skills={r.skills} bullets locale={locale} />
        </aside>
        <section className="purple-right">
          <Timeline title={label(locale, "experience")} items={r.experience} />
          <Education items={r.education} locale={locale} />
          <Certifications items={r.certifications} locale={locale} />
          <LanguagesInline items={r.languages} locale={locale} />
          <Pills title={label(locale, "interests")} items={r.interests.map((i) => i.name)} />
          <Projects items={r.projects} locale={locale} />
          <Publications items={r.publications} locale={locale} />
        </section>
      </div>
    </article>
  );
}

// ── Template 4: Modern Minimal ────────────────────────────────────────────────
function ModernMinimal({ r, design, locale }: { r: Resume; design?: DesignTokens; locale: ResumeLocale }) {
  const accent = design?.accentColor || "#0a7ea4";
  const style = designStyle(design, { "--mm-accent": accent });
  return (
    <article className="resume resume-minimal" style={style} dir={dirFor(locale)}>
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
        <Timeline title={label(locale, "experience")} items={r.experience} />
        <Education items={r.education} locale={locale} />
        <Projects items={r.projects} locale={locale} />
        <Certifications items={r.certifications} locale={locale} />
        <CustomSections sections={r.customSections} />
      </div>
      <div className="minimal-sidebar">
        <Skills skills={r.skills} bullets={false} locale={locale} />
        <LanguagesWithDots items={r.languages} locale={locale} />
        <Pills title={label(locale, "interests")} items={r.interests.map((i) => i.name)} />
        <Publications items={r.publications} locale={locale} />
      </div>
    </article>
  );
}

// ── Template 5: Executive Leadership ──────────────────────────────────────────
function Executive({ r, design, locale }: { r: Resume; design?: DesignTokens; locale: ResumeLocale }) {
  const accent = design?.accentColor || "#1a1a2e";
  const style = designStyle(design, { "--ex-accent": accent });
  return (
    <article className="resume resume-executive" style={style} dir={dirFor(locale)}>
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
          <h2>{label(locale, "executiveSummary")}</h2>
          <p className="summary-text">{r.summary}</p>
        </section>
      ) : null}
      <div className="executive-grid">
        <section className="executive-main">
          <Timeline title={label(locale, "experience")} items={r.experience} />
          <Projects items={r.projects} locale={locale} />
          <CustomSections sections={r.customSections} />
        </section>
        <aside className="executive-side">
          <Skills skills={r.skills} bullets locale={locale} />
          <Education items={r.education} locale={locale} />
          <Certifications items={r.certifications} locale={locale} />
          <LanguagesWithDots items={r.languages} locale={locale} />
          <Pills title={label(locale, "achievements")} items={r.achievements.map((a) => a.title)} />
        </aside>
      </div>
    </article>
  );
}

// ── Template 6: Product & Design ──────────────────────────────────────────────
function TealPro({ r, design, locale }: { r: Resume; design?: DesignTokens; locale: ResumeLocale }) {
  const accent = design?.accentColor || "#0d9488";
  const style = designStyle(design, { "--tp-accent": accent });
  const visibleProjects = r.projects.filter((p) => !p.hidden && p.name);
  const metrics = r.achievements.filter((a) => !a.hidden && a.title);
  return (
    <article className="resume resume-teal" style={style} dir={dirFor(locale)}>
      <header className="teal-case-head">
        <div>
          <span className="teal-kicker">{label(locale, "profile")}</span>
          <Name r={r} />
          <p>{r.basics.headline}</p>
        </div>
        <div className="teal-contact-strip">
          {[r.basics.email, r.basics.phone, r.basics.location, r.basics.website || r.basics.linkedin].filter(Boolean).map((v, i) => (
            <span key={i}>{v}</span>
          ))}
        </div>
      </header>
      <section className="teal-case-summary">
        <p>{r.summary}</p>
        <div className="teal-metrics">
          {metrics.slice(0, 3).map((item) => (
            <article key={item.id}>
              <strong>{item.title}</strong>
              {item.description ? <span>{item.description}</span> : null}
            </article>
          ))}
        </div>
      </section>
      <main className="teal-case-grid">
        <section className="teal-case-main">
          <section className="resume-section teal-projects">
            <h2>{label(locale, "projects")}</h2>
            {visibleProjects.map((item) => (
              <article key={item.id}>
                <div>
                  <h3>{item.name}</h3>
                  <p className="entry-meta">{[item.period, item.website].filter(Boolean).join(" · ")}</p>
                </div>
                <Bullets bullets={item.bullets} />
              </article>
            ))}
          </section>
          <Timeline title={label(locale, "experience")} items={r.experience} />
          <Publications items={r.publications} locale={locale} />
          <CustomSections sections={r.customSections} />
        </section>
        <aside className="teal-case-side">
          <Skills skills={r.skills} bullets={false} locale={locale} />
          <Education items={r.education} locale={locale} />
          <Certifications items={r.certifications} locale={locale} />
          <LanguagesInline items={r.languages} locale={locale} />
          <Pills title={label(locale, "interests")} items={r.interests.map((i) => i.name)} />
        </aside>
      </main>
    </article>
  );
}

// ── Template 7: Creative Editorial ────────────────────────────────────────────
function WarmEarth({ r, design, locale }: { r: Resume; design?: DesignTokens; locale: ResumeLocale }) {
  const accent = design?.accentColor || "#b45309";
  const style = designStyle(design, { "--we-accent": accent });
  return (
    <article className="resume resume-warm" style={style} dir={dirFor(locale)}>
      <header className="warm-masthead">
        <p>{r.basics.location || r.basics.website || label(locale, "profile")}</p>
        <h1><span>{r.basics.firstName}</span> <span>{r.basics.lastName}</span></h1>
        <div>
          <strong>{r.basics.headline}</strong>
          <span>{[r.basics.email, r.basics.phone, r.basics.linkedin].filter(Boolean).join(" · ")}</span>
        </div>
      </header>
      <section className="warm-deck">
        <p>{r.summary}</p>
      </section>
      <div className="warm-story-grid">
        <section className="warm-story-main">
          <section className="resume-section warm-timeline">
            <h2>{label(locale, "experience")}</h2>
            {r.experience.filter((e) => !e.hidden && (e.organization || e.title)).map((item) => (
              <article key={item.id}>
                <time>{item.period}</time>
                <div>
                  <h3>{item.organization || item.title}</h3>
                  <p className="entry-role">{item.title}</p>
                  <Bullets bullets={item.bullets} />
                </div>
              </article>
            ))}
          </section>
          <Projects items={r.projects} locale={locale} />
          <Publications items={r.publications} locale={locale} />
          <CustomSections sections={r.customSections} />
        </section>
        <aside className="warm-story-side">
          <AchievementCards items={r.achievements} locale={locale} />
          <Skills skills={r.skills} bullets={false} locale={locale} />
          <Education items={r.education} locale={locale} />
          <Certifications items={r.certifications} locale={locale} />
          <LanguagesWithDots items={r.languages} locale={locale} />
          <Pills title={label(locale, "interests")} items={r.interests.map((i) => i.name)} />
        </aside>
      </div>
    </article>
  );
}

// ── Template 8: ATS Plain Text ────────────────────────────────────────────────
function ATSClean({ r, locale }: { r: Resume; design?: DesignTokens; locale: ResumeLocale }) {
  return (
    <article className="resume resume-ats" dir={dirFor(locale)}>
      <header className="ats-head">
        <h1>{[r.basics.firstName, r.basics.lastName].join(" ")}</h1>
        <p className="ats-headline">{r.basics.headline}</p>
        <p className="ats-contact">
          {[r.basics.email, r.basics.phone, r.basics.location, r.basics.linkedin].filter(Boolean).join("  |  ")}
        </p>
      </header>
      {r.summary ? (
        <section className="ats-section">
          <h2>{label(locale, "summary")}</h2>
          <p>{r.summary}</p>
        </section>
      ) : null}
      <section className="ats-section">
        <h2>{label(locale, "experience")}</h2>
        {r.experience.filter((e) => !e.hidden).map((e) => (
          <div key={e.id} className="ats-entry">
            <p><strong>{e.organization}</strong> — {e.title} | {e.period}{e.location ? `, ${e.location}` : ""}</p>
            {e.bullets.length > 0 && <ul>{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>}
          </div>
        ))}
      </section>
      <section className="ats-section">
        <h2>{label(locale, "education")}</h2>
        {r.education.filter((e) => !e.hidden).map((e) => (
          <div key={e.id} className="ats-entry">
            <p><strong>{e.organization}</strong> — {e.degree} | {e.period}</p>
          </div>
        ))}
      </section>
      {r.skills.length > 0 && (
        <section className="ats-section">
          <h2>{label(locale, "skills")}</h2>
          {r.skills.filter((s) => !s.hidden).map((s) => (
            <p key={s.id}><strong>{s.name}:</strong> {s.keywords.join(", ")}</p>
          ))}
        </section>
      )}
      {r.certifications.length > 0 && (
        <section className="ats-section">
          <h2>{label(locale, "certifications")}</h2>
          {r.certifications.filter((c) => !c.hidden).map((c) => (
            <p key={c.id}>{c.title}{c.issuer ? ` — ${c.issuer}` : ""}{c.date ? `, ${c.date}` : ""}</p>
          ))}
        </section>
      )}
      {r.languages.length > 0 && (
        <section className="ats-section">
          <h2>{label(locale, "languages")}</h2>
          <p>{r.languages.filter((l) => !l.hidden).map((l) => `${l.language}${l.fluency ? ` (${l.fluency})` : ""}`).join("  |  ")}</p>
        </section>
      )}
    </article>
  );
}

// ── Template 9: Gordafarid Defender ─────────────────────────────────────────
function GordafaridDefender({ r, design, locale }: { r: Resume; design?: DesignTokens; locale: ResumeLocale }) {
  const accent = design?.accentColor || "#c99b4a";
  const style = designStyle(design, { "--gd-accent": accent });
  const empty = isResumeEmpty(r);
  if (empty) {
    return <article className="resume resume-gordafarid" style={style} dir={dirFor(locale)}><EmptyTemplateHint /></article>;
  }
  const strengths = cleanList(r.skills.flatMap((s) => s.keywords).slice(0, 8), htList(locale, "gordStrengths"));
  const values = cleanList(r.interests.map((i) => i.name), htList(locale, "gordValues"));
  return (
    <article className="resume resume-gordafarid" style={style} dir={dirFor(locale)}>
      <header className="gord-hero-exact">
        <div className="gord-photo-panel">
          {r.basics.photo ? <img src={r.basics.photo} alt="" /> : <div className="gord-hero-placeholder" />}
        </div>
        <div className="gord-title-panel">
          <div className="ornament">◇</div>
          <h1><span>{r.basics.firstName || ht(locale, "gordName")}</span><span>{r.basics.lastName || ""}</span></h1>
          <p>{r.basics.headline || ht(locale, "gordHeadline")}</p>
          <i />
          {r.summary ? <strong>{r.summary}</strong> : null}
          <div className="gord-traits">
            {strengths.slice(0, 4).map((item, index) => (
              <span key={item}><b>{["✦", "♞", "◌", "◇"][index]}</b>{item}</span>
            ))}
          </div>
        </div>
      </header>
      {empty ? <EmptyTemplateHint /> : (
        <>
        <div className="gord-body-exact">
          <aside className="gord-info-card">
            <section>
              <h2>{label(locale, "personalInfo")}</h2>
              <TemplateContact r={r} locale={locale} />
            </section>
            <SkillBars skills={r.skills} locale={locale} />
            <blockquote>{r.basics.extra || ht(locale, "gordQuote")}</blockquote>
          </aside>
          <main className="gord-content-exact">
            <TextSection title={label(locale, "aboutMe")} text={r.summary} />
            <div className="gord-two-cols">
              <section>
                <h2>{label(locale, "achievementsImpact")}</h2>
                <AchievementCards items={r.achievements} locale={locale} />
                <Projects items={r.projects} locale={locale} />
              </section>
              <section>
                <h2>{label(locale, "experienceRole")}</h2>
                <Timeline title="" items={r.experience} />
              </section>
            </div>
            <section className="gord-values">
              <h2>{label(locale, "approach")}</h2>
              <MiniIconList items={values.slice(0, 4)} />
            </section>
          </main>
        </div>
        <footer className="gord-footer">
          <span>{ht(locale, "gordFooter")}</span>
          <b>{strengths.slice(0, 3).join("   ·   ")}</b>
        </footer>
        </>
      )}
    </article>
  );
}

// ── Template 10: Rudabeh Heritage ───────────────────────────────────────────
function RudabehHeritage({ r, design, locale }: { r: Resume; design?: DesignTokens; locale: ResumeLocale }) {
  const accent = design?.accentColor || "#8f4a63";
  const style = designStyle(design, { "--rh-accent": accent });
  const empty = isResumeEmpty(r);
  if (empty) {
    return <article className="resume resume-rudabeh" style={style} dir={dirFor(locale)}><EmptyTemplateHint /></article>;
  }
  const strengths = cleanList(r.interests.map((i) => i.name), htList(locale, "rudStrengths"));
  const skills = cleanList(r.skills.flatMap((s) => s.keywords).slice(0, 8), htList(locale, "rudSkills"));
  return (
    <article className="resume resume-rudabeh" style={style} dir={dirFor(locale)}>
      <aside className="rudabeh-side-exact">
        <div className="rudabeh-arch">
          {r.basics.photo ? <img src={r.basics.photo} alt="" /> : <div />}
        </div>
        <blockquote>{r.basics.extra || ht(locale, "rudQuote")}</blockquote>
        <TemplateContact r={r} locale={locale} />
      </aside>
      <main className="rudabeh-main-exact">
        <header className="rudabeh-head-exact">
          <div className="ornament">❧</div>
          <h1><span>{r.basics.firstName || ht(locale, "rudName")}</span><span>{r.basics.lastName || ""}</span></h1>
          <p>{r.basics.headline || ht(locale, "rudHeadline")}</p>
        </header>
        {empty ? <EmptyTemplateHint /> : (
          <>
            <TextSection title={label(locale, "summary")} text={r.summary} />
            <div className="rudabeh-columns">
              <section>
                <h2>{label(locale, "strengths")}</h2>
                <MiniIconList items={strengths.slice(0, 6)} />
              </section>
              <section>
                <h2>{label(locale, "skillsAbilities")}</h2>
                <MiniIconList items={skills.slice(0, 8)} />
              </section>
            </div>
            <AchievementCards items={r.achievements} locale={locale} />
            <Projects items={r.projects} locale={locale} />
            <HeritageTimeline items={r.experience} locale={locale} />
            <Education items={r.education} locale={locale} />
            <CustomSections sections={r.customSections} />
          </>
        )}
      </main>
      <footer className="rudabeh-footer">{ht(locale, "rudFooter")}</footer>
    </article>
  );
}

// ── Registry & render ─────────────────────────────────────────────────────────

export const EXTENDED_TEMPLATES = [
  ...TEMPLATES
];

const ALL_IDS = EXTENDED_TEMPLATES.map((t) => t.id);

export function ResumeView({ resume, templateId, design, locale = "en" }: { resume: Partial<Resume>; templateId?: TemplateId; design?: DesignTokens; locale?: ResumeLocale }) {
  const r = normalizeResume(resume);
  const id = ALL_IDS.includes(templateId as TemplateId) ? templateId! : "dark-sidebar";
  if (id === "classic-blue-lines") return <ClassicBlue r={r} design={design} locale={locale} />;
  if (id === "purple-compact") return <PurpleCompact r={r} design={design} locale={locale} />;
  if (id === "modern-minimal") return <ModernMinimal r={r} design={design} locale={locale} />;
  if (id === "executive") return <Executive r={r} design={design} locale={locale} />;
  if (id === "teal-pro") return <TealPro r={r} design={design} locale={locale} />;
  if (id === "warm-earth") return <WarmEarth r={r} design={design} locale={locale} />;
  if (id === "ats-clean") return <ATSClean r={r} design={design} locale={locale} />;
  if (id === "gordafarid-defender") return <GordafaridDefender r={r} design={design} locale={locale} />;
  if (id === "rudabeh-heritage") return <RudabehHeritage r={r} design={design} locale={locale} />;
  return <DarkSidebar r={r} design={design} locale={locale} />;
}
