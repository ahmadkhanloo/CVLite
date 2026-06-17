// Cloudflare Workers entry — Google OAuth + D1-backed resume API + SPA asset serving.
// Plain JS (no build step); wrangler bundles it via esbuild before deployment.

const COOKIE_SESSION = "cvlite_session";
const COOKIE_OAUTH_STATE = "cvlite_oauth_state";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const RESUME_LIMIT = 2;

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

// ── Utilities ─────────────────────────────────────────────────────────────────

async function sha256hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function uid() {
  return crypto.randomUUID().replace(/-/g, "");
}

function jsonRes(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extra },
  });
}

function apiErr(message, status = 400, code) {
  return jsonRes({ error: message, ...(code ? { code } : {}) }, status);
}

function parseCookies(request) {
  const result = {};
  for (const part of (request.headers.get("cookie") || "").split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    result[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return result;
}

function makeCookie(name, value, opts = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (opts.maxAge !== undefined) parts.push(`Max-Age=${opts.maxAge}`);
  parts.push("Path=/", "HttpOnly", "SameSite=Lax");
  if (opts.secure !== false) parts.push("Secure");
  return parts.join("; ");
}

// ── Session ───────────────────────────────────────────────────────────────────

async function getSession(request, env) {
  const token = parseCookies(request)[COOKIE_SESSION];
  if (!token) return null;
  const hash = await sha256hex(token);
  const row = await env.DB.prepare(
    `SELECT u.id, u.email, u.name, u.picture
     FROM sessions s JOIN users u ON s.user_id = u.id
     WHERE s.token_hash = ? AND s.expires_at > ?`
  )
    .bind(hash, Date.now())
    .first();
  return row || null;
}

async function requireAuth(request, env) {
  const user = await getSession(request, env);
  if (!user) throw { status: 401, code: "unauthorized" };
  return user;
}

async function requireAdmin(request, env) {
  const user = await requireAuth(request, env);
  const admins = (env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (!admins.includes(user.email)) throw { status: 403, code: "forbidden" };
  return user;
}

// ── Auth handlers ─────────────────────────────────────────────────────────────

async function handleAuthStart(request, env) {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo") || "/";
  const state = uid();
  const statePayload = btoa(JSON.stringify({ state, returnTo }));
  const secure = (env.APP_ORIGIN || "").startsWith("https://");

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: `${env.APP_ORIGIN}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });

  const headers = new Headers({ location: `${GOOGLE_AUTH_URL}?${params}` });
  headers.append("set-cookie", makeCookie(COOKIE_OAUTH_STATE, statePayload, { maxAge: 600, secure }));
  return new Response(null, { status: 302, headers });
}

async function handleAuthCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");
  const rawState = parseCookies(request)[COOKIE_OAUTH_STATE];
  const secure = (env.APP_ORIGIN || "").startsWith("https://");

  if (!code) return apiErr("Missing authorization code", 400);
  if (!rawState) return apiErr("OAuth state cookie missing — try again", 400);

  let payload;
  try { payload = JSON.parse(atob(rawState)); } catch { return apiErr("Invalid state cookie", 400); }
  if (payload.state !== stateParam) return apiErr("State mismatch (CSRF check failed)", 400);

  // Exchange code → access token
  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${env.APP_ORIGIN}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return apiErr("Token exchange failed", 502);
  const { access_token } = await tokenRes.json();

  // Fetch Google user info
  const userRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { authorization: `Bearer ${access_token}` },
  });
  if (!userRes.ok) return apiErr("Failed to fetch user info from Google", 502);
  const g = await userRes.json();

  const now = Date.now();

  // Upsert user
  await env.DB.prepare(
    `INSERT INTO users (id, email, name, picture, provider, provider_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'google', ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       name = excluded.name, picture = excluded.picture,
       provider_id = excluded.provider_id, updated_at = excluded.updated_at`
  )
    .bind(uid(), g.email, g.name ?? "", g.picture ?? "", g.sub, now, now)
    .run();

  const dbUser = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(g.email)
    .first();
  if (!dbUser) return apiErr("Failed to create user record", 500);

  // Create session
  const token = uid() + uid(); // 64 random hex chars
  const tokenHash = await sha256hex(token);
  await env.DB.prepare(
    `INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?)`
  )
    .bind(uid(), dbUser.id, tokenHash, now + SESSION_TTL_MS, now)
    .run();

  const headers = new Headers({ location: payload.returnTo || "/" });
  headers.append("set-cookie", makeCookie(COOKIE_SESSION, token, { maxAge: SESSION_TTL_MS / 1000, secure }));
  headers.append("set-cookie", makeCookie(COOKIE_OAUTH_STATE, "", { maxAge: 0, secure }));
  return new Response(null, { status: 302, headers });
}

async function handleLogout(request, env) {
  const token = parseCookies(request)[COOKIE_SESSION];
  const secure = (env.APP_ORIGIN || "").startsWith("https://");
  if (token) {
    const hash = await sha256hex(token);
    await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(hash).run();
  }
  const headers = new Headers({ location: "/" });
  headers.set("set-cookie", makeCookie(COOKIE_SESSION, "", { maxAge: 0, secure }));
  return new Response(null, { status: 302, headers });
}

async function handleMe(request, env) {
  const user = await getSession(request, env);
  if (!user) return jsonRes({ user: null });
  const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM resumes WHERE user_id = ?")
    .bind(user.id)
    .first();
  return jsonRes({ user: { ...user, resumeCount: Number(row?.n ?? 0) } });
}

// ── Resume serialization ──────────────────────────────────────────────────────

function rowToMeta(row) {
  return {
    id: row.id,
    name: row.name,
    ...(row.target_job ? { targetJob: row.target_job } : {}),
    templateId: row.template_id,
    pageSize: row.page_size,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...(row.design_json ? { design: JSON.parse(row.design_json) } : {}),
    ...(row.cover_letter ? { coverLetter: row.cover_letter } : {}),
  };
}

function rowToFull(row) {
  return { ...rowToMeta(row), resume: JSON.parse(row.resume_json) };
}

// ── Resume CRUD ───────────────────────────────────────────────────────────────

async function handleListResumes(request, env) {
  const user = await requireAuth(request, env);
  const rows = await env.DB.prepare(
    `SELECT id, name, target_job, template_id, page_size, design_json, cover_letter, created_at, updated_at
     FROM resumes WHERE user_id = ? ORDER BY updated_at DESC`
  )
    .bind(user.id)
    .all();
  return jsonRes({ resumes: rows.results.map(rowToMeta) });
}

async function handleCreateResume(request, env) {
  const user = await requireAuth(request, env);
  let body;
  try { body = await request.json(); } catch { return apiErr("Invalid JSON", 400); }

  const countRow = await env.DB.prepare("SELECT COUNT(*) AS n FROM resumes WHERE user_id = ?")
    .bind(user.id)
    .first();
  if (Number(countRow?.n ?? 0) >= RESUME_LIMIT) {
    return apiErr("Resume limit reached", 409, "resume_limit_reached");
  }

  const id = String(body.id || uid());
  const now = Date.now();

  // Sync case: same ID already belongs to this user
  const existing = await env.DB.prepare("SELECT id FROM resumes WHERE id = ? AND user_id = ?")
    .bind(id, user.id)
    .first();

  if (existing) {
    await env.DB.prepare(
      `UPDATE resumes SET name=?,resume_json=?,template_id=?,page_size=?,design_json=?,
       cover_letter=?,target_job=?,updated_at=? WHERE id=? AND user_id=?`
    )
      .bind(
        body.name ?? "My Resume",
        JSON.stringify(body.resume ?? {}),
        body.templateId ?? "dark-sidebar",
        body.pageSize ?? "A4",
        body.design ? JSON.stringify(body.design) : null,
        body.coverLetter ?? null,
        body.targetJob ?? null,
        now, id, user.id
      )
      .run();
    return jsonRes({ id, synced: true });
  }

  await env.DB.prepare(
    `INSERT INTO resumes (id,user_id,name,resume_json,template_id,page_size,design_json,cover_letter,target_job,created_at,updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`
  )
    .bind(
      id, user.id,
      body.name ?? "My Resume",
      JSON.stringify(body.resume ?? {}),
      body.templateId ?? "dark-sidebar",
      body.pageSize ?? "A4",
      body.design ? JSON.stringify(body.design) : null,
      body.coverLetter ?? null,
      body.targetJob ?? null,
      body.createdAt ?? now, now
    )
    .run();

  return jsonRes({ id }, 201);
}

async function handleGetResume(request, env, id) {
  const user = await requireAuth(request, env);
  const row = await env.DB.prepare("SELECT * FROM resumes WHERE id=? AND user_id=?")
    .bind(id, user.id)
    .first();
  if (!row) return apiErr("Not found", 404);
  return jsonRes(rowToFull(row));
}

async function handlePatchResume(request, env, id) {
  const user = await requireAuth(request, env);
  let body;
  try { body = await request.json(); } catch { return apiErr("Invalid JSON", 400); }

  const existing = await env.DB.prepare("SELECT id FROM resumes WHERE id=? AND user_id=?")
    .bind(id, user.id)
    .first();
  if (!existing) return apiErr("Not found", 404);

  const fields = [];
  const vals = [];
  if (body.name !== undefined)        { fields.push("name=?");         vals.push(body.name); }
  if (body.resume !== undefined)      { fields.push("resume_json=?");   vals.push(JSON.stringify(body.resume)); }
  if (body.templateId !== undefined)  { fields.push("template_id=?");   vals.push(body.templateId); }
  if (body.pageSize !== undefined)    { fields.push("page_size=?");      vals.push(body.pageSize); }
  if (body.design !== undefined)      { fields.push("design_json=?");    vals.push(body.design ? JSON.stringify(body.design) : null); }
  if (body.coverLetter !== undefined) { fields.push("cover_letter=?");   vals.push(body.coverLetter ?? null); }
  if (body.targetJob !== undefined)   { fields.push("target_job=?");     vals.push(body.targetJob ?? null); }
  if (!fields.length) return jsonRes({ updated: false });

  fields.push("updated_at=?");
  vals.push(Date.now(), id, user.id);
  await env.DB.prepare(`UPDATE resumes SET ${fields.join(",")} WHERE id=? AND user_id=?`)
    .bind(...vals)
    .run();
  return jsonRes({ updated: true });
}

async function handleDeleteResume(request, env, id) {
  const user = await requireAuth(request, env);
  const existing = await env.DB.prepare("SELECT id FROM resumes WHERE id=? AND user_id=?")
    .bind(id, user.id)
    .first();
  if (!existing) return apiErr("Not found", 404);
  await env.DB.prepare("DELETE FROM resumes WHERE id=? AND user_id=?").bind(id, user.id).run();
  return jsonRes({ deleted: true });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

async function handleAdminListResumes(request, env) {
  await requireAdmin(request, env);
  const rows = await env.DB.prepare(
    `SELECT r.id, r.name, r.target_job, r.template_id, r.page_size,
            r.design_json, r.cover_letter, r.created_at, r.updated_at,
            u.email AS user_email, u.name AS user_name
     FROM resumes r JOIN users u ON r.user_id = u.id
     ORDER BY r.updated_at DESC`
  ).all();
  return jsonRes({
    resumes: rows.results.map((r) => ({
      ...rowToMeta(r),
      userEmail: r.user_email,
      userName: r.user_name,
    })),
  });
}

async function handleAdminGetResume(request, env, id) {
  await requireAdmin(request, env);
  const row = await env.DB.prepare(
    `SELECT r.*, u.email AS user_email, u.name AS user_name
     FROM resumes r JOIN users u ON r.user_id = u.id WHERE r.id=?`
  )
    .bind(id)
    .first();
  if (!row) return apiErr("Not found", 404);
  return jsonRes({ ...rowToFull(row), userEmail: row.user_email, userName: row.user_name });
}

// ── Main handler ──────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { method } = request;
    const path = url.pathname;

    try {
      // Auth endpoints
      if (method === "GET"  && path === "/api/auth/google/start")    return handleAuthStart(request, env);
      if (method === "GET"  && path === "/api/auth/google/callback") return handleAuthCallback(request, env);
      if (method === "POST" && path === "/api/auth/logout")           return handleLogout(request, env);
      if (method === "GET"  && path === "/api/me")                    return handleMe(request, env);

      // Resume CRUD
      if (path === "/api/resumes") {
        if (method === "GET")  return handleListResumes(request, env);
        if (method === "POST") return handleCreateResume(request, env);
      }
      const mResume = path.match(/^\/api\/resumes\/([^/]+)$/);
      if (mResume) {
        const [, id] = mResume;
        if (method === "GET")    return handleGetResume(request, env, id);
        if (method === "PATCH")  return handlePatchResume(request, env, id);
        if (method === "DELETE") return handleDeleteResume(request, env, id);
      }

      // Admin
      if (path === "/api/admin/resumes" && method === "GET") return handleAdminListResumes(request, env);
      const mAdmin = path.match(/^\/api\/admin\/resumes\/([^/]+)$/);
      if (mAdmin && method === "GET") return handleAdminGetResume(request, env, mAdmin[1]);

      // Reject other /api/* calls
      if (path.startsWith("/api/")) return apiErr("Not found", 404);

      // render.html is an internal PDF-server artifact — never serve it publicly
      if (path === "/render.html") return new Response("Not found", { status: 404 });

      // Static assets + SPA fallback
      const asset = await env.ASSETS.fetch(request);
      if (asset.status === 404 && !/\.[a-z0-9]+$/i.test(path)) {
        return env.ASSETS.fetch(new Request(new URL("/index.html", url)));
      }
      return asset;

    } catch (e) {
      if (e?.status) return jsonRes({ error: e.code || "error", code: e.code }, e.status);
      console.error("Worker unhandled error:", e);
      return jsonRes({ error: "Internal server error" }, 500);
    }
  },
};
