import { useEditor } from "../store/resume";
import { useT } from "../i18n/useT";
import { EXTENDED_TEMPLATES } from "../templates";
import type { PageSize, TemplateId } from "../types/resume";

const previewFor = (id: TemplateId) => new URL(`../../assets/templates/${id}.png`, import.meta.url).href;

export function TemplatePicker() {
  const t = useT();
  const templateId = useEditor((s) => s.templateId);
  const pageSize = useEditor((s) => s.pageSize);
  const setTemplate = useEditor((s) => s.setTemplate);
  const setPageSize = useEditor((s) => s.setPageSize);

  return (
    <>
      <div className="template-grid">
        {EXTENDED_TEMPLATES.map((template) => (
          <button
            key={template.id}
            type="button"
            className={`template-card${template.id === templateId ? " active" : ""}`}
            onClick={() => setTemplate(template.id as TemplateId)}
            aria-pressed={template.id === templateId}
          >
            <span className="template-card-preview">
              <img src={previewFor(template.id as TemplateId)} alt="" loading="lazy" />
            </span>
            <span className="template-card-copy">
              <span className="template-card-name">{template.name}</span>
              <span className="template-card-desc">{template.description}</span>
            </span>
          </button>
        ))}
      </div>
      <label className="field compact-field" style={{ marginTop: 8 }}>
        <span>{t("pageSize")}</span>
        <select value={pageSize} onChange={(e) => setPageSize(e.target.value as PageSize)}>
          <option value="A4">A4</option>
          <option value="Letter">Letter</option>
        </select>
      </label>
    </>
  );
}
