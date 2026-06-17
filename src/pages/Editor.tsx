import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor } from "../store/resume";
import { useLibrary } from "../store/library";
import { useAuth } from "../store/auth";
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
import { exportJsonResume } from "../data/exporters/jsonresume";
import { downloadBlob, downloadText, readFile } from "../lib/files";
import { loadDoc as dbLoad } from "../db";
import { apiSyncResume, ResumeLimitError } from "../api/client";

type Tab = "edit" | "design" | "cover" | "ai";

const PENDING_ACTION_KEY = "cvlite.pendingAction";

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
  const auth = useAuth();
  const loadDoc = useEditor((s) => s.loadDoc);
  const resume = useEditor((s) => s.resume);
  const templateId = useEditor((s) => s.templateId);
  const design = useEditor((s) => s.design);
  const docName = useEditor((s) => s.docName);
  const setDocName = useEditor((s) => s.setDocName);
  const setResume = useEditor((s) => s.setResume);
  const toDoc = useEditor((s) => s.toDoc);
  const isDirty = useEditor((s) => s.isDirty);

  const language = useSettings((s) => s.language);
  const theme = useSettings((s) => s.theme);
  const setLanguage = useSettings((s) => s.setLanguage);
  const setTheme = useSettings((s) => s.setTheme);

  const [tab, setTab] = useState<Tab>("edit");
  const [status, setStatus] = useState({ text: t("saved"), danger: false });
  const [notFound, setNotFound] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [docLoaded, setDocLoaded] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  useAutoSave(id);

  // Load doc — waits for auth to resolve so we know which mode to use
  useEffect(() => {
    if (!auth.loaded) return;

    async function load() {
      if (auth.user) {
        // Cloud mode: try API first
        library.setMode("cloud");
        const cloudDoc = await library.getDoc(id);
        if (cloudDoc) { loadDoc(cloudDoc); setDocLoaded(true); return; }

        // Not in cloud yet — try local IndexedDB (new doc created before login)
        const localDoc = await dbLoad(id);
        if (localDoc) {
          try {
            setStatus({ text: t("syncingToCloud"), danger: false });
            await apiSyncResume(localDoc);
            setStatus({ text: t("syncDone"), danger: false });
          } catch (e) {
            if (e instanceof ResumeLimitError) setStatus({ text: t("resumeLimitReached"), danger: true });
          }
          loadDoc(localDoc);
          setDocLoaded(true);
          return;
        }

        setNotFound(true);
      } else {
        // Anonymous: local only
        library.setMode("local");
        const doc = await library.getDoc(id);
        if (!doc) { setNotFound(true); return; }
        loadDoc(doc);
        setDocLoaded(true);
      }
    }

    void load();
  }, [id, auth.loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Execute pending action once doc is loaded and user is confirmed
  useEffect(() => {
    if (!docLoaded || !auth.loaded || !auth.user || isDirty) return;
    const raw = localStorage.getItem(PENDING_ACTION_KEY);
    if (!raw) return;
    try {
      const { type, docId } = JSON.parse(raw) as { type: string; docId?: string };
      if (docId && docId !== id) return;
      localStorage.removeItem(PENDING_ACTION_KEY);
      setPendingAction(type);
    } catch { localStorage.removeItem(PENDING_ACTION_KEY); }
  }, [docLoaded, auth.loaded, auth.user, isDirty, id]);

  useEffect(() => {
    if (!pendingAction) return;
    const action = pendingAction;
    setPendingAction(null);
    setTimeout(() => {
      if (action === "pdf")    void downloadPdf();
      if (action === "print")  printPdf();
      if (action === "json")   handleExportJson();
      if (action === "md")     handleExportMd();
      if (action === "jr")     handleExportJr();
    }, 200);
  }, [pendingAction]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setStatus({ text: isDirty ? "..." : t("saved"), danger: false });
  }, [isDirty, t]);

  // ── Auth + sync gate ──────────────────────────────────────────────────────

  async function requireAuthAndSync(actionKey: string): Promise<boolean> {
    if (!auth.user) {
      const doc = toDoc();
      await library.saveDoc(doc).catch(() => {});
      localStorage.setItem(PENDING_ACTION_KEY, JSON.stringify({ type: actionKey, docId: id }));
      window.location.href = `/api/auth/google/start?returnTo=/edit/${encodeURIComponent(id)}`;
      return false;
    }
    // Ensure doc is synced to cloud
    if (library.mode !== "cloud") {
      try {
        setStatus({ text: t("syncingToCloud"), danger: false });
        await apiSyncResume(toDoc());
        library.setMode("cloud");
        setStatus({ text: t("syncDone"), danger: false });
      } catch (e) {
        if (e instanceof ResumeLimitError) {
          setStatus({ text: t("resumeLimitReached"), danger: true });
          return false;
        }
        throw e;
      }
    }
    return true;
  }

  // ── Export actions ────────────────────────────────────────────────────────

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
    if (!await requireAuthAndSync("pdf")) return;
    setStatus({ text: t("buildingPdf"), danger: false });
    const name = [resume.basics.firstName, resume.basics.lastName].filter(Boolean).join("-").toLowerCase() || "resume";
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ resume, templateId, pageSize: document.documentElement.dataset.pageSize || "A4", fileName: `${name}-${templateId}.pdf` })
      });
      if (!res.ok) throw new Error("no-pdf-server");
      if (!(res.headers.get("content-type") || "").includes("pdf")) throw new Error("no-pdf-server");
      downloadBlob(`${name}-${templateId}.pdf`, await res.blob());
      setStatus({ text: t("pdfReady"), danger: false });
    } catch {
      setStatus({ text: t("savingPdf"), danger: false });
      setTimeout(() => window.print(), 60);
    }
  }

  function printPdf() {
    window.print();
  }

  async function handleExportJson() {
    if (!await requireAuthAndSync("json")) return;
    downloadText("resume-cvlite.json", JSON.stringify(resume, null, 2), "application/json");
  }

  async function handleExportMd() {
    if (!await requireAuthAndSync("md")) return;
    downloadText("resume-cvlite.md", resumeToMarkdown(resume), "text/markdown");
  }

  async function handleExportJr() {
    if (!await requireAuthAndSync("jr")) return;
    downloadText("resume-jsonresume.json", exportJsonResume(resume), "application/json");
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
              <input type="file" accept=".json,.md,.markdown" onChange={handleImport} />
            </label>
            <button className="icon-button" type="button" title="Export CVLite JSON" onClick={handleExportJson}>JSON</button>
            <button className="icon-button" type="button" title="Export Markdown" onClick={handleExportMd}>MD</button>
            <button className="icon-button" type="button" title="Export JSON Resume" onClick={handleExportJr}>JR</button>
          </div>

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
