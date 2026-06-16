import { useEditor } from "../store/resume";
import { useT } from "../i18n/useT";
import { EXTENDED_TEMPLATES } from "../templates";
import type { PageSize, TemplateId } from "../types/resume";

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
            className={`template-chip${template.id === templateId ? " active" : ""}`}
            onClick={() => setTemplate(template.id as TemplateId)}
          >
            {template.name}
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
