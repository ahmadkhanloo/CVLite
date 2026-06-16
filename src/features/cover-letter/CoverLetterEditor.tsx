import { useEditor } from "../../store/resume";
import { useT } from "../../i18n/useT";

export function CoverLetterEditor() {
  const t = useT();
  const coverLetter = useEditor((s) => s.coverLetter);
  const setCoverLetter = useEditor((s) => s.setCoverLetter);

  return (
    <section className="panel-section">
      <h2>{t("coverLetter")}</h2>
      <textarea
        className="cover-letter-textarea"
        placeholder={t("coverLetterPlaceholder")}
        value={coverLetter}
        rows={20}
        onChange={(e) => setCoverLetter(e.target.value)}
      />
    </section>
  );
}
