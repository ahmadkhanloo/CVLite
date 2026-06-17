export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // render.html is a server-side PDF artifact; never expose it publicly
    if (url.pathname === "/render.html") {
      return new Response("Not found", { status: 404 });
    }

    const response = await env.ASSETS.fetch(request);

    // SPA fallback: serve index.html for client-side routes (paths with no
    // file extension that weren't matched as static assets)
    if (response.status === 404 && !/\.[a-z0-9]+$/i.test(url.pathname)) {
      return env.ASSETS.fetch(new Request(new URL("/index.html", url)));
    }

    return response;
  },
};
