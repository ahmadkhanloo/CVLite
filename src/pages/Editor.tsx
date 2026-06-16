import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor } from "../store/resume";
import { useLibrary } from "../store/library";
import { useSettings } from "../store/settings";
import { useT } from "../i18n/useT";
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
  const [zoom, setZoom] = useState(1);

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
      // On static hosting the SPA fallback can answer /api with HTML — make sure
      // we actually got a PDF before downloading, otherwise fall back to print.
      if (!(res.headers.get("content-type") || "").includes("pdf")) throw new Error("no-pdf-server");
      downloadBlob(`${name}-${templateId}.pdf`, await res.blob());
      setStatus({ text: t("pdfReady"), danger: false });
    } catch {
      // No PDF server (e.g. static hosting like Cloudflare Pages) — fall back to
      // the browser's native print-to-PDF, which works everywhere offline.
      setStatus({ text: t("savingPdf"), danger: false });
      setTimeout(() => window.print(), 60);
    }
  }

  function printPdf() {
    window.print();
  }

  if (notFound) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>Resume not found.</p>
        <button className="primary-button" onClick={() => navigate("/library")}>Back to Library</button>
      </div>
    );
  }

  const previewTitle = [resume.basics.firstName, resume.basics.lastName].filter(Boolean).join(" ") || t("resume");

  const themeIcon = theme === "dark" ? "☀︎" : theme === "light" ? "☽" : "◐";

  return (
    <>
      <header className="topbar">
        <div className="topbar-brand">
          <button className="tb-icon-btn" type="button" onClick={() => navigate("/library")} title={t("backToLibrary")} style={{ fontSize: 18 }}>
            ←
          </button>
          <div className="brand-mark">CV</div>
          <input
            className="doc-name-input"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            aria-label={t("resumeName")}
          />
        </div>

        <div className="topbar-actions">
          {/* Language + Theme */}
          <div className="tb-group" style={{ paddingInlineStart: 0, borderInlineStart: "none" }}>
            <button
              className="tb-badge"
              type="button"
              onClick={() => setLanguage(language === "fa" ? "en" : "fa")}
              title={t("language")}
            >
              {language === "fa" ? "FA" : "EN"}
            </button>
            <button
              className="tb-icon-btn"
              type="button"
              title={t("theme")}
              onClick={() => setTheme(theme === "system" ? "light" : theme === "light" ? "dark" : "system")}
            >
              {themeIcon}
            </button>
          </div>

          {/* Import / Export */}
          <div className="tb-group">
            <label className="icon-button" title={t("importTitle")} style={{ cursor: "pointer" }}>
              ↑ {t("import")}
              <input type="file" accept=".json,.md,.markdown" onChange={handleImport} />
            </label>
            <button className="icon-button" type="button" title="Export CVLite JSON" onClick={() => downloadText("resume-cvlite.json", JSON.stringify(resume, null, 2), "application/json")}>JSON</button>
            <button className="icon-button" type="button" title="Export Markdown" onClick={() => downloadText("resume-cvlite.md", resumeToMarkdown(resume), "text/markdown")}>MD</button>
          </div>

          {/* Print / PDF */}
          <div className="tb-group">
            <button className="icon-button" type="button" onClick={printPdf} title={t("printPdf")}>⎙ {t("printPdf")}</button>
            <button className="primary-button" type="button" onClick={downloadPdf}>↓ PDF</button>
          </div>
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
            <div className="preview-toolbar-right">
              <div className="zoom-control" role="group" aria-label="Zoom">
                <button className="tb-icon-btn" type="button" title={t("zoomOut")} onClick={() => setZoom((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10))}>−</button>
                <button className="zoom-value" type="button" title={t("fitToWidth")} onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
                <button className="tb-icon-btn" type="button" title={t("zoomIn")} onClick={() => setZoom((z) => Math.min(1.5, Math.round((z + 0.1) * 10) / 10))}>+</button>
              </div>
              <div className={`status${status.danger ? " danger" : ""}`}>{status.text}</div>
            </div>
          </div>
          <div id="preview" className="preview-frame" dir="ltr">
            <div className="zoom-wrap" style={{ transform: `scale(${zoom})` }}>
              <ResumeView resume={resume} templateId={templateId} design={design} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
