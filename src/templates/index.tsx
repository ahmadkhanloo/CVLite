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

function EmptyTemplateHint() {
  return (
    <div className="template-empty">
      <h2>Start your resume</h2>
      <p>Add your name, headline, experience, and skills in the editor. This template will fill itself from your data.</p>
    </div>
  );
}

function AchievementCards({ items }: { items: Resume["achievements"] }) {
  const visible = (items || []).filter((item) => !item.hidden && (item.title || item.description));
  if (!visible.length) return null;
  return (
    <section className="resume-section achievement-cards">
      <h2>ACHIEVEMENTS</h2>
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

function TemplateContact({ r }: { r: Resume }) {
  const rows = [
    ["زادگاه", r.basics.location],
    ["نقش", r.basics.extra || r.basics.headline],
    ["ایمیل", r.basics.email],
    ["وب", r.basics.website || r.basics.linkedin]
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

function SkillBars({ skills }: { skills: Resume["skills"] }) {
  const visible = (skills || []).filter((skill) => !skill.hidden && skill.name);
  if (!visible.length) return null;
  return (
    <section className="heritage-skillbars">
      <h2>مهارت ها</h2>
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

function HeritageTimeline({ items }: { items: Resume["experience"] }) {
  const visible = (items || []).filter((item) => !item.hidden && (item.organization || item.title));
  if (!visible.length) return null;
  return (
    <section className="heritage-timeline">
      <h2>مسیر زندگی و تجربه</h2>
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

// ── Template 2: Corporate Classic ─────────────────────────────────────────────
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

// ── Template 3: Compact Professional ──────────────────────────────────────────
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

// ── Template 5: Executive Leadership ──────────────────────────────────────────
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

// ── Template 6: Product & Design ──────────────────────────────────────────────
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

// ── Template 7: Creative Editorial ────────────────────────────────────────────
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

// ── Template 8: ATS Plain Text ────────────────────────────────────────────────
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

// ── Template 9: Gordafarid Defender ─────────────────────────────────────────
function GordafaridDefender({ r, design }: { r: Resume; design?: DesignTokens }) {
  const accent = design?.accentColor || "#c99b4a";
  const style = designStyle(design, { "--gd-accent": accent });
  const empty = isResumeEmpty(r);
  const strengths = cleanList(r.skills.flatMap((s) => s.keywords).slice(0, 8), ["شجاعت و تعهد", "تفکر استراتژیک", "رهبری الهام بخش", "مدافع مرزها"]);
  const values = cleanList(r.interests.map((i) => i.name), ["هدف محور", "مردم محور", "عادل و منصف", "پایدار و مقاوم"]);
  return (
    <article className="resume resume-gordafarid" style={style} dir="rtl">
      <header className="gord-hero-exact">
        <div className="gord-photo-panel">
          {r.basics.photo ? <img src={r.basics.photo} alt="" /> : <div className="gord-hero-placeholder" />}
        </div>
        <div className="gord-title-panel">
          <div className="ornament">◇</div>
          <h1><span>{r.basics.firstName || "گردآفرید"}</span><span>{r.basics.lastName || ""}</span></h1>
          <p>{r.basics.headline || "استراتژیست دفاعی، رهبر میدانی و الهام بخش"}</p>
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
              <h2>اطلاعات فردی</h2>
              <TemplateContact r={r} />
            </section>
            <SkillBars skills={r.skills} />
            <blockquote>{r.basics.extra || "من به نام خویش، به نام ایران می جنگم و پاسدار مرزهایم."}</blockquote>
          </aside>
          <main className="gord-content-exact">
            <TextSection title="درباره من" text={r.summary} />
            <div className="gord-two-cols">
              <section>
                <h2>دستاوردها و تاثیرگذاری</h2>
                <AchievementCards items={r.achievements} />
                <Projects items={r.projects} />
              </section>
              <section>
                <h2>تجربه و نقش آفرینی</h2>
                <Timeline title="" items={r.experience} />
              </section>
            </div>
            <section className="gord-values">
              <h2>نگرش و رویکرد</h2>
              <MiniIconList items={values.slice(0, 4)} />
            </section>
          </main>
        </div>
        <footer className="gord-footer">
          <span>برای ایران، با ایمان، تا پای جان.</span>
          <b>{strengths.slice(0, 3).join("   ·   ")}</b>
        </footer>
        </>
      )}
    </article>
  );
}

// ── Template 10: Rudabeh Heritage ───────────────────────────────────────────
function RudabehHeritage({ r, design }: { r: Resume; design?: DesignTokens }) {
  const accent = design?.accentColor || "#8f4a63";
  const style = designStyle(design, { "--rh-accent": accent });
  const empty = isResumeEmpty(r);
  const strengths = cleanList(r.interests.map((i) => i.name), ["بلندهمتی و اصالت", "خردمندی و آینده نگری", "وفاداری به ارزش ها", "توانایی ایجاد اتحاد"]);
  const skills = cleanList(r.skills.flatMap((s) => s.keywords).slice(0, 8), ["دیپلماسی و مذاکره", "ارتباط بین فرهنگی", "نفوذ کلام", "مدیریت روابط"]);
  return (
    <article className="resume resume-rudabeh" style={style} dir="rtl">
      <aside className="rudabeh-side-exact">
        <div className="rudabeh-arch">
          {r.basics.photo ? <img src={r.basics.photo} alt="" /> : <div />}
        </div>
        <blockquote>{r.basics.extra || "عشق را با خرد درآمیختم تا پیوندی بسازم که دو خاندان را یکی کند."}</blockquote>
        <TemplateContact r={r} />
      </aside>
      <main className="rudabeh-main-exact">
        <header className="rudabeh-head-exact">
          <div className="ornament">❧</div>
          <h1><span>{r.basics.firstName || "رودابه"}</span><span>{r.basics.lastName || ""}</span></h1>
          <p>{r.basics.headline || "بانوی دیپلماسی فرهنگی و پیوندساز خاندان ها"}</p>
        </header>
        {empty ? <EmptyTemplateHint /> : (
          <>
            <TextSection title="خلاصه" text={r.summary} />
            <div className="rudabeh-columns">
              <section>
                <h2>نقاط قوت</h2>
                <MiniIconList items={strengths.slice(0, 6)} />
              </section>
              <section>
                <h2>مهارت ها و توانمندی ها</h2>
                <MiniIconList items={skills.slice(0, 8)} />
              </section>
            </div>
            <AchievementCards items={r.achievements} />
            <Projects items={r.projects} />
            <HeritageTimeline items={r.experience} />
            <Education items={r.education} />
            <CustomSections sections={r.customSections} />
          </>
        )}
      </main>
      <footer className="rudabeh-footer">هر پیوندی که بر پایه احترام، عشق و خرد بنا شود، جاودانه خواهد ماند.</footer>
    </article>
  );
}

// ── Registry & render ─────────────────────────────────────────────────────────

export const EXTENDED_TEMPLATES = [
  ...TEMPLATES
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
  if (id === "gordafarid-defender") return <GordafaridDefender r={r} design={design} />;
  if (id === "rudabeh-heritage") return <RudabehHeritage r={r} design={design} />;
  return <DarkSidebar r={r} design={design} />;
}
