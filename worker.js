// Cloudflare Workers entry for the static/offline CVLite SPA.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // render.html is an internal PDF-server artifact; never serve it publicly.
    if (path === "/render.html") return new Response("Not found", { status: 404 });

    const asset = await env.ASSETS.fetch(request);
    if (asset.status === 404 && !/\.[a-z0-9]+$/i.test(path)) {
      return env.ASSETS.fetch(new Request(new URL("/index.html", url)));
    }
    return asset;
  },
};
