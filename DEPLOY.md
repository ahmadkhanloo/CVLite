# Deploying CVLite (free, Iran-accessible)

CVLite is a **static SPA**. It runs entirely in the browser with IndexedDB for storage, so it can
be hosted on any static host with **no backend**.

> Real PDF export is provided by the Node server (`server/index.mjs`) using headless Chrome/Edge.
> Static deployments do not include real PDF export; run `npm start` or `npm run serve` when PDF
> generation is required.

## Recommended: Cloudflare Workers

Cloudflare does **not** sanction Iran and its dashboard + deployed sites are reachable from inside
Iran. The current repository is configured for Cloudflare Workers static assets with a small
Worker fallback in `worker.js`.

### Option A — Connect the Git repo (auto-deploy on every push)

1. Sign in at <https://dash.cloudflare.com> → **Workers & Pages** → **Create**.
2. Pick the `CVLite` repository.
3. Build settings:
   - **Framework preset:** `None`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** `20` (set env var `NODE_VERSION = 20` if needed)
4. Deploy command:
   - Leave it empty for a Pages-style static deployment, or
   - Use `npx wrangler deploy` to deploy the included static Worker.
5. **Save and Deploy**. Every `git push` to `main` now redeploys automatically.

### Option B — Deploy from your machine (Wrangler CLI)

```bash
npm run build
npx wrangler deploy
```

SPA fallback is handled by `worker.js`. Do **not** add a catch-all `_redirects` rule such as
`/* /index.html 200`; Cloudflare Workers static assets can reject that rule as an infinite loop
when clean-URL rewriting is enabled.

The included `static/_headers` adds long-term caching for assets/fonts and is copied into `dist/`
by the build.

## Other Iran-friendly options

- **Liara (Iranian PaaS, fully sanction-safe):** create a *Static* app and `liara deploy`, or a
  *Node.js* app to run the real headless-Chrome PDF server. Requires a Liara account.
- **ArvanCloud / Iranian object storage + CDN:** upload the `dist/` folder as a static site.

## Custom domain

In Cloudflare Pages → your project → **Custom domains**, add your domain and follow the DNS steps.
