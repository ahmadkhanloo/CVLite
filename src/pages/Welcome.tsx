import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../store/library";
import { useSettings } from "../store/settings";
import { useT } from "../i18n/useT";
import { EXTENDED_TEMPLATES } from "../templates";

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
  { icon: "🔒", title: "featPrivacyTitle", desc: "featPrivacyDesc" },
  { icon: "✈️", title: "featOfflineTitle", desc: "featOfflineDesc" },
  { icon: "🌐", title: "featBilingualTitle", desc: "featBilingualDesc" },
  { icon: "🎨", title: "featTemplatesTitle", desc: "featTemplatesDesc" },
  { icon: "📄", title: "featExportTitle", desc: "featExportDesc" },
  { icon: "✨", title: "featAiTitle", desc: "featAiDesc" }
] as const;

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

  const themeIcon = theme === "dark" ? "☀︎" : theme === "light" ? "☽" : "◐";

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
              {themeIcon}
            </button>
          </div>
          <div className="tb-group">
            <button className="icon-button" type="button" onClick={() => navigate("/library")}>{t("welcomeLibrary")}</button>
          </div>
        </div>
      </header>

      <main className="welcome-main">
        <section className="welcome-hero">
          <span className="welcome-kicker">◆ {t("welcomeKicker")}</span>
          <h1 className="welcome-title">{t("welcomeTitle")}</h1>
          <p className="welcome-lead">{t("welcomeLead")}</p>
          <div className="welcome-cta-row">
            <button className="hero-cta" type="button" onClick={startNew}>
              <span className="hero-cta-plus">+</span>
              <span>{t("welcomeStart")}</span>
            </button>
            <button className="welcome-cta-ghost" type="button" onClick={() => navigate("/library")}>
              {t("welcomeLibrary")} →
            </button>
          </div>
          <div className="welcome-templates" aria-hidden="true">
            <span className="welcome-templates-label">{t("welcomeSeeTemplates")}</span>
            <div className="welcome-template-chips">
              {EXTENDED_TEMPLATES.map((tpl) => (
                <span key={tpl.id} className="welcome-template-chip">{tpl.name}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="welcome-features">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{t(f.title)}</h3>
              <p className="feature-desc">{t(f.desc)}</p>
            </div>
          ))}
        </section>

        <footer className="welcome-footer">
          <span>{t("welcomeFooter")}</span>
          <a className="welcome-footer-link" href="https://github.com/ahmadkhanloo/CVLite" target="_blank" rel="noreferrer noopener">GitHub ↗</a>
        </footer>
      </main>
    </div>
  );
}
