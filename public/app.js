(function () {
  const STORAGE_KEY = "cvlite.resumeDraft.v1";
  const $ = (selector) => document.querySelector(selector);

  let state = {
    resume: loadDraft(),
    templateId: "dark-sidebar",
    pageSize: "A4"
  };

  const schemas = {
    experience: {
      title: "سوابق کاری",
      empty: () => ({ id: id(), hidden: false, organization: "", title: "", period: "", location: "", bullets: [] }),
      fields: [["organization", "سازمان"], ["title", "عنوان"], ["period", "بازه زمانی"], ["location", "مکان"]],
      list: "bullets"
    },
    education: {
      title: "تحصیلات",
      empty: () => ({ id: id(), hidden: false, organization: "", degree: "", period: "", location: "", description: "" }),
      fields: [["organization", "دانشگاه"], ["degree", "مدرک/رشته"], ["period", "بازه زمانی"], ["location", "مکان"]],
      textarea: [["description", "توضیح"]]
    },
    skills: {
      title: "مهارت‌ها",
      empty: () => ({ id: id(), hidden: false, name: "", level: "", keywords: [] }),
      fields: [["name", "گروه مهارت"], ["level", "سطح"]],
      list: "keywords"
    },
    projects: {
      title: "پروژه‌ها",
      empty: () => ({ id: id(), hidden: false, name: "", period: "", website: "", bullets: [] }),
      fields: [["name", "نام"], ["period", "بازه زمانی"], ["website", "لینک"]],
      list: "bullets"
    },
    certifications: {
      title: "دوره‌ها و گواهی‌ها",
      empty: () => ({ id: id(), hidden: false, title: "", issuer: "", date: "", description: "" }),
      fields: [["title", "عنوان"], ["issuer", "صادرکننده"], ["date", "تاریخ"]],
      textarea: [["description", "توضیح"]]
    },
    languages: {
      title: "زبان‌ها",
      empty: () => ({ id: id(), hidden: false, language: "", fluency: "", level: "4" }),
      fields: [["language", "زبان"], ["fluency", "سطح متنی"], ["level", "سطح ۱ تا ۵"]]
    },
    interests: {
      title: "علایق",
      empty: () => ({ id: id(), hidden: false, name: "", keywords: [] }),
      fields: [["name", "نام"]],
      list: "keywords"
    },
    publications: {
      title: "انتشارات",
      empty: () => ({ id: id(), hidden: false, title: "", publisher: "", date: "", description: "" }),
      fields: [["title", "عنوان"], ["publisher", "محل انتشار"], ["date", "تاریخ"]],
      textarea: [["description", "توضیح"]]
    },
    achievements: {
      title: "دستاوردها",
      empty: () => ({ id: id(), hidden: false, title: "", description: "" }),
      fields: [["title", "عنوان"]],
      textarea: [["description", "توضیح"]]
    }
  };

  function id() {
    return Math.random().toString(36).slice(2, 10);
  }

  function loadDraft() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? CVLite.normalizeResume(JSON.parse(saved)) : CVLite.emptyResume();
    } catch {
      return CVLite.emptyResume();
    }
  }

  function saveDraft() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.resume));
    setStatus("ذخیره شد");
  }

  function setStatus(text, danger = false) {
    const status = $("#status");
    status.textContent = text;
    status.classList.toggle("danger", danger);
  }

  function render() {
    renderTemplateTabs();
    renderBasics();
    renderSections();
    renderPreview();
    saveDraft();
  }

  function renderTemplateTabs() {
    const root = $("#template-tabs");
    root.innerHTML = CVLite.TEMPLATES.map((template) => `
      <button type="button" class="${template.id === state.templateId ? "active" : ""}" data-template="${template.id}">
        ${template.name}
      </button>
    `).join("");
    root.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        state.templateId = button.dataset.template;
        state.pageSize = CVLite.TEMPLATES.find((template) => template.id === state.templateId)?.pageSize || state.pageSize;
        $("#page-size").value = state.pageSize;
        render();
      });
    });
    $("#page-size").value = state.pageSize;
  }

  function renderBasics() {
    const fields = [
      ["firstName", "نام"],
      ["lastName", "نام خانوادگی"],
      ["headline", "تیتر حرفه‌ای"],
      ["email", "ایمیل"],
      ["phone", "تلفن"],
      ["location", "مکان"],
      ["linkedin", "لینکدین"],
      ["website", "وب‌سایت"],
      ["extra", "اطلاعات اضافه"]
    ];

    $("#basics-editor").innerHTML = `
      <div class="photo-tools">
        <div class="avatar-preview">${state.resume.basics.photo ? `<img src="${escapeAttr(state.resume.basics.photo)}" alt="">` : ""}</div>
        <label class="secondary-button">آپلود عکس<input id="photo-input" type="file" accept="image/*"></label>
        <button class="ghost-button" id="remove-photo" type="button">حذف</button>
      </div>
      ${fields.map(([key, label]) => inputField(`basics.${key}`, label, state.resume.basics[key] || "")).join("")}
      ${textareaField("summary", "Summary", state.resume.summary || "")}
    `;

    $("#photo-input").addEventListener("change", handlePhoto);
    $("#remove-photo").addEventListener("click", () => {
      state.resume.basics.photo = "";
      render();
    });
    bindFields($("#basics-editor"));
  }

  function renderSections() {
    const root = $("#sections-editor");
    root.innerHTML = Object.entries(schemas).map(([key, schema]) => renderArraySection(key, schema)).join("") + renderCustomEditor();
    bindFields(root);
    bindSectionButtons(root);
  }

  function renderArraySection(key, schema) {
    const items = state.resume[key] || [];
    return `<details class="editor-section" open>
      <summary><span>${schema.title}</span><button type="button" class="mini-button" data-add="${key}">افزودن</button></summary>
      <div class="items">
        ${items.map((item, index) => renderItem(key, schema, item, index)).join("") || `<p class="empty-note">هنوز آیتمی اضافه نشده است.</p>`}
      </div>
    </details>`;
  }

  function renderItem(key, schema, item, index) {
    return `<article class="edit-item">
      <div class="item-toolbar">
        <label><input type="checkbox" data-path="${key}.${index}.hidden" ${item.hidden ? "checked" : ""}> مخفی</label>
        <div>
          <button type="button" class="mini-button" data-move="${key}:${index}:-1">↑</button>
          <button type="button" class="mini-button" data-move="${key}:${index}:1">↓</button>
          <button type="button" class="mini-button danger-text" data-remove="${key}:${index}">حذف</button>
        </div>
      </div>
      ${(schema.fields || []).map(([field, label]) => inputField(`${key}.${index}.${field}`, label, item[field] || "")).join("")}
      ${(schema.textarea || []).map(([field, label]) => textareaField(`${key}.${index}.${field}`, label, item[field] || "")).join("")}
      ${schema.list ? listField(key, index, schema.list, item[schema.list] || []) : ""}
    </article>`;
  }

  function listField(key, index, field, values) {
    return `<label class="field"><span>موارد</span>
      <textarea data-path="${key}.${index}.${field}" data-list="true" rows="4">${escapeHtml(values.join("\n"))}</textarea>
    </label>`;
  }

  function renderCustomEditor() {
    const sections = state.resume.customSections || [];
    return `<details class="editor-section">
      <summary><span>بخش‌های سفارشی</span><button type="button" class="mini-button" data-add-custom-section="true">افزودن بخش</button></summary>
      <div class="items">
        ${sections.map((section, sectionIndex) => `
          <article class="edit-item">
            <div class="item-toolbar">
              <label><input type="checkbox" data-path="customSections.${sectionIndex}.hidden" ${section.hidden ? "checked" : ""}> مخفی</label>
              <button type="button" class="mini-button danger-text" data-remove-custom-section="${sectionIndex}">حذف بخش</button>
            </div>
            ${inputField(`customSections.${sectionIndex}.title`, "عنوان بخش", section.title || "")}
            <button type="button" class="secondary-button small" data-add-custom-item="${sectionIndex}">افزودن آیتم</button>
            ${(section.items || []).map((item, itemIndex) => `
              <div class="nested-item">
                <div class="item-toolbar">
                  <label><input type="checkbox" data-path="customSections.${sectionIndex}.items.${itemIndex}.hidden" ${item.hidden ? "checked" : ""}> مخفی</label>
                  <button type="button" class="mini-button danger-text" data-remove-custom-item="${sectionIndex}:${itemIndex}">حذف</button>
                </div>
                ${inputField(`customSections.${sectionIndex}.items.${itemIndex}.title`, "عنوان", item.title || "")}
                ${inputField(`customSections.${sectionIndex}.items.${itemIndex}.subtitle`, "زیرعنوان", item.subtitle || "")}
                ${inputField(`customSections.${sectionIndex}.items.${itemIndex}.period`, "زمان", item.period || "")}
                ${listField(`customSections.${sectionIndex}.items`, itemIndex, "bullets", item.bullets || [])}
              </div>
            `).join("")}
          </article>
        `).join("") || `<p class="empty-note">بخش سفارشی ندارید.</p>`}
      </div>
    </details>`;
  }

  function bindSectionButtons(root) {
    root.querySelectorAll("[data-add]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const key = button.dataset.add;
        state.resume[key] = state.resume[key] || [];
        state.resume[key].push(schemas[key].empty());
        render();
      });
    });
    root.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        const [key, index] = button.dataset.remove.split(":");
        state.resume[key].splice(Number(index), 1);
        render();
      });
    });
    root.querySelectorAll("[data-move]").forEach((button) => {
      button.addEventListener("click", () => {
        const [key, rawIndex, rawDirection] = button.dataset.move.split(":");
        const index = Number(rawIndex);
        const target = index + Number(rawDirection);
        if (target < 0 || target >= state.resume[key].length) return;
        const [item] = state.resume[key].splice(index, 1);
        state.resume[key].splice(target, 0, item);
        render();
      });
    });
    root.querySelector("[data-add-custom-section]")?.addEventListener("click", (event) => {
      event.preventDefault();
      state.resume.customSections.push({ id: id(), hidden: false, title: "Custom Section", items: [] });
      render();
    });
    root.querySelectorAll("[data-remove-custom-section]").forEach((button) => {
      button.addEventListener("click", () => {
        state.resume.customSections.splice(Number(button.dataset.removeCustomSection), 1);
        render();
      });
    });
    root.querySelectorAll("[data-add-custom-item]").forEach((button) => {
      button.addEventListener("click", () => {
        const sectionIndex = Number(button.dataset.addCustomItem);
        state.resume.customSections[sectionIndex].items.push({ id: id(), hidden: false, title: "", subtitle: "", period: "", bullets: [] });
        render();
      });
    });
    root.querySelectorAll("[data-remove-custom-item]").forEach((button) => {
      button.addEventListener("click", () => {
        const [sectionIndex, itemIndex] = button.dataset.removeCustomItem.split(":").map(Number);
        state.resume.customSections[sectionIndex].items.splice(itemIndex, 1);
        render();
      });
    });
  }

  function inputField(path, label, value) {
    return `<label class="field"><span>${label}</span><input data-path="${path}" value="${escapeAttr(value)}"></label>`;
  }

  function textareaField(path, label, value) {
    return `<label class="field"><span>${label}</span><textarea data-path="${path}" rows="5">${escapeHtml(value)}</textarea></label>`;
  }

  function bindFields(root) {
    root.querySelectorAll("[data-path]").forEach((field) => {
      const eventName = field.type === "checkbox" ? "change" : "input";
      field.addEventListener(eventName, () => {
        const value = field.type === "checkbox" ? field.checked : field.dataset.list ? field.value.split("\n").map((item) => item.trim()).filter(Boolean) : field.value;
        setPath(state.resume, field.dataset.path, value);
        renderPreview();
        saveDraft();
      });
    });
  }

  function setPath(target, path, value) {
    const parts = path.split(".");
    let cursor = target;
    parts.slice(0, -1).forEach((part) => {
      cursor = cursor[part];
    });
    cursor[parts[parts.length - 1]] = value;
  }

  function renderPreview() {
    const title = [state.resume.basics.firstName, state.resume.basics.lastName].filter(Boolean).join(" ");
    $("#preview-title").textContent = title || "رزومه";
    $("#preview").innerHTML = CVLite.renderResume(state.resume, state.templateId, { mode: "preview" });
  }

  async function handlePhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    const dataUrl = await readFile(file, "dataURL");
    state.resume.basics.photo = await cropCenterSquare(dataUrl, 520);
    render();
  }

  function readFile(file, mode = "text") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      if (mode === "dataURL") reader.readAsDataURL(file);
      else reader.readAsText(file);
    });
  }

  function cropCenterSquare(dataUrl, size) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const side = Math.min(image.width, image.height);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      image.src = dataUrl;
    });
  }

  async function importFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const text = await readFile(file);
      state.resume = file.name.toLowerCase().endsWith(".json")
        ? CVLite.normalizeRxResume(JSON.parse(text))
        : CVLite.parseMarkdown(text);
      setStatus(`Import شد: ${file.name}`);
      render();
    } catch (error) {
      setStatus(error.message || "Import ناموفق بود", true);
    } finally {
      event.target.value = "";
    }
  }

  function downloadText(name, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function downloadPdf() {
    setStatus("در حال ساخت PDF...");
    const name = [state.resume.basics.firstName, state.resume.basics.lastName].filter(Boolean).join("-").toLowerCase() || "resume";
    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          resume: state.resume,
          templateId: state.templateId,
          pageSize: state.pageSize,
          fileName: `${name}-${state.templateId}.pdf`
        })
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "ساخت PDF ناموفق بود." }));
        throw new Error(error.error);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name}-${state.templateId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      setStatus("PDF آماده شد");
    } catch (error) {
      setStatus(error.message, true);
    }
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }

  $("#file-input").addEventListener("change", importFile);
  $("#export-json").addEventListener("click", () => downloadText("resume-cvlite.json", JSON.stringify(state.resume, null, 2), "application/json"));
  $("#export-md").addEventListener("click", () => downloadText("resume-cvlite.md", CVLite.resumeToMarkdown(state.resume), "text/markdown"));
  $("#download-pdf").addEventListener("click", downloadPdf);
  $("#page-size").addEventListener("change", (event) => {
    state.pageSize = event.target.value;
    renderPreview();
    saveDraft();
  });

  render();
})();
