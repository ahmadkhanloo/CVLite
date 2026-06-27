/**
 * Renders every resume template with localized sample data.
 *
 * Outputs:
 * - assets/templates/<id>.en.png
 * - assets/templates/<id>.fa.png
 *
 * Usage: node scripts/gallery.mjs
 * Requires: a built dist/ directory and a static server on 4173 for assets.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { sampleForTemplate, TEMPLATE_IDS } from "./sample-resume.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");
const OUT_DIR = path.join(ROOT, "assets", "templates");
const LOCALES = ["en", "fa"];

const BROWSERS = [
  process.env.CVLITE_BROWSER,
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
].filter(Boolean);

function findBrowser() {
  return BROWSERS.find((b) => { try { fs.accessSync(b); return true; } catch { return false; } });
}

function buildHtml(template, templateId, locale) {
  const payload = sampleForTemplate(templateId, locale);
  const safe = JSON.stringify(payload).replace(/<\/script>/gi, "<\\/script>");
  const inject = `<script>window.__CVLITE_PAYLOAD__ = ${safe}; window.__CVLITE_RENDER_TOKEN__ = "preview";</script>`;
  return template.replace("<!--CVLITE_PAYLOAD-->", inject);
}

async function writeFileWithRetry(filePath, data, attempts = 6) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      fs.writeFileSync(filePath, data);
      return;
    } catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, 250 + i * 250));
    }
  }
}

function serveLocalAsset(urlPath, res) {
  if (!urlPath.startsWith("/assets/") && !urlPath.startsWith("/fonts/")) return false;
  const relPath = urlPath.replace(/^\//, "");
  const distPath = path.join(DIST_DIR, relPath);
  const sourcePath = path.join(ROOT, urlPath.startsWith("/fonts/") ? "static" : "", relPath);
  const filePath = fs.existsSync(distPath) ? distPath : sourcePath;
  const distAssets = path.join(DIST_DIR, "assets");
  const distFonts = path.join(DIST_DIR, "fonts");
  const sourceAssets = path.join(ROOT, "assets");
  const sourceFonts = path.join(ROOT, "static", "fonts");
  if (!filePath.startsWith(distAssets) && !filePath.startsWith(distFonts) && !filePath.startsWith(sourceAssets) && !filePath.startsWith(sourceFonts)) return false;
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return false;
  const ext = path.extname(filePath).toLowerCase();
  const type =
    ext === ".png" ? "image/png" :
    ext === ".css" ? "text/css; charset=utf-8" :
    ext === ".js" ? "text/javascript; charset=utf-8" :
    ext === ".woff2" ? "font/woff2" :
    "application/octet-stream";
  res.writeHead(200, { "content-type": type });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

async function main() {
  const browser = findBrowser();
  if (!browser) throw new Error("No Chrome/Edge found. Set CVLITE_BROWSER env var.");
  console.log("Browser:", browser);

  const template = fs.readFileSync(path.join(DIST_DIR, "render.html"), "utf8");
  let currentHtml = "";

  const server = http.createServer((req, res) => {
    const urlPath = (req.url || "/").split("?")[0];
    if (urlPath === "/" || urlPath.startsWith("/render/")) {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      return res.end(currentHtml);
    }
    if (serveLocalAsset(urlPath, res)) return;
    const proxy = http.request(
      { hostname: "127.0.0.1", port: 4173, path: req.url, method: "GET" },
      (pr) => { res.writeHead(pr.statusCode, pr.headers); pr.pipe(res); }
    );
    proxy.on("error", () => { res.writeHead(404); res.end(); });
    proxy.end();
  });

  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const { port } = server.address();

  const pup = await puppeteer.launch({
    executablePath: browser,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
  });

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  try {
    const page = await pup.newPage();
    page.on("pageerror", (err) => console.error("Page error:", err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") console.error("Browser console:", msg.text());
    });
    await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 2 });
    for (const id of TEMPLATE_IDS) {
      for (const locale of LOCALES) {
        currentHtml = buildHtml(template, id, locale);
        await page.goto(`http://127.0.0.1:${port}/render/preview`, { waitUntil: "networkidle0", timeout: 20000 });
        await page.waitForFunction(() => window.__CVLITE_READY__ === true, { timeout: 20000 });
        const el = await page.$("#render-root .resume") || await page.$("#render-root");
        const out = path.join(OUT_DIR, `${id}.${locale}.png`);
        const png = await el.screenshot({ type: "png" });
        await writeFileWithRetry(out, png);
        console.log(`  ${id}.${locale} -> ${path.relative(ROOT, out)} (${Math.round(fs.statSync(out).size / 1024)}KB)`);
      }
    }
  } finally {
    await pup.close();
    server.close();
  }
}

main().catch((err) => { console.error(err.message); process.exit(1); });
