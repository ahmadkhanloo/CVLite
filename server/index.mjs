import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");

const DEFAULT_PORT = Number(process.env.PORT || 4173);
const EXPLICIT_PORT = Boolean(process.env.PORT);
const payloads = new Map();
let activePort = DEFAULT_PORT;
let attemptedPort = DEFAULT_PORT;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf"
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function sendJson(res, status, data) {
  send(res, status, JSON.stringify(data), { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
}

function readBody(req, limit = 8 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("Request too large."));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function safeStaticPath(urlPath) {
  const rawPath = decodeURIComponent(urlPath === "/" ? "/index.html" : urlPath);
  const filePath = path.normalize(path.join(DIST_DIR, rawPath));
  if (!filePath.startsWith(DIST_DIR)) return null;
  return filePath;
}

function findBrowser() {
  const candidates = [
    process.env.CVLITE_BROWSER,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/microsoft-edge"
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

// Inject the render payload into the built render.html (replacing the placeholder).
function renderPage(token, payload) {
  const template = fs.readFileSync(path.join(DIST_DIR, "render.html"), "utf8");
  const safePayload = JSON.stringify(payload).replace(/</g, "\\u003c");
  const inject = `<script>window.__CVLITE_PAYLOAD__ = ${safePayload}; window.__CVLITE_RENDER_TOKEN__ = ${JSON.stringify(token)};</script>`;
  return template.includes("<!--CVLITE_PAYLOAD-->")
    ? template.replace("<!--CVLITE_PAYLOAD-->", inject)
    : template.replace("</head>", `${inject}</head>`);
}

async function exportPdf(req, res) {
  let body;
  try {
    body = JSON.parse(await readBody(req));
  } catch (error) {
    sendJson(res, 400, { error: error.message || "Invalid JSON." });
    return;
  }

  const browser = findBrowser();
  if (!browser) {
    sendJson(res, 500, { error: "Edge or Chrome was not found for PDF export. Set the browser path in CVLITE_BROWSER." });
    return;
  }

  const token = crypto.randomBytes(16).toString("hex");
  const payload = {
    resume: body.resume,
    templateId: body.templateId || "dark-sidebar",
    pageSize: body.pageSize || "A4"
  };
  payloads.set(token, payload);
  setTimeout(() => payloads.delete(token), 3 * 60 * 1000).unref();

  const outPath = path.join(os.tmpdir(), `cvlite-${token}.pdf`);
  const userDataDir = path.join(os.tmpdir(), `cvlite-browser-${token}`);
  const url = `http://127.0.0.1:${activePort}/render/${token}`;
  const args = [
    "--headless",
    "--no-sandbox",
    "--disable-gpu-sandbox",
    "--disable-gpu",
    "--disable-gpu-compositing",
    "--disable-accelerated-2d-canvas",
    "--disable-dev-shm-usage",
    "--use-angle=swiftshader",
    "--use-gl=swiftshader",
    "--disable-features=DawnGraphite,SkiaGraphite,Vulkan",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    `--user-data-dir=${userDataDir}`,
    `--print-to-pdf=${outPath}`,
    "--print-to-pdf-no-header",
    url
  ];

  try {
    await new Promise((resolve, reject) => {
      const child = spawn(browser, args, { windowsHide: true });
      let stderr = "";
      const timer = setTimeout(() => {
        child.kill("SIGKILL");
        reject(new Error("PDF generation timed out."));
      }, 45000);
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      child.on("error", reject);
      child.on("exit", (code) => {
        clearTimeout(timer);
        if (fs.existsSync(outPath) && fs.statSync(outPath).size > 0) resolve();
        else reject(new Error(stderr.trim() || `Browser exited with code ${code}.`));
      });
    });

    const pdf = fs.readFileSync(outPath);
    const fileName = String(body.fileName || "resume.pdf").replace(/[\\/:*?"<>|]+/g, "-");
    send(res, 200, pdf, {
      "content-type": "application/pdf",
      "content-length": pdf.length,
      "content-disposition": `attachment; filename="${fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`}"`,
      "cache-control": "no-store"
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "PDF export failed." });
  } finally {
    payloads.delete(token);
    fs.rm(outPath, { force: true }, () => {});
    fs.rm(userDataDir, { recursive: true, force: true }, () => {});
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "POST" && url.pathname === "/api/export-pdf") {
    await exportPdf(req, res);
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/render/")) {
    const token = url.pathname.split("/").pop();
    const payload = payloads.get(token);
    if (!payload) {
      send(res, 404, "Render token expired.", { "content-type": "text/plain; charset=utf-8" });
      return;
    }
    send(res, 200, renderPage(token, payload), { "content-type": MIME[".html"], "cache-control": "no-store" });
    return;
  }

  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const filePath = safeStaticPath(url.pathname);
  if (!filePath) {
    send(res, 403, "Forbidden", { "content-type": "text/plain; charset=utf-8" });
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      // SPA fallback — for client-side routes (e.g. /edit/:id) serve index.html
      const isAsset = /\.[a-z0-9]+$/i.test(url.pathname);
      if (!isAsset) {
        fs.readFile(path.join(DIST_DIR, "index.html"), (e2, html) => {
          if (e2) { send(res, 404, "Not found", { "content-type": "text/plain; charset=utf-8" }); return; }
          send(res, 200, html, { "content-type": MIME[".html"], "cache-control": "no-store" });
        });
      } else {
        send(res, 404, "Not found", { "content-type": "text/plain; charset=utf-8" });
      }
      return;
    }
    send(res, 200, data, { "content-type": MIME[path.extname(filePath)] || "application/octet-stream" });
  });
});

function listen(port) {
  attemptedPort = port;
  server.listen(port, "127.0.0.1");
}

server.on("listening", () => {
  activePort = attemptedPort;
  console.log(`CVLite is running at http://127.0.0.1:${activePort}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE" && !EXPLICIT_PORT && attemptedPort < DEFAULT_PORT + 20) {
    console.warn(`Port ${attemptedPort} is busy, trying ${attemptedPort + 1}...`);
    listen(attemptedPort + 1);
    return;
  }
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${attemptedPort} is already in use. Set PORT=4174 or close the existing CVLite server.`);
    process.exit(1);
  }
  throw error;
});

if (!fs.existsSync(DIST_DIR)) {
  console.error("dist/ not found. Run `npm run build` first (or use `npm start`).");
  process.exit(1);
}

listen(DEFAULT_PORT);
