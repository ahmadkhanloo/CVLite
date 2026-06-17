import { execFileSync } from "node:child_process";

function git(args) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return "unavailable";
  }
}

const info = {
  gitBranch: git(["rev-parse", "--abbrev-ref", "HEAD"]),
  gitCommit: git(["rev-parse", "--short=12", "HEAD"]),
  gitCommitFull: git(["rev-parse", "HEAD"]),
  cfPagesBranch: process.env.CF_PAGES_BRANCH || "",
  cfPagesCommitSha: process.env.CF_PAGES_COMMIT_SHA || "",
  cfPagesUrl: process.env.CF_PAGES_URL || "",
  nodeEnv: process.env.NODE_ENV || ""
};

console.log("[build-info]", JSON.stringify(info, null, 2));
