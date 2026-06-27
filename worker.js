// Cloudflare Workers entry for the static/offline CVLite SPA.
// Optional: if a Browser Rendering binding is configured, /api/export-pdf
// generates real PDF files using headless Chrome at the edge.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // render.html is an internal PDF-server artifact; never serve it publicly.
    if (path === "/render.html") return new Response("Not found", { status: 404 });

    // PDF export via Cloudflare Browser Rendering (if binding exists).
    if (request.method === "POST" && path === "/api/export-pdf") {
      if (!env.BROWSER) {
        return Response.json({ error: "PDF export is not configured on this deployment." }, { status: 501 });
      }
      try {
        return await handlePdfExport(request, env, url);
      } catch (err) {
        return Response.json({ error: err.message || "PDF export failed." }, { status: 500 });
      }
    }

    const asset = await env.ASSETS.fetch(request);
    if (asset.status === 404 && !/\.[a-z0-9]+$/i.test(path)) {
      return env.ASSETS.fetch(new Request(new URL("/index.html", url)));
    }
    return asset;
  },
};

async function handlePdfExport(request, env, url) {
  const body = await request.json();
  const payload = {
    resume: body.resume,
    templateId: body.templateId || "dark-sidebar",
    pageSize: body.pageSize || "A4",
    locale: body.locale === "fa" ? "fa" : "en",
  };
  const fileName = String(body.fileName || "resume.pdf").replace(/[\\/:*?"<>|]+/g, "-");

  // Puppeteer via Cloudflare Browser Rendering binding.
  const puppeteer = await import("@cloudflare/puppeteer");
  const browser = await puppeteer.default.launch(env.BROWSER);
  const page = await browser.newPage();

  // Build the render page HTML inline (no need for a separate server route).
  const renderHtml = await env.ASSETS.fetch(new Request(new URL("/render.html", url)));
  let html = await renderHtml.text();
  const safePayload = JSON.stringify(payload).replace(/</g, "\\u003c");
  const inject = `<script>window.__CVLITE_PAYLOAD__ = ${safePayload};</script>`;
  html = html.includes("<!--CVLITE_PAYLOAD-->")
    ? html.replace("<!--CVLITE_PAYLOAD-->", inject)
    : html.replace("</head>", `${inject}</head>`);

  // Set page content and wait for the app to render.
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.waitForFunction(() => window.__CVLITE_READY__ === true, { timeout: 15000 });

  const isLetter = payload.pageSize === "Letter";
  const pdf = await page.pdf({
    format: isLetter ? "Letter" : "A4",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();

  return new Response(pdf, {
    headers: {
      "content-type": "application/pdf",
      "content-length": pdf.byteLength.toString(),
      "content-disposition": `attachment; filename="${fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`}"`,
      "cache-control": "no-store",
    },
  });
}
