const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { spawn } = require("child_process");

const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const payloads = new Map();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".pdf": "application/pdf"
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function sendJson(res, status, data) {
  send(res, status, JSON.stringify(data), {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
}

function readBody(req, limit = 8 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("درخواست خیلی بزرگ است."));
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
  const filePath = path.normalize(path.join(PUBLIC_DIR, rawPath));
  if (!filePath.startsWith(PUBLIC_DIR)) return null;
  return filePath;
}

function findBrowser() {
  const candidates = [
    process.env.CVLITE_BROWSER,
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
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

function renderPage(token, payload) {
  const safePayload = JSON.stringify(payload).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CVLite Render</title>
  <link rel="stylesheet" href="/app.css">
  <link rel="stylesheet" href="/print.css">
</head>
<body class="render-body">
  <main id="render-root"></main>
  <script>window.__CVLITE_PAYLOAD__ = ${safePayload}; window.__CVLITE_RENDER_TOKEN__ = ${JSON.stringify(token)};</script>
  <script src="/resume-core.js"></script>
  <script>
    const payload = window.__CVLITE_PAYLOAD__;
    document.documentElement.dataset.pageSize = payload.pageSize || "A4";
    document.getElementById("render-root").innerHTML = CVLite.renderResume(payload.resume, payload.templateId, { mode: "print" });
    window.__CVLITE_READY__ = true;
  </script>
</body>
</html>`;
}

async function exportPdf(req, res) {
  let body;
  try {
    body = JSON.parse(await readBody(req));
  } catch (error) {
    sendJson(res, 400, { error: error.message || "JSON معتبر نیست." });
    return;
  }

  const browser = findBrowser();
  if (!browser) {
    sendJson(res, 500, {
      error: "Edge یا Chrome برای ساخت PDF پیدا نشد. مسیر مرورگر را در CVLITE_BROWSER تنظیم کنید."
    });
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
  const url = `http://127.0.0.1:${PORT}/render/${token}`;
  const args = [
    "--headless=new",
    "--disable-gpu",
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
        reject(new Error("ساخت PDF بیش از حد طول کشید."));
      }, 45000);

      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      child.on("error", reject);
      child.on("exit", (code) => {
        clearTimeout(timer);
        if (code === 0 && fs.existsSync(outPath)) resolve();
        else reject(new Error(stderr.trim() || `مرورگر با کد ${code} بسته شد.`));
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
    sendJson(res, 500, { error: error.message || "ساخت PDF ناموفق بود." });
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
      send(res, 404, "Not found", { "content-type": "text/plain; charset=utf-8" });
      return;
    }
    send(res, 200, data, { "content-type": MIME[path.extname(filePath)] || "application/octet-stream" });
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`CVLite is running at http://127.0.0.1:${PORT}`);
});
