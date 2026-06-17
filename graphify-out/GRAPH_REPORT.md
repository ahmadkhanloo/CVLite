# Graph Report - CVLite  (2026-06-17)

## Corpus Check
- 51 files · ~112,305 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 411 nodes · 870 edges · 17 communities (15 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9a4392de`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]

## God Nodes (most connected - your core abstractions)
1. `t()` - 23 edges
2. `useT()` - 23 edges
3. `useEditor` - 23 edges
4. `uid()` - 17 edges
5. `compilerOptions` - 17 edges
6. `Resume` - 16 edges
7. `renderClassic()` - 15 edges
8. `renderDark()` - 13 edges
9. `renderPurple()` - 13 edges
10. `scripts` - 11 edges

## Surprising Connections (you probably didn't know these)
- `AIPanel()` --calls--> `t()`  [INFERRED]
  src/features/ai/AIPanel.tsx → public/app.js
- `CoverLetterEditor()` --calls--> `t()`  [INFERRED]
  src/features/cover-letter/CoverLetterEditor.tsx → public/app.js
- `BasicsEditor()` --calls--> `t()`  [INFERRED]
  src/editor/BasicsEditor.tsx → public/app.js
- `DesignTab()` --calls--> `t()`  [INFERRED]
  src/editor/DesignTab.tsx → public/app.js
- `ArraySection()` --calls--> `t()`  [INFERRED]
  src/editor/SectionsEditor.tsx → public/app.js

## Import Cycles
- None detected.

## Communities (17 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (40): CoverLetterEditor(), BASIC_FIELDS, BasicsEditor(), DesignTab(), ListField(), TextArea(), TextField(), SECTION_ORDER (+32 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (32): clone(), emptyResume(), normalizeResume(), uid(), backupAllDocs(), deleteDoc(), listDocs(), loadDoc() (+24 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (38): Certifications(), Contact(), CustomSections(), Education(), Identity(), InlineContact(), LanguagesInline(), LanguagesWithDots() (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (38): addCustom(), classifySection(), cleanMd(), emptyResume(), escapeHtml(), mapItems(), markdownItems(), normalizeBullets() (+30 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (38): dependencies, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, i18next, idb-keyval, react, react-dom (+30 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (30): applySettings(), bindFields(), bindSectionButtons(), cropCenterSquare(), downloadPdf(), escapeAttr(), escapeHtml(), getSchemas() (+22 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (23): cleanMd(), compact(), itemVisible(), normalizeBullets(), splitName(), textFromRich(), Any, markdownItems() (+15 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (18): BROWSERS, buildHtml(), __dirname, DIST_DIR, findBrowser(), main(), OUT_DIR, ROOT (+10 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (17): crypto, DEFAULT_PORT, EXPLICIT_PORT, exportPdf(), findBrowser(), fs, http, MIME (+9 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (13): DEFAULT_PORT, __dirname, DIST_DIR, EXPLICIT_PORT, exportPdf(), findBrowser(), MIME, payloads (+5 more)

### Community 11 - "Community 11"
Cohesion: 0.28
Nodes (11): atsCheck(), callAI(), generateSummary(), rewriteBullet(), tailorResume(), AIPanel(), AIState, useAI (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (15): CVLite — Resume Studio, English, Features, ▶ Live demo — <https://cvlite.mahmadkhanloo.workers.dev>, PDF Export, Quick Start, Sample Resume, Template Gallery (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (6): Custom domain, Deploying CVLite (free, Iran-accessible), Option A — Connect the Git repo (auto-deploy on every push), Option B — Deploy from your machine (Wrangler CLI), Other Iran-friendly options, Recommended: Cloudflare Pages

## Knowledge Gaps
- **120 isolated node(s):** `name`, `version`, `private`, `type`, `description` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `t()` connect `Community 5` to `Community 0`, `Community 1`, `Community 11`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `uid()` connect `Community 1` to `Community 3`, `Community 6`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `emptyResume()` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `t()` (e.g. with `AIPanel()` and `CoverLetterEditor()`) actually correct?**
  _`t()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `uid()` (e.g. with `addCustom()` and `emptyResume()`) actually correct?**
  _`uid()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08942139099941554 - nodes in this community are weakly interconnected._