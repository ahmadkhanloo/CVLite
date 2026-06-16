import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../store/library";
import { useSettings, type ThemeMode } from "../store/settings";
import { useT } from "../i18n/useT";
import type { Language } from "../i18n/dictionaries";
import type { ResumeDoc } from "../types/library";
import { exportBackup, importBackup } from "../lib/backup";
import { downloadText } from "../lib/files";
import { importJsonResume } from "../data/importers/jsonresume";
import { normalizeRxResume } from "../data/importers/rxresume";
import { parseMarkdown } from "../data/importers/markdown";
import { uid } from "../data/defaults";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function ResumeCard({ doc, onEdit, onDuplicate, onDelete }: { doc: ResumeDoc; onEdit: () => void; onDuplicate: () => void; onDelete: () => void }) {
  const t = useT();
  return (
    <div className="resume-card">
      <div className="card-body" onClick={onEdit} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onEdit()}>
        <p className="card-name">{doc.name}</p>
        {doc.targetJob && <p className="card-job">{doc.targetJob}</p>}
        <p className="card-date">{t("lastEdited")}: {formatDate(doc.updatedAt)}</p>
        <p className="card-template">{doc.templateId}</p>
      </div>
      <div className="card-actions">
        <button className="mini-button" type="button" onClick={onEdit}>{t("editResume")}</button>
        <button className="mini-button" type="button" onClick={onDuplicate}>{t("duplicateResume")}</button>
        <button className="mini-button danger-text" type="button" onClick={onDelete}>{t("deleteResume")}</button>
      </div>
    </div>
  );
}

export function Library() {
  const t = useT();
  const navigate = useNavigate();
  const library = useLibrary();
  const language = useSettings((s) => s.language);
  const theme = useSettings((s) => s.theme);
  const setLanguage = useSettings((s) => s.setLanguage);
  const setTheme = useSettings((s) => s.setTheme);

  const importRef = useRef<HTMLInputElement>(null);
  const backupRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    library.load().then(async () => {
      // On first run, migrate legacy single-resume draft from old app
      if (library.docs.length === 0) {
        const legacy = localStorage.getItem("cvlite.resumeDraft.v1");
        if (legacy) {
          try {
            const { normalizeResume } = await import("../data/defaults");
            const resume = normalizeResume(JSON.parse(legacy));
            const now = Date.now();
            await library.saveDoc({
              id: uid(),
              name: "My Resume (migrated)",
              createdAt: now,
              updatedAt: now,
              resume,
              templateId: "dark-sidebar",
              pageSize: "A4"
            });
            await library.load();
          } catch { /* ignore migration errors */ }
        }
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  async function handleCreate() {
    const doc = await library.createDoc(t("myResumes"));
    navigate(`/edit/${doc.id}`);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
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
      const doc: ResumeDoc = {
        id: uid(),
        name: file.name.replace(/\.(json|md|markdown)$/i, ""),
        createdAt: now,
        updatedAt: now,
        resume,
        templateId: "dark-sidebar",
        pageSize: "A4"
      };
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

  async function handleDelete(id: string) {
    if (!window.confirm(t("confirmDelete"))) return;
    await library.removeDoc(id);
  }

  return (
    <div className="library-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">CVLite</p>
          <h1>{t("myResumes")}</h1>
        </div>
        <div className="topbar-actions">
          <label className="field inline-select">
            <span>{t("language")}</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
              <option value="fa">فارسی</option>
              <option value="en">English</option>
            </select>
          </label>
          <label className="field inline-select">
            <span>{t("theme")}</span>
            <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeMode)}>
              <option value="system">{t("themeSystem")}</option>
              <option value="light">{t("themeLight")}</option>
              <option value="dark">{t("themeDark")}</option>
            </select>
          </label>
          <label className="icon-button" title={t("importTitle")}>
            <span>{t("import")}</span>
            <input ref={importRef} type="file" accept=".json,.md,.markdown" onChange={handleImport} />
          </label>
          <button className="icon-button" type="button" onClick={() => exportBackup().then(() => setStatus(t("backupReady")))}>
            {t("exportBackup")}
          </button>
          <label className="icon-button">
            <span>{t("importBackup")}</span>
            <input ref={backupRef} type="file" accept=".json" onChange={handleBackupImport} />
          </label>
          <button className="primary-button" type="button" onClick={handleCreate}>
            + {t("newResume")}
          </button>
        </div>
      </header>

      <main className="library-main">
        {status && <p className="library-status">{status}</p>}
        {library.loading ? (
          <p className="empty-note" style={{ padding: "40px 0", textAlign: "center" }}>Loading...</p>
        ) : library.docs.length === 0 ? (
          <div className="library-empty">
            <p>{t("noResumes")}</p>
            <button className="primary-button" type="button" onClick={handleCreate}>
              + {t("newResume")}
            </button>
          </div>
        ) : (
          <div className="resume-grid">
            {library.docs.map((doc) => (
              <ResumeCard
                key={doc.id}
                doc={doc}
                onEdit={() => navigate(`/edit/${doc.id}`)}
                onDuplicate={async () => { const d = await library.duplicateDoc(doc.id); if (d) navigate(`/edit/${d.id}`); }}
                onDelete={() => handleDelete(doc.id).then(() => library.load())}
              />
            ))}
          </div>
        )}
      </main>

      {/* Hidden export-all-as-json for backup */}
      <div style={{ display: "none" }}>
        <button onClick={() => downloadText("backup.json", JSON.stringify(library.docs), "application/json")} />
      </div>
    </div>
  );
}
