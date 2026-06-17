-- CVLite cloud schema — run once after creating the D1 database:
--   wrangler d1 create cvlite
--   wrangler d1 execute cvlite --file=migrations/0001_initial.sql

CREATE TABLE IF NOT EXISTS users (
  id          TEXT    PRIMARY KEY,
  email       TEXT    UNIQUE NOT NULL,
  name        TEXT    NOT NULL DEFAULT '',
  picture     TEXT    NOT NULL DEFAULT '',
  provider    TEXT    NOT NULL DEFAULT 'google',
  provider_id TEXT    NOT NULL DEFAULT '',
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT    PRIMARY KEY,
  user_id     TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT    UNIQUE NOT NULL,
  expires_at  INTEGER NOT NULL,
  created_at  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id    ON sessions(user_id);

CREATE TABLE IF NOT EXISTS resumes (
  id           TEXT    PRIMARY KEY,
  user_id      TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT    NOT NULL DEFAULT 'My Resume',
  target_job   TEXT,
  resume_json  TEXT    NOT NULL DEFAULT '{}',
  template_id  TEXT    NOT NULL DEFAULT 'dark-sidebar',
  page_size    TEXT    NOT NULL DEFAULT 'A4',
  design_json  TEXT,
  cover_letter TEXT,
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);

-- Enforce 2-resume limit per user at the database level (defense in depth)
CREATE TRIGGER IF NOT EXISTS enforce_resume_limit
BEFORE INSERT ON resumes
BEGIN
  SELECT RAISE(ABORT, 'resume_limit_reached')
  WHERE (SELECT COUNT(*) FROM resumes WHERE user_id = NEW.user_id) >= 2;
END;
