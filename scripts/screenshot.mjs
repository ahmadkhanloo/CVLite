/**
 * Screenshots the Teal Pro resume template for use in the README.
 * Uses puppeteer-core with system Edge/Chrome.
 *
 * Usage: node scripts/screenshot.mjs
 * Requires: npm start (server on 4173)
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { RESUME_PAYLOAD } from "./sample-resume.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");
const OUT_DIR = path.join(ROOT, "assets");
const OUT_FILE = path.join(OUT_DIR, "preview.png");

const BROWSERS = [
  process.env.CVLITE_BROWSER,
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].filter(Boolean);

function findBrowser() {
  return BROWSERS.find((b) => { try { fs.accessSync(b); return true; } catch { return false; } });
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

  // Build the render HTML with payload injected
  const template = fs.readFileSync(path.join(DIST_DIR, "render.html"), "utf8");
  const safePayload = JSON.stringify(RESUME_PAYLOAD).replace(/<\/script>/gi, "<\\/script>");
  const inject = `<script>window.__CVLITE_PAYLOAD__ = ${safePayload}; window.__CVLITE_RENDER_TOKEN__ = "preview";</script>`;
  const html = template.replace("<!--CVLITE_PAYLOAD-->", inject);

  // Serve it locally so relative asset paths work
  const server = http.createServer((req, res) => {
    const urlPath = (req.url || "/").split("?")[0];
    if (urlPath === "/" || urlPath.startsWith("/render/")) {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      return res.end(html);
    }
    if (serveLocalAsset(urlPath, res)) return;
    // Proxy to the running server at 4173 for assets/fonts
    const proxy = http.request(
      { hostname: "127.0.0.1", port: 4173, path: req.url, method: "GET" },
      (pr) => { res.writeHead(pr.statusCode, pr.headers); pr.pipe(res); }
    );
    proxy.on("error", () => { res.writeHead(404); res.end(); });
    proxy.end();
  });

  await new Promise(r => server.listen(0, "127.0.0.1", r));
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}/render/preview`;
  console.log("Serving resume at:", url);

  const pup = await puppeteer.launch({
    executablePath: browser,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
  });

  try {
    const page = await pup.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.goto(url, { waitUntil: "networkidle0", timeout: 20000 });
    await new Promise(r => setTimeout(r, 2000)); // wait for fonts

    // Get actual rendered height
    const bodyH = await page.evaluate(() => document.body.scrollHeight);
    await page.setViewport({ width: 794, height: Math.max(bodyH, 1123), deviceScaleFactor: 2 });
    await new Promise(r => setTimeout(r, 400));

    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
    await page.screenshot({ path: OUT_FILE, fullPage: true });
    const size = fs.statSync(OUT_FILE).size;
    console.log(`Screenshot saved: ${OUT_FILE} (${Math.round(size / 1024)}KB)`);
  } finally {
    await pup.close();
    server.close();
  }
}

main().catch(err => { console.error(err.message); process.exit(1); });
