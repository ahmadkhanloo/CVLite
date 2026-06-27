import { createRoot } from "react-dom/client";
import { ResumeView } from "../templates";
import type { PageSize, Resume, ResumeLocale, TemplateId } from "../types/resume";
import "../styles/print.css";

interface RenderPayload {
  resume: Resume;
  templateId: TemplateId;
  pageSize: PageSize;
  locale?: ResumeLocale;
}

// The Node PDF server injects window.__CVLITE_PAYLOAD__ into render.html
// before this deferred module runs.
const payload = (window as unknown as { __CVLITE_PAYLOAD__?: RenderPayload }).__CVLITE_PAYLOAD__;
const root = document.getElementById("render-root");

if (payload && root) {
  const pageSize = payload.pageSize || "A4";
  const pageStyle = document.createElement("style");
  pageStyle.textContent = `@page { size: ${pageSize}; margin: 0; }`;
  document.head.appendChild(pageStyle);
  document.documentElement.dataset.pageSize = pageSize;
  document.documentElement.lang = payload.locale || "en";
  document.documentElement.dir = payload.locale === "fa" ? "rtl" : "ltr";
  createRoot(root).render(<ResumeView resume={payload.resume} templateId={payload.templateId} locale={payload.locale || "en"} />);
}

(window as unknown as { __CVLITE_READY__?: boolean }).__CVLITE_READY__ = true;
