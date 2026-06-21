import { useEditor } from "../store/resume";
import { useT } from "../i18n/useT";
import { cropCenterSquare, readFile } from "../lib/files";
import { TextArea, TextField } from "./Fields";
import type { TranslationKey } from "../i18n/dictionaries";
import { Icon } from "../components/Icon";

const BASIC_FIELDS: Array<[keyof import("../types/resume").Basics, TranslationKey]> = [
  ["firstName", "firstName"],
  ["lastName", "lastName"],
  ["headline", "headline"],
  ["email", "email"],
  ["phone", "phone"],
  ["location", "location"],
  ["linkedin", "linkedin"],
  ["website", "website"],
  ["extra", "extra"]
];

const BASIC_PLACEHOLDERS: Partial<Record<keyof import("../types/resume").Basics, TranslationKey>> = {
  firstName: "firstNamePlaceholder",
  lastName: "lastNamePlaceholder",
  headline: "headlinePlaceholder",
  email: "emailPlaceholder",
  phone: "phonePlaceholder",
  location: "locationPlaceholder",
  linkedin: "linkedinPlaceholder",
  website: "websitePlaceholder",
  extra: "extraPlaceholder"
};

export function BasicsEditor() {
  const t = useT();
  const basics = useEditor((s) => s.resume.basics);
  const summary = useEditor((s) => s.resume.summary);
  const setField = useEditor((s) => s.setField);

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFile(file, "dataURL");
    setField("basics.photo", await cropCenterSquare(dataUrl, 520));
  }

  return (
    <div id="basics-editor">
      <div className="photo-tools">
        <div className="avatar-preview">{basics.photo ? <img src={basics.photo} alt="" /> : null}</div>
        <label className="secondary-button">
          <Icon name="upload" />
          {t("uploadPhoto")}
          <input type="file" accept="image/*" onChange={handlePhoto} />
        </label>
        <button className="ghost-button" type="button" onClick={() => setField("basics.photo", "")}>
          <Icon name="trash" size={14} />
          {t("remove")}
        </button>
      </div>
      {BASIC_FIELDS.map(([key, labelKey]) => (
        <TextField key={key} path={`basics.${key}`} label={t(labelKey)} value={basics[key] || ""} placeholder={BASIC_PLACEHOLDERS[key] ? t(BASIC_PLACEHOLDERS[key]) : ""} />
      ))}
      <TextArea path="summary" label={t("summary")} value={summary || ""} placeholder={t("summaryPlaceholder")} />
    </div>
  );
}
