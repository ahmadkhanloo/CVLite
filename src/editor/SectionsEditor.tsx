import { useEditor } from "../store/resume";
import { useT } from "../i18n/useT";
import { SECTION_ORDER, SECTION_SCHEMAS, type SectionSchema } from "./schemas";
import { ListField, TextArea, TextField } from "./Fields";
import type { ArraySectionKey } from "../types/resume";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "../components/Icon";

/* eslint-disable @typescript-eslint/no-explicit-any */

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  return (
    <div ref={setNodeRef} style={style}>
      <div className="drag-handle" {...attributes} {...listeners} title="Drag to reorder">
        ⠿
      </div>
      {children}
    </div>
  );
}

function ItemToolbar({ keyName, index }: { keyName: ArraySectionKey; index: number }) {
  const t = useT();
  const hidden = useEditor((s) => ((s.resume[keyName][index] as any).hidden as boolean));
  const setField = useEditor((s) => s.setField);
  const removeItem = useEditor((s) => s.removeItem);
  return (
    <div className="item-toolbar">
      <label>
        <input type="checkbox" checked={!!hidden} onChange={(e) => setField(`${keyName}.${index}.hidden`, e.target.checked)} />
        {" "}{t("hidden")}
      </label>
      <button type="button" className="mini-button danger-text" onClick={() => removeItem(keyName, index)}>
        <Icon name="trash" size={13} />
        {t("remove")}
      </button>
    </div>
  );
}

function ArraySection({ keyName, schema }: { keyName: ArraySectionKey; schema: SectionSchema }) {
  const t = useT();
  const items = useEditor((s) => s.resume[keyName]) as any[];
  const addItem = useEditor((s) => s.addItem);
  const reorderItem = useEditor((s) => s.reorderItem);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = items.findIndex((item) => item.id === active.id);
    const toIndex = items.findIndex((item) => item.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1) reorderItem(keyName, fromIndex, toIndex);
  }

  return (
    <details className="editor-section" open>
      <summary>
        <span>{t(schema.titleKey)}</span>
        <button type="button" className="mini-button" onClick={(e) => { e.preventDefault(); addItem(keyName); }}>
          <Icon name="plus" size={13} />
          {t("add")}
        </button>
      </summary>
      <div className="items">
        {items.length === 0 ? (
          <p className="empty-note">{t("noItems")}</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              {items.map((item, index) => (
                <SortableItem key={item.id || index} id={item.id || String(index)}>
                  <article className="edit-item">
                    <ItemToolbar keyName={keyName} index={index} />
                    {schema.fields.map(([field, labelKey]) => (
                      <TextField key={field} path={`${keyName}.${index}.${field}`} label={t(labelKey)} value={item[field] || ""} />
                    ))}
                    {(schema.textarea || []).map(([field, labelKey]) => (
                      <TextArea key={field} path={`${keyName}.${index}.${field}`} label={t(labelKey)} value={item[field] || ""} />
                    ))}
                    {schema.list ? (
                      <ListField path={`${keyName}.${index}.${schema.list}`} label={t("items")} value={item[schema.list] || []} />
                    ) : null}
                  </article>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </details>
  );
}

function CustomEditor() {
  const t = useT();
  const sections = useEditor((s) => s.resume.customSections);
  const setField = useEditor((s) => s.setField);
  const addCustomSection = useEditor((s) => s.addCustomSection);
  const removeCustomSection = useEditor((s) => s.removeCustomSection);
  const addCustomItem = useEditor((s) => s.addCustomItem);
  const removeCustomItem = useEditor((s) => s.removeCustomItem);

  return (
    <details className="editor-section">
      <summary>
        <span>{t("customSections")}</span>
        <button type="button" className="mini-button" onClick={(e) => { e.preventDefault(); addCustomSection(); }}>
          <Icon name="plus" size={13} />
          {t("addSection")}
        </button>
      </summary>
      <div className="items">
        {sections.length === 0 ? (
          <p className="empty-note">{t("noCustom")}</p>
        ) : (
          sections.map((section, sectionIndex) => (
            <article className="edit-item" key={section.id}>
              <div className="item-toolbar">
                <label>
                  <input type="checkbox" checked={!!section.hidden} onChange={(e) => setField(`customSections.${sectionIndex}.hidden`, e.target.checked)} />
                  {" "}{t("hidden")}
                </label>
                <button type="button" className="mini-button danger-text" onClick={() => removeCustomSection(sectionIndex)}>
                  <Icon name="trash" size={13} />
                  {t("removeSection")}
                </button>
              </div>
              <TextField path={`customSections.${sectionIndex}.title`} label={t("sectionTitle")} value={section.title || ""} />
              <button type="button" className="secondary-button small" onClick={() => addCustomItem(sectionIndex)}>
                <Icon name="plus" size={13} />
                {t("addItem")}
              </button>
              {section.items.map((item, itemIndex) => (
                <div className="nested-item" key={item.id}>
                  <div className="item-toolbar">
                    <label>
                      <input type="checkbox" checked={!!item.hidden} onChange={(e) => setField(`customSections.${sectionIndex}.items.${itemIndex}.hidden`, e.target.checked)} />
                      {" "}{t("hidden")}
                    </label>
                    <button type="button" className="mini-button danger-text" onClick={() => removeCustomItem(sectionIndex, itemIndex)}>
                      <Icon name="trash" size={13} />
                      {t("remove")}
                    </button>
                  </div>
                  <TextField path={`customSections.${sectionIndex}.items.${itemIndex}.title`} label={t("title")} value={item.title || ""} />
                  <TextField path={`customSections.${sectionIndex}.items.${itemIndex}.subtitle`} label={t("subtitle")} value={item.subtitle || ""} />
                  <TextField path={`customSections.${sectionIndex}.items.${itemIndex}.period`} label={t("periodLabel")} value={item.period || ""} />
                  <ListField path={`customSections.${sectionIndex}.items.${itemIndex}.bullets`} label={t("items")} value={item.bullets || []} />
                </div>
              ))}
            </article>
          ))
        )}
      </div>
    </details>
  );
}

export function SectionsEditor() {
  return (
    <div id="sections-editor">
      {SECTION_ORDER.map((key) => (
        <ArraySection key={key} keyName={key} schema={SECTION_SCHEMAS[key]} />
      ))}
      <CustomEditor />
    </div>
  );
}
