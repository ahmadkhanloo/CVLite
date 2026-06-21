/**
 * Renders every résumé template with its Shahnameh character sample and saves a
 * thumbnail per template to assets/templates/<id>.png for the README gallery.
 *
 * Usage: node scripts/gallery.mjs
 * Requires: a static server on 4173 serving dist/ (e.g. `npm run serve`).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { sampleForTemplate } from "./sample-resume.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");
const OUT_DIR = path.join(ROOT, "assets", "templates");

const TEMPLATES = [
  "dark-sidebar", "classic-blue-lines", "purple-compact", "modern-minimal",
  "executive", "teal-pro", "warm-earth", "ats-clean",
  "gordafarid-defender", "rudabeh-heritage"
];

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

function buildHtml(template, templateId) {
  const payload = { ...sampleForTemplate(templateId), templateId };
  const safe = JSON.stringify(payload).replace(/<\/script>/gi, "<\\/script>");
  const inject = `<script>window.__CVLITE_PAYLOAD__ = ${safe}; window.__CVLITE_RENDER_TOKEN__ = "preview";</script>`;
  return template.replace("<!--CVLITE_PAYLOAD-->", inject);
}

function serveLocalAsset(urlPath, res) {
  if (!urlPath.startsWith("/assets/")) return false;
  const filePath = path.join(ROOT, urlPath.replace(/^\//, ""));
  if (!filePath.startsWith(path.join(ROOT, "assets"))) return false;
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return false;
  const ext = path.extname(filePath).toLowerCase();
  const type = ext === ".png" ? "image/png" : "application/octet-stream";
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
    await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 2 });
    for (const id of TEMPLATES) {
      currentHtml = buildHtml(template, id);
      await page.goto(`http://127.0.0.1:${port}/render/preview`, { waitUntil: "networkidle0", timeout: 20000 });
      await new Promise((r) => setTimeout(r, 1200)); // fonts settle
      const el = await page.$("#render-root .resume") || await page.$("#render-root");
      const out = path.join(OUT_DIR, `${id}.png`);
      await el.screenshot({ path: out });
      console.log(`  ${id} -> ${path.relative(ROOT, out)} (${Math.round(fs.statSync(out).size / 1024)}KB)`);
    }
  } finally {
    await pup.close();
    server.close();
  }
}

main().catch((err) => { console.error(err.message); process.exit(1); });
