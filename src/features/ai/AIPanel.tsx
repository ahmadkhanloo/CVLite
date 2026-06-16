import { useState } from "react";
import { useAI } from "../../store/ai";
import { useEditor } from "../../store/resume";
import { useT } from "../../i18n/useT";
import type { AIProvider } from "../../types/ai";
import { rewriteBullet, generateSummary, tailorResume, atsCheck } from "./actions";

export function AIPanel() {
  const t = useT();
  const ai = useAI();
  const resume = useEditor((s) => s.resume);
  const setField = useEditor((s) => s.setField);
  const setResume = useEditor((s) => s.setResume);

  const [localKey, setLocalKey] = useState(ai.apiKey);
  const [jobDesc, setJobDesc] = useState("");
  const [bulletInput, setBulletInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasKey = Boolean(ai.apiKey);

  async function run(action: () => Promise<string>) {
    if (!hasKey) { setError(t("noApiKey")); return; }
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const result = await action();
      setOutput(result);
    } catch (err) {
      setError((err as Error).message || t("aiError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel-section ai-panel">
      <h2>{t("aiTab")}</h2>

      {/* API Key setup */}
      <details>
        <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{t("aiSettings")}</summary>
        <p className="empty-note" style={{ marginBottom: 8 }}>{t("aiOptional")}</p>
        <label className="field">
          <span>{t("aiProvider")}</span>
          <select value={ai.provider} onChange={(e) => ai.setProvider(e.target.value as AIProvider)}>
            <option value="anthropic">Anthropic (Claude)</option>
            <option value="openai">OpenAI (GPT)</option>
          </select>
        </label>
        <label className="field">
          <span>{t("apiKey")}</span>
          <input
            type="password"
            value={localKey}
            placeholder={t("apiKeyPlaceholder")}
            onChange={(e) => setLocalKey(e.target.value)}
          />
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="secondary-button" type="button" onClick={() => { ai.setApiKey(localKey); }}>
            {t("saveKey")}
          </button>
          {hasKey && (
            <button className="ghost-button danger-text" type="button" onClick={() => { ai.clear(); setLocalKey(""); }}>
              {t("removeKey")}
            </button>
          )}
        </div>
      </details>

      {/* Rewrite Bullet */}
      <div className="ai-action">
        <p className="ai-action-label">{t("rewriteBullet")}</p>
        <input
          placeholder={t("selectBullet")}
          value={bulletInput}
          onChange={(e) => setBulletInput(e.target.value)}
          className="ai-text-input"
        />
        <button
          className="secondary-button"
          disabled={loading || !bulletInput.trim()}
          onClick={() => run(() => rewriteBullet(ai, bulletInput, resume.basics.headline))}
        >
          {loading ? t("applying") : t("rewriteBullet")}
        </button>
      </div>

      {/* Generate Summary */}
      <div className="ai-action">
        <p className="ai-action-label">{t("generateSummary")}</p>
        <button
          className="secondary-button"
          disabled={loading}
          onClick={() =>
            run(async () => {
              const result = await generateSummary(ai, resume);
              setField("summary", result);
              return result;
            })
          }
        >
          {loading ? t("applying") : t("generateSummary")}
        </button>
      </div>

      {/* Tailor + ATS */}
      <div className="ai-action">
        <p className="ai-action-label">{t("jobDescription")}</p>
        <textarea
          rows={5}
          placeholder={t("jobDescPlaceholder")}
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="ai-text-input"
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            className="secondary-button"
            disabled={loading || !jobDesc.trim()}
            onClick={() => run(() => tailorResume(ai, resume, jobDesc))}
          >
            {t("tailorToJob")}
          </button>
          <button
            className="secondary-button"
            disabled={loading || !jobDesc.trim()}
            onClick={() => run(() => atsCheck(ai, resume, jobDesc))}
          >
            {t("atsCheck")}
          </button>
        </div>
      </div>

      {/* Output */}
      {error && <p className="status danger" style={{ whiteSpace: "pre-wrap", borderRadius: 6 }}>{error}</p>}
      {output && (
        <div className="ai-output">
          <p style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Result:</p>
          <pre className="ai-output-text">{output}</pre>
          {output && (
            <button
              className="ghost-button"
              style={{ fontSize: 12, marginTop: 6 }}
              onClick={() => {
                const r2 = structuredClone(resume);
                r2.summary = output;
                setResume(r2);
              }}
            >
              Apply as summary
            </button>
          )}
        </div>
      )}
    </section>
  );
}
