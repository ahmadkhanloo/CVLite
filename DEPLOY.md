# Deploying CVLite (free, Iran-accessible)

CVLite is a **static SPA**. It runs entirely in the browser — IndexedDB for storage, in-browser
**Print → Save as PDF** for export — so it can be hosted on any static host with **no backend**.

> The Node PDF server (`server/index.mjs`) is optional. When it isn't present (static hosting),
> the **PDF** button automatically falls back to the browser's native print-to-PDF, which works
> offline on every platform.

## Recommended: Cloudflare Pages

Cloudflare does **not** sanction Iran and its dashboard + deployed sites are reachable from inside
Iran. It serves the app from a root domain (`https://<project>.pages.dev`) with a global CDN.

### Option A — Connect the Git repo (auto-deploy on every push)

1. Sign in at <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
2. Pick the `CVLite` repository.
3. Build settings:
   - **Framework preset:** `None`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** `20` (set env var `NODE_VERSION = 20` if needed)
4. **Save and Deploy**. Every `git push` to `main` now redeploys automatically.

### Option B — Deploy from your machine (Wrangler CLI)

```bash
npm run build
npx wrangler pages deploy dist --project-name cvlite
```

The included `static/_redirects` (`/* /index.html 200`) makes client-side routes like
`/edit/<id>` resolve correctly, and `static/_headers` adds long-term caching for assets/fonts.
Both are copied into `dist/` by the build.

## Other Iran-friendly options

- **Liara (Iranian PaaS, fully sanction-safe):** create a *Static* app and `liara deploy`, or a
  *Node.js* app to also run the real headless-Chrome PDF server. Requires a Liara account.
- **ArvanCloud / Iranian object storage + CDN:** upload the `dist/` folder as a static site.

## Custom domain

In Cloudflare Pages → your project → **Custom domains**, add your domain and follow the DNS steps.
