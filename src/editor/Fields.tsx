import { useEditor } from "../store/resume";

export function TextField({ path, label, value }: { path: string; label: string; value: string }) {
  const setField = useEditor((s) => s.setField);
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={(e) => setField(path, e.target.value)} />
    </label>
  );
}

export function TextArea({ path, label, value, rows = 5 }: { path: string; label: string; value: string; rows?: number }) {
  const setField = useEditor((s) => s.setField);
  return (
    <label className="field">
      <span>{label}</span>
      <textarea rows={rows} value={value} onChange={(e) => setField(path, e.target.value)} />
    </label>
  );
}

/** Newline-separated list editor — mirrors the data-list textarea in legacy app.js. */
export function ListField({ path, label, value }: { path: string; label: string; value: string[] }) {
  const setField = useEditor((s) => s.setField);
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        rows={4}
        value={(value || []).join("\n")}
        onChange={(e) => setField(path, e.target.value.split("\n").map((item) => item.trim()).filter(Boolean))}
      />
    </label>
  );
}
