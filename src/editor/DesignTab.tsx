import { useEditor } from "../store/resume";
import { useT } from "../i18n/useT";
import { TemplatePicker } from "./TemplatePicker";

export function DesignTab() {
  const t = useT();
  const design = useEditor((s) => s.design);
  const setDesign = useEditor((s) => s.setDesign);

  return (
    <div className="design-tab">
      <section className="panel-section">
        <h2>{t("templateSection")}</h2>
        <TemplatePicker />
      </section>

      <section className="panel-section">
        <h2>{t("designTab")}</h2>

        <label className="field">
          <span>{t("accentColor")}</span>
          <div className="color-field">
            <input
              type="color"
              value={design.accentColor || "#1a1a2e"}
              onChange={(e) => setDesign({ accentColor: e.target.value })}
            />
            <input
              type="text"
              value={design.accentColor || ""}
              placeholder="#1a1a2e"
              onChange={(e) => setDesign({ accentColor: e.target.value })}
            />
          </div>
        </label>

        <label className="field">
          <span>{t("fontScale")} ({Math.round((design.fontScale ?? 1) * 100)}%)</span>
          <input
            type="range"
            min="0.8"
            max="1.15"
            step="0.01"
            value={design.fontScale ?? 1}
            onChange={(e) => setDesign({ fontScale: parseFloat(e.target.value) })}
          />
        </label>

        <label className="field">
          <span>{t("lineHeightLabel")} ({(design.lineHeight ?? 1.28).toFixed(2)})</span>
          <input
            type="range"
            min="1.1"
            max="1.6"
            step="0.02"
            value={design.lineHeight ?? 1.28}
            onChange={(e) => setDesign({ lineHeight: parseFloat(e.target.value) })}
          />
        </label>

        <button
          className="ghost-button"
          type="button"
          style={{ marginTop: 8 }}
          onClick={() => setDesign({ accentColor: undefined, fontScale: undefined, lineHeight: undefined })}
        >
          {t("resetDesign")}
        </button>
      </section>
    </div>
  );
}
