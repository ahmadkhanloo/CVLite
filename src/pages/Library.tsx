import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../store/library";
import { useAuth } from "../store/auth";
import { useSettings } from "../store/settings";
import { useT } from "../i18n/useT";
import type { ResumeDoc } from "../types/library";
import { importBackup } from "../lib/backup";
import { downloadText } from "../lib/files";
import { importJsonResume } from "../data/importers/jsonresume";
import { normalizeRxResume } from "../data/importers/rxresume";
import { parseMarkdown } from "../data/importers/markdown";
import { uid } from "../data/defaults";
import { apiExportAllResumes, ResumeLimitError } from "../api/client";

function relativeTime(ts: number, lang: string): string {
  const diff = Date.now() - ts;
  const min = Math.round(diff / 60000);
  const hr = Math.round(diff / 3600000);
  const day = Math.round(diff / 86400000);
  const fa = lang === "fa";
  if (min < 1) return fa ? "همین حالا" : "just now";
  if (min < 60) return fa ? `${min} دقیقه پیش` : `${min}m ago`;
  if (hr < 24) return fa ? `${hr} ساعت پیش` : `${hr}h ago`;
  if (day < 30) return fa ? `${day} روز پیش` : `${day}d ago`;
  return new Date(ts).toLocaleDateString(fa ? "fa-IR" : undefined, { day: "numeric", month: "short", year: "numeric" });
}

function accentFor(templateId: string): string {
  const palettes = [
    "linear-gradient(135deg, #2563eb, #7c3aed)",
    "linear-gradient(135deg, #0d9488, #0ea5e9)",
    "linear-gradient(135deg, #db2777, #f97316)",
    "linear-gradient(135deg, #059669, #84cc16)",
    "linear-gradient(135deg, #7c3aed, #db2777)",
    "linear-gradient(135deg, #ea580c, #eab308)",
    "linear-gradient(135deg, #0891b2, #6366f1)",
    "linear-gradient(135deg, #475569, #0f172a)"
  ];
  let h = 0;
  for (let i = 0; i < templateId.length; i++) h = (h * 31 + templateId.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
}

function initials(name: string, fallback: string): string {
  const parts = (name || fallback).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "•";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ResumeCard({ doc, lang, onEdit, onDuplicate, onDelete }: { doc: ResumeDoc; lang: string; onEdit: () => void; onDuplicate: () => void; onDelete: () => void }) {
  const t = useT();
  const fullName = [doc.resume?.basics?.firstName, doc.resume?.basics?.lastName].filter(Boolean).join(" ");
  const headline = doc.resume?.basics?.headline;
  const accent = accentFor(doc.templateId);
  return (
    <div className="resume-card">
      <div className="card-accent-bar" style={{ background: accent }} />
      <div className="card-body" onClick={onEdit} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onEdit()}>
        <div className="card-head">
          <div className="card-avatar" style={{ background: accent }} aria-hidden="true">{initials(fullName, doc.name)}</div>
          <div className="card-head-text">
            <p className="card-name">{doc.name}</p>
            {fullName && <p className="card-fullname">{fullName}</p>}
          </div>
        </div>
        {headline && <p className="card-headline">{headline}</p>}
        <div className="card-meta">
          <p className="card-date">{relativeTime(doc.updatedAt, lang)}</p>
          <p className="card-template">{doc.templateId}</p>
        </div>
      </div>
      <div className="card-actions">
        <button className="mini-button" type="button" onClick={onEdit}>{t("editResume")}</button>
        <button className="mini-button" type="button" onClick={onDuplicate}>{t("duplicateResume")}</button>
        <button className="mini-button danger-text" type="button" onClick={onDelete} style={{ marginInlineStart: "auto" }}>{t("deleteResume")}</button>
      </div>
    </div>
  );
}

export function Library() {
  const t = useT();
  const navigate = useNavigate();
  const library = useLibrary();
  const auth = useAuth();
  const language = useSettings((s) => s.language);
  const theme = useSettings((s) => s.theme);
  const setLanguage = useSettings((s) => s.setLanguage);
  const setTheme = useSettings((s) => s.setTheme);

  const importRef = useRef<HTMLInputElement>(null);
  const backupRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");

  // Apply language/theme to document root
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

  // Switch library mode based on auth state, then load
  useEffect(() => {
    if (!auth.loaded) return;
    if (auth.user) {
      library.setMode("cloud");
    } else {
      library.setMode("local");
    }
    library.load().then(async () => {
      // Migrate legacy single-resume draft on first-ever local load
      if (!auth.user && library.docs.length === 0) {
        const legacy = localStorage.getItem("cvlite.resumeDraft.v1");
        if (legacy) {
          try {
            const { normalizeResume } = await import("../data/defaults");
            const resume = normalizeResume(JSON.parse(legacy));
            const now = Date.now();
            await library.saveDoc({ id: uid(), name: "My Resume (migrated)", createdAt: now, updatedAt: now, resume, templateId: "dark-sidebar", pageSize: "A4" });
            await library.load();
          } catch { /* ignore migration errors */ }
        }
      }
    });
  }, [auth.loaded, auth.user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Execute pending backup action after login redirect
  useEffect(() => {
    if (!auth.user) return;
    const raw = localStorage.getItem("cvlite.pendingAction");
    if (!raw) return;
    try {
      const { type } = JSON.parse(raw) as { type: string };
      if (type === "backup") {
        localStorage.removeItem("cvlite.pendingAction");
        void handleExportBackup();
      }
    } catch { localStorage.removeItem("cvlite.pendingAction"); }
  }, [auth.user]); // eslint-disable-line react-hooks/exhaustive-deps

  const isCloud = library.mode === "cloud";
  const count = library.docs.length;
  const maxDocs = isCloud ? 2 : 1;
  const atLimit = count >= maxDocs;

  async function handleCreate() {
    if (atLimit) {
      setStatus(isCloud ? t("resumeLimitReached") : t("loginToSaveMore"));
      return;
    }
    const doc = await library.createDoc(t("myResumes")).catch((e) => {
      if (e instanceof ResumeLimitError) { setStatus(t("resumeLimitReached")); return null; }
      throw e;
    });
    if (doc) navigate(`/edit/${doc.id}`);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (atLimit) { setStatus(isCloud ? t("resumeLimitReached") : t("loginToSaveMore")); e.target.value = ""; return; }
    try {
      const text = await file.text();
      let resume;
      if (file.name.endsWith(".json")) {
        const parsed = JSON.parse(text);
        resume = parsed.$schema?.includes("jsonresume") ? importJsonResume(parsed) : normalizeRxResume(parsed);
      } else {
        resume = parseMarkdown(text);
      }
      const now = Date.now();
      const doc: ResumeDoc = { id: uid(), name: file.name.replace(/\.(json|md|markdown)$/i, ""), createdAt: now, updatedAt: now, resume, templateId: "dark-sidebar", pageSize: "A4" };
      await library.saveDoc(doc);
      await library.load();
      navigate(`/edit/${doc.id}`);
    } catch (err) {
      setStatus(`Import failed: ${(err as Error).message}`);
    } finally {
      e.target.value = "";
    }
  }

  async function handleBackupImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const count = await importBackup(file);
      setStatus(`${t("backupReady")}: ${count} resumes`);
      await library.load();
    } catch (err) {
      setStatus(`Backup failed: ${(err as Error).message}`);
    } finally {
      e.target.value = "";
    }
  }

  async function handleExportBackup() {
    if (!auth.user) {
      localStorage.setItem("cvlite.pendingAction", JSON.stringify({ type: "backup" }));
      window.location.href = `/api/auth/google/start?returnTo=/library`;
      return;
    }
    try {
      setStatus(t("syncingToCloud"));
      const docs = isCloud ? await apiExportAllResumes() : library.docs as ResumeDoc[];
      downloadText("cvlite-backup.json", JSON.stringify(docs, null, 2), "application/json");
      setStatus(t("backupReady"));
    } catch {
      setStatus("Export failed");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t("confirmDelete"))) return;
    await library.removeDoc(id);
  }

  const themeIcon = theme === "dark" ? "☀︎" : theme === "light" ? "☽" : "◐";
  const q = query.trim().toLowerCase();
  const docs = q
    ? library.docs.filter((d) => {
        const full = [d.resume?.basics?.firstName, d.resume?.basics?.lastName, d.resume?.basics?.headline].filter(Boolean).join(" ").toLowerCase();
        return d.name.toLowerCase().includes(q) || full.includes(q);
      })
    : library.docs;
  const countLabel = language === "fa" ? `${count} رزومه` : count === 1 ? "1 resume" : `${count} resumes`;

  return (
    <div className="library-page">
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
            <label className="icon-button" title={t("importTitle")} style={{ cursor: "pointer" }}>
              ↑ {t("import")}
              <input ref={importRef} type="file" accept=".json,.md,.markdown" onChange={handleImport} />
            </label>
            <button className="icon-button" type="button" onClick={handleExportBackup}>
              ↓ {t("exportBackup")}
            </button>
            <label className="icon-button" style={{ cursor: "pointer" }}>
              ↑ {t("importBackup")}
              <input ref={backupRef} type="file" accept=".json" onChange={handleBackupImport} />
            </label>
          </div>

          {/* Auth section */}
          <div className="tb-group">
            {auth.user ? (
              <>
                {isCloud && (
                  <span className={`cloud-counter${atLimit ? " at-limit" : ""}`}>
                    {count}/2
                  </span>
                )}
                <div className="user-chip">
                  {auth.user.picture
                    ? <img className="user-avatar" src={auth.user.picture} alt={auth.user.name} referrerPolicy="no-referrer" />
                    : <span className="user-avatar user-avatar-initials">{auth.user.name?.slice(0, 1).toUpperCase()}</span>
                  }
                  <span className="user-name">{auth.user.name}</span>
                </div>
                <button className="icon-button" type="button" onClick={() => auth.logout()}>{t("signOut")}</button>
              </>
            ) : (
              <a className="primary-button" href="/api/auth/google/start?returnTo=/library">{t("signIn")}</a>
            )}
          </div>

          <div className="tb-group">
            <button className="primary-button" type="button" onClick={handleCreate} disabled={atLimit}>
              + {t("newResume")}
            </button>
          </div>
        </div>
      </header>

      <main className="library-main">
        {/* Privacy notice (cloud mode only) */}
        {isCloud && (
          <div className="privacy-notice">
            <strong>{t("privacyNoticeTitle")}:</strong> {t("privacyNoticeBody")}
          </div>
        )}

        {/* Limit banner */}
        {atLimit && !isCloud && (
          <div className="limit-banner">
            {t("anonymousDraftLimit")}{" "}
            <a href="/api/auth/google/start?returnTo=/library">{t("signIn")}</a>
          </div>
        )}
        {atLimit && isCloud && (
          <div className="limit-banner limit-banner-cloud">
            {t("resumeLimitReached")}
          </div>
        )}

        <section className="library-hero">
          <div className="hero-text">
            <span className="hero-badge">
              {isCloud ? "☁ " + t("cloudMode") : "◆ " + t("privateBadge")}
            </span>
            <h1 className="hero-title">{t("myResumes")}</h1>
            <p className="hero-sub">{t("librarySubtitle")}</p>
          </div>
          <button className="hero-cta" type="button" onClick={handleCreate} disabled={atLimit}>
            <span className="hero-cta-plus">+</span>
            <span>{t("newResume")}</span>
          </button>
        </section>

        {status && <p className="library-status">{status}</p>}

        {!library.loading && count > 0 && (
          <div className="library-controls">
            <div className="search-box">
              <span className="search-icon" aria-hidden="true">⌕</span>
              <input
                className="search-input"
                type="search"
                value={query}
                placeholder={t("searchResumes")}
                onChange={(e) => setQuery(e.target.value)}
                aria-label={t("searchResumes")}
              />
            </div>
            <span className="library-count">{countLabel}</span>
          </div>
        )}

        {library.loading ? (
          <p className="empty-note" style={{ padding: "40px 0", textAlign: "center" }}>Loading...</p>
        ) : count === 0 ? (
          <div className="library-empty">
            <div className="library-empty-icon">📄</div>
            <p>{t("noResumes")}</p>
            <button className="hero-cta" type="button" onClick={handleCreate}>
              <span className="hero-cta-plus">+</span>
              <span>{t("startFromScratch")}</span>
            </button>
          </div>
        ) : docs.length === 0 ? (
          <div className="library-empty">
            <div className="library-empty-icon">🔍</div>
            <p>{t("noSearchResults")}</p>
          </div>
        ) : (
          <div className="resume-grid">
            {docs.map((doc) => (
              <ResumeCard
                key={doc.id}
                doc={doc}
                lang={language}
                onEdit={() => navigate(`/edit/${doc.id}`)}
                onDuplicate={async () => { const d = await library.duplicateDoc(doc.id); if (d) navigate(`/edit/${d.id}`); }}
                onDelete={() => handleDelete(doc.id).then(() => library.load())}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
