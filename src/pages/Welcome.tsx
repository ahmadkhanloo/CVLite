import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../store/library";
import { useSettings } from "../store/settings";
import { useT } from "../i18n/useT";
import { EXTENDED_TEMPLATES, templateCopy } from "../templates";
import { Icon } from "../components/Icon";
import type { ResumeLocale, TemplateId } from "../types/resume";

function useApplyShell() {
  const language = useSettings((s) => s.language);
  const theme = useSettings((s) => s.theme);
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      root.lang = language;
      root.dir = language === "fa" ? "rtl" : "ltr";
      root.dataset.theme = theme === "system" ? (media.matches ? "dark" : "light") : theme;
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [language, theme]);
}

const FEATURES = [
  { icon: "lock", title: "featPrivacyTitle", desc: "featPrivacyDesc" },
  { icon: "plane", title: "featOfflineTitle", desc: "featOfflineDesc" },
  { icon: "world", title: "featBilingualTitle", desc: "featBilingualDesc" },
  { icon: "paint", title: "featTemplatesTitle", desc: "featTemplatesDesc" },
  { icon: "file", title: "featExportTitle", desc: "featExportDesc" },
  { icon: "sparkles", title: "featAiTitle", desc: "featAiDesc" }
] as const;

const GITHUB_URL = "https://github.com/ahmadkhanloo/CVLite";

const previewFor = (id: TemplateId, locale: ResumeLocale) => new URL(`../../assets/templates/${id}.${locale}.png`, import.meta.url).href;

const TEMPLATE_PREVIEWS: Array<{ id: TemplateId; persona: Record<ResumeLocale, string> }> = [
  { id: "dark-sidebar", persona: { en: "Rostam Tahmtan", fa: "رستم تهمتن" } },
  { id: "classic-blue-lines", persona: { en: "Gordafarid", fa: "گردآفرید" } },
  { id: "purple-compact", persona: { en: "Sohrab", fa: "سهراب" } },
  { id: "modern-minimal", persona: { en: "Siavash", fa: "سیاوش" } },
  { id: "executive", persona: { en: "Esfandiar", fa: "اسفندیار" } },
  { id: "teal-pro", persona: { en: "Rudabeh", fa: "رودابه" } },
  { id: "warm-earth", persona: { en: "Tahmineh", fa: "تهمینه" } },
  { id: "ats-clean", persona: { en: "Afrasiab", fa: "افراسیاب" } },
  { id: "gordafarid-defender", persona: { en: "Gordafarid", fa: "گردآفرید" } },
  { id: "rudabeh-heritage", persona: { en: "Rudabeh", fa: "رودابه" } }
];

export function Welcome() {
  const t = useT();
  const navigate = useNavigate();
  const library = useLibrary();
  const language = useSettings((s) => s.language);
  const theme = useSettings((s) => s.theme);
  const setLanguage = useSettings((s) => s.setLanguage);
  const setTheme = useSettings((s) => s.setTheme);
  useApplyShell();

  useEffect(() => { library.load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const themeIcon = theme === "dark" ? "sun" : theme === "light" ? "moon" : "system";

  async function startNew() {
    const doc = await library.createDoc(t("myResumes"));
    navigate(`/edit/${doc.id}`);
  }

  return (
    <div className="welcome-page">
      <header className="topbar">
        <div className="topbar-brand">
          <div className="brand-mark">CV</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>CVLite</span>
        </div>
        <div className="topbar-actions">
          <div className="tb-group" style={{ paddingInlineStart: 0, borderInlineStart: "none" }}>
            <button className="tb-badge" type="button" onClick={() => setLanguage(language === "fa" ? "en" : "fa")} title={t("language")}>
              {language === "fa" ? "FA" : "EN"}
            </button>
            <button className="tb-icon-btn" type="button" title={t("theme")} onClick={() => setTheme(theme === "system" ? "light" : theme === "light" ? "dark" : "system")}>
              <Icon name={themeIcon} />
            </button>
          </div>
          <div className="tb-group">
            <a className="icon-button" href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
              <Icon name="github" />
              GitHub
              <Icon name="external" size={14} />
            </a>
          </div>
          <div className="tb-group">
            <button className="icon-button" type="button" onClick={() => navigate("/library")}>{t("welcomeLibrary")}</button>
          </div>
        </div>
      </header>

      <main className="welcome-main">
        <section className="welcome-hero">
          <span className="welcome-kicker"><Icon name="lock" size={14} /> {t("welcomeKicker")}</span>
          <h1 className="welcome-title">{t("welcomeTitle")}</h1>
          <p className="welcome-lead">{t("welcomeLead")}</p>
          <div className="welcome-cta-row">
            <button className="hero-cta" type="button" onClick={startNew}>
              <Icon name="plus" />
              <span>{t("welcomeStart")}</span>
            </button>
            <button className="welcome-cta-ghost" type="button" onClick={() => navigate("/library")}>
              <Icon name="library" />
              {t("welcomeLibrary")}
            </button>
          </div>
          <div className="welcome-templates" aria-hidden="true">
            <span className="welcome-templates-label">{t("welcomeSeeTemplates")}</span>
            <div className="welcome-template-chips">
              {EXTENDED_TEMPLATES.map((tpl) => (
                <span key={tpl.id} className="welcome-template-chip">{templateCopy(tpl.id as TemplateId, language).name}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="welcome-gallery" aria-label={t("welcomeGalleryLabel")}>
          {TEMPLATE_PREVIEWS.map((item) => {
            const template = EXTENDED_TEMPLATES.find((tpl) => tpl.id === item.id);
            const copy = template ? templateCopy(template.id as TemplateId, language) : null;
            return (
              <article className="welcome-gallery-card" key={item.id}>
                <img src={previewFor(item.id, language)} alt={`${copy?.name || item.id} - ${item.persona[language]}`} loading="lazy" />
                <div>
                  <strong>{item.persona[language]}</strong>
                  <span>{copy?.name || item.id}</span>
                </div>
              </article>
            );
          })}
        </section>

        <section className="welcome-features">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon"><Icon name={f.icon} size={22} /></div>
              <h3 className="feature-title">{t(f.title)}</h3>
              <p className="feature-desc">{t(f.desc)}</p>
            </div>
          ))}
        </section>

        <footer className="welcome-footer">
          <span>{t("welcomeFooter")}</span>
          <a className="welcome-footer-link" href={GITHUB_URL} target="_blank" rel="noreferrer noopener">GitHub</a>
        </footer>
      </main>
    </div>
  );
}
