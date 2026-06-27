import { useEditor } from "../store/resume";
import { useSettings } from "../store/settings";
import { useT } from "../i18n/useT";
import { EXTENDED_TEMPLATES } from "../templates";
import type { PageSize, ResumeLocale, TemplateId } from "../types/resume";

const previewFor = (id: TemplateId, locale: ResumeLocale) => new URL(`../../assets/templates/${id}.${locale}.png`, import.meta.url).href;

export function TemplatePicker() {
  const t = useT();
  const templateId = useEditor((s) => s.templateId);
  const pageSize = useEditor((s) => s.pageSize);
  const setTemplate = useEditor((s) => s.setTemplate);
  const setPageSize = useEditor((s) => s.setPageSize);
  const language = useSettings((s) => s.language);

  const PERSIAN_FIRST = ["gordafarid-defender", "rudabeh-heritage"];
  const sortedTemplates = language === "fa"
    ? [...EXTENDED_TEMPLATES].sort((a, b) => {
        const ai = PERSIAN_FIRST.indexOf(a.id);
        const bi = PERSIAN_FIRST.indexOf(b.id);
        if (ai !== -1 && bi !== -1) return ai - bi;
        if (ai !== -1) return -1;
        if (bi !== -1) return 1;
        return 0;
      })
    : EXTENDED_TEMPLATES;

  return (
    <>
      <div className="template-grid">
        {sortedTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            className={`template-card${template.id === templateId ? " active" : ""}`}
            onClick={() => setTemplate(template.id as TemplateId)}
            aria-pressed={template.id === templateId}
          >
            <span className="template-card-preview">
              <img src={previewFor(template.id as TemplateId, language)} alt="" loading="lazy" />
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
