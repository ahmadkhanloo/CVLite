import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor } from "../store/resume";
import { useLibrary } from "../store/library";
import { useSettings, type ThemeMode } from "../store/settings";
import { useT } from "../i18n/useT";
import type { Language } from "../i18n/dictionaries";
import { ResumeView } from "../templates";
import { BasicsEditor } from "../editor/BasicsEditor";
import { SectionsEditor } from "../editor/SectionsEditor";
import { DesignTab } from "../editor/DesignTab";
import { CoverLetterEditor } from "../features/cover-letter/CoverLetterEditor";
import { AIPanel } from "../features/ai/AIPanel";
import { normalizeRxResume } from "../data/importers/rxresume";
import { parseMarkdown } from "../data/importers/markdown";
import { importJsonResume } from "../data/importers/jsonresume";
import { resumeToMarkdown } from "../data/exporters/markdown";
import { exportJsonResume } from "../data/exporters/jsonresume";
import { downloadBlob, downloadText, readFile } from "../lib/files";

type Tab = "edit" | "design" | "cover" | "ai";

function useAutoSave(id: string) {
  const library = useLibrary();
  const toDoc = useEditor((s) => s.toDoc);
  const isDirty = useEditor((s) => s.isDirty);
  const markSaved = useEditor((s) => s.markSaved);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!isDirty) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const doc = toDoc();
      if (doc.id === id) {
        await library.saveDoc(doc);
        markSaved();
      }
    }, 800);
    return () => clearTimeout(timer.current);
  }, [isDirty, id, toDoc, library, markSaved]);
}

function useApplySettings() {
  const language = useSettings((s) => s.language);
  const theme = useSettings((s) => s.theme);
  const pageSize = useEditor((s) => s.pageSize);
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      root.lang = language;
      root.dir = language === "fa" ? "rtl" : "ltr";
      root.dataset.theme = theme === "system" ? (media.matches ? "dark" : "light") : theme;
      root.dataset.pageSize = pageSize;
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [language, theme, pageSize]);
}

export function EditorPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = useT();
  useApplySettings();

  const library = useLibrary();
  const loadDoc = useEditor((s) => s.loadDoc);
  const resume = useEditor((s) => s.resume);
  const templateId = useEditor((s) => s.templateId);
  const design = useEditor((s) => s.design);
  const docName = useEditor((s) => s.docName);
  const setDocName = useEditor((s) => s.setDocName);
  const setResume = useEditor((s) => s.setResume);
  const isDirty = useEditor((s) => s.isDirty);

  const language = useSettings((s) => s.language);
  const theme = useSettings((s) => s.theme);
  const setLanguage = useSettings((s) => s.setLanguage);
  const setTheme = useSettings((s) => s.setTheme);

  const [tab, setTab] = useState<Tab>("edit");
  const [status, setStatus] = useState({ text: t("saved"), danger: false });
  const [notFound, setNotFound] = useState(false);

  useAutoSave(id);

  useEffect(() => {
    library.getDoc(id).then((doc) => {
      if (!doc) { setNotFound(true); return; }
      loadDoc(doc);
    });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setStatus({ text: isDirty ? "..." : t("saved"), danger: false });
  }, [isDirty, t]);

  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await readFile(file);
      let next;
      if (file.name.endsWith(".json")) {
        const parsed = JSON.parse(text);
        next = parsed.$schema?.includes("jsonresume") ? importJsonResume(parsed) : normalizeRxResume(parsed);
      } else {
        next = parseMarkdown(text);
      }
      setResume(next);
      setStatus({ text: `${t("imported")}: ${file.name}`, danger: false });
    } catch (err) {
      setStatus({ text: (err as Error).message || t("importFailed"), danger: true });
    } finally {
      e.target.value = "";
    }
  }, [setResume, t]);

  async function downloadPdf() {
    setStatus({ text: t("buildingPdf"), danger: false });
    const name = [resume.basics.firstName, resume.basics.lastName].filter(Boolean).join("-").toLowerCase() || "resume";
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ resume, templateId, pageSize: document.documentElement.dataset.pageSize || "A4", fileName: `${name}-${templateId}.pdf` })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: t("pdfFailed") }));
        throw new Error((err as { error?: string }).error);
      }
      downloadBlob(`${name}-${templateId}.pdf`, await res.blob());
      setStatus({ text: t("pdfReady"), danger: false });
    } catch (err) {
      setStatus({ text: (err as Error).message, danger: true });
    }
  }

  function printPdf() {
    window.print();
  }

  if (notFound) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>Resume not found.</p>
        <button className="primary-button" onClick={() => navigate("/")}>Back to Library</button>
      </div>
    );
  }

  const previewTitle = [resume.basics.firstName, resume.basics.lastName].filter(Boolean).join(" ") || t("resume");

  return (
    <>
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="icon-button" type="button" onClick={() => navigate("/")} title={t("backToLibrary")}>
            ←
          </button>
          <div>
            <p className="eyebrow">CVLite</p>
            <input
              className="doc-name-input"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              aria-label={t("resumeName")}
            />
          </div>
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
            <input type="file" accept=".json,.md,.markdown" onChange={handleImport} />
          </label>
          <button className="icon-button" type="button" onClick={() => downloadText("resume-cvlite.json", JSON.stringify(resume, null, 2), "application/json")}>JSON</button>
          <button className="icon-button" type="button" onClick={() => downloadText("resume-cvlite.md", resumeToMarkdown(resume), "text/markdown")}>MD</button>
          <button className="icon-button" type="button" onClick={() => downloadText("resume-jsonresume.json", exportJsonResume(resume), "application/json")}>JR</button>
          <button className="icon-button" type="button" onClick={printPdf}>{t("printPdf")}</button>
          <button className="primary-button" type="button" onClick={downloadPdf}>{t("downloadPdf")}</button>
        </div>
      </header>

      <main className="app-shell">
        <aside className="control-panel">
          <div className="editor-tabs">
            {(["edit", "design", "cover", "ai"] as Tab[]).map((tabId) => (
              <button
                key={tabId}
                type="button"
                className={`tab-btn${tab === tabId ? " active" : ""}`}
                onClick={() => setTab(tabId)}
              >
                {tabId === "edit" ? t("editTab") : tabId === "design" ? t("designTab") : tabId === "cover" ? t("coverLetterTab") : t("aiTab")}
              </button>
            ))}
          </div>

          {tab === "edit" && (
            <>
              <section className="panel-section">
                <h2>{t("basicsSection")}</h2>
                <BasicsEditor />
              </section>
              <section className="panel-section">
                <h2>{t("sectionsSection")}</h2>
                <SectionsEditor />
              </section>
            </>
          )}
          {tab === "design" && <DesignTab />}
          {tab === "cover" && <CoverLetterEditor />}
          {tab === "ai" && <AIPanel />}
        </aside>

        <section className="preview-panel">
          <div className="preview-toolbar">
            <div>
              <p className="eyebrow">{t("preview")}</p>
              <h2 id="preview-title">{previewTitle}</h2>
            </div>
            <div className={`status${status.danger ? " danger" : ""}`}>{status.text}</div>
          </div>
          <div id="preview" className="preview-frame" dir="ltr">
            <ResumeView resume={resume} templateId={templateId} design={design} />
          </div>
        </section>
      </main>
    </>
  );
}
