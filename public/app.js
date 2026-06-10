(function () {
  const STORAGE_KEY = "cvlite.resumeDraft.v1";
  const SETTINGS_KEY = "cvlite.settings.v1";
  const $ = (selector) => document.querySelector(selector);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  const I18N = {
    fa: {
      appTitle: "رزومه‌ساز محلی",
      language: "زبان",
      theme: "تم",
      themeSystem: "سیستم",
      themeLight: "روشن",
      themeDark: "تیره",
      import: "Import",
      importTitle: "Import JSON or Markdown",
      downloadPdf: "دانلود PDF",
      templateSection: "قالب خروجی",
      pageSize: "اندازه صفحه",
      basicsSection: "اطلاعات اصلی",
      sectionsSection: "بخش‌ها",
      preview: "Preview",
      saved: "ذخیره شد",
      resume: "رزومه",
      uploadPhoto: "آپلود عکس",
      remove: "حذف",
      add: "افزودن",
      hidden: "مخفی",
      moveUp: "↑",
      moveDown: "↓",
      noItems: "هنوز آیتمی اضافه نشده است.",
      noCustom: "بخش سفارشی ندارید.",
      customSections: "بخش‌های سفارشی",
      addSection: "افزودن بخش",
      removeSection: "حذف بخش",
      addItem: "افزودن آیتم",
      items: "موارد",
      sectionTitle: "عنوان بخش",
      title: "عنوان",
      subtitle: "زیرعنوان",
      periodLabel: "زمان",
      summary: "Summary",
      firstName: "نام",
      lastName: "نام خانوادگی",
      headline: "تیتر حرفه‌ای",
      email: "ایمیل",
      phone: "تلفن",
      location: "مکان",
      linkedin: "لینکدین",
      website: "وب‌سایت",
      extra: "اطلاعات اضافه",
      experience: "سوابق کاری",
      education: "تحصیلات",
      skills: "مهارت‌ها",
      projects: "پروژه‌ها",
      certifications: "دوره‌ها و گواهی‌ها",
      languages: "زبان‌ها",
      interests: "علایق",
      publications: "انتشارات",
      achievements: "دستاوردها",
      organization: "سازمان",
      roleTitle: "عنوان",
      period: "بازه زمانی",
      degree: "مدرک/رشته",
      description: "توضیح",
      skillGroup: "گروه مهارت",
      level: "سطح",
      projectName: "نام",
      link: "لینک",
      issuer: "صادرکننده",
      date: "تاریخ",
      languageName: "زبان",
      fluency: "سطح متنی",
      numericLevel: "سطح ۱ تا ۵",
      publisher: "محل انتشار",
      imported: "Import شد",
      importFailed: "Import ناموفق بود",
      buildingPdf: "در حال ساخت PDF...",
      pdfFailed: "ساخت PDF ناموفق بود.",
      pdfReady: "PDF آماده شد"
    },
    en: {
      appTitle: "Local Resume Builder",
      language: "Language",
      theme: "Theme",
      themeSystem: "System",
      themeLight: "Light",
      themeDark: "Dark",
      import: "Import",
      importTitle: "Import JSON or Markdown",
      downloadPdf: "Download PDF",
      templateSection: "Output Template",
      pageSize: "Page Size",
      basicsSection: "Basics",
      sectionsSection: "Sections",
      preview: "Preview",
      saved: "Saved",
      resume: "Resume",
      uploadPhoto: "Upload Photo",
      remove: "Remove",
      add: "Add",
      hidden: "Hidden",
      moveUp: "↑",
      moveDown: "↓",
      noItems: "No items yet.",
      noCustom: "No custom sections yet.",
      customSections: "Custom Sections",
      addSection: "Add Section",
      removeSection: "Remove Section",
      addItem: "Add Item",
      items: "Items",
      sectionTitle: "Section Title",
      title: "Title",
      subtitle: "Subtitle",
      periodLabel: "Period",
      summary: "Summary",
      firstName: "First Name",
      lastName: "Last Name",
      headline: "Professional Headline",
      email: "Email",
      phone: "Phone",
      location: "Location",
      linkedin: "LinkedIn",
      website: "Website",
      extra: "Extra Information",
      experience: "Experience",
      education: "Education",
      skills: "Skills",
      projects: "Projects",
      certifications: "Courses & Certifications",
      languages: "Languages",
      interests: "Interests",
      publications: "Publications",
      achievements: "Achievements",
      organization: "Organization",
      roleTitle: "Role",
      period: "Period",
      degree: "Degree / Field",
      description: "Description",
      skillGroup: "Skill Group",
      level: "Level",
      projectName: "Name",
      link: "Link",
      issuer: "Issuer",
      date: "Date",
      languageName: "Language",
      fluency: "Fluency",
      numericLevel: "Level 1 to 5",
      publisher: "Publisher",
      imported: "Imported",
      importFailed: "Import failed",
      buildingPdf: "Building PDF...",
      pdfFailed: "PDF export failed.",
      pdfReady: "PDF is ready"
    }
  };

  let settings = loadSettings();
  let state = {
    resume: loadDraft(),
    templateId: "dark-sidebar",
    pageSize: "A4"
  };

  function getSchemas() {
    return {
      experience: {
      title: t("experience"),
      empty: () => ({ id: id(), hidden: false, organization: "", title: "", period: "", location: "", bullets: [] }),
      fields: [["organization", t("organization")], ["title", t("roleTitle")], ["period", t("period")], ["location", t("location")]],
      list: "bullets"
    },
    education: {
      title: t("education"),
      empty: () => ({ id: id(), hidden: false, organization: "", degree: "", period: "", location: "", description: "" }),
      fields: [["organization", t("organization")], ["degree", t("degree")], ["period", t("period")], ["location", t("location")]],
      textarea: [["description", t("description")]]
    },
    skills: {
      title: t("skills"),
      empty: () => ({ id: id(), hidden: false, name: "", level: "", keywords: [] }),
      fields: [["name", t("skillGroup")], ["level", t("level")]],
      list: "keywords"
    },
    projects: {
      title: t("projects"),
      empty: () => ({ id: id(), hidden: false, name: "", period: "", website: "", bullets: [] }),
      fields: [["name", t("projectName")], ["period", t("period")], ["website", t("link")]],
      list: "bullets"
    },
    certifications: {
      title: t("certifications"),
      empty: () => ({ id: id(), hidden: false, title: "", issuer: "", date: "", description: "" }),
      fields: [["title", t("title")], ["issuer", t("issuer")], ["date", t("date")]],
      textarea: [["description", t("description")]]
    },
    languages: {
      title: t("languages"),
      empty: () => ({ id: id(), hidden: false, language: "", fluency: "", level: "4" }),
      fields: [["language", t("languageName")], ["fluency", t("fluency")], ["level", t("numericLevel")]]
    },
    interests: {
      title: t("interests"),
      empty: () => ({ id: id(), hidden: false, name: "", keywords: [] }),
      fields: [["name", t("projectName")]],
      list: "keywords"
    },
    publications: {
      title: t("publications"),
      empty: () => ({ id: id(), hidden: false, title: "", publisher: "", date: "", description: "" }),
      fields: [["title", t("title")], ["publisher", t("publisher")], ["date", t("date")]],
      textarea: [["description", t("description")]]
    },
    achievements: {
      title: t("achievements"),
      empty: () => ({ id: id(), hidden: false, title: "", description: "" }),
      fields: [["title", t("title")]],
      textarea: [["description", t("description")]]
      }
    };
  }

  function t(key) {
    return I18N[settings.language]?.[key] || I18N.en[key] || key;
  }

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
      return {
        language: saved.language || (navigator.language && navigator.language.toLowerCase().startsWith("fa") ? "fa" : "en"),
        theme: saved.theme || "system"
      };
    } catch {
      return {
        language: navigator.language && navigator.language.toLowerCase().startsWith("fa") ? "fa" : "en",
        theme: "system"
      };
    }
  }

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function resolvedTheme() {
    return settings.theme === "system" ? (prefersDark.matches ? "dark" : "light") : settings.theme;
  }

  function applySettings() {
    document.documentElement.lang = settings.language;
    document.documentElement.dir = settings.language === "fa" ? "rtl" : "ltr";
    document.documentElement.dataset.theme = resolvedTheme();
    document.documentElement.dataset.themeMode = settings.theme;
    $("#language-select").value = settings.language;
    $("#theme-select").value = settings.theme;
  }

  function renderStaticText() {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((node) => {
      node.title = t(node.dataset.i18nTitle);
    });
  }

  function id() {
    return Math.random().toString(36).slice(2, 10);
  }

  function loadDraft() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? migrateLegacyDefault(CVLite.normalizeResume(JSON.parse(saved))) : CVLite.emptyResume();
    } catch {
      return CVLite.emptyResume();
    }
  }

  function migrateLegacyDefault(resume) {
    const basics = resume.basics || {};
    const fingerprint = hashString([
      basics.email,
      basics.phone,
      basics.linkedin,
      String(basics.firstName || "").toUpperCase(),
      String(basics.lastName || "").toUpperCase()
    ].join("|"));
    return fingerprint === 1349005522 ? CVLite.emptyResume() : resume;
  }

  function hashString(value) {
    let hash = 0;
    for (const char of String(value || "")) {
      hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
    }
    return hash;
  }

  function saveDraft() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.resume));
    setStatus(t("saved"));
  }

  function setStatus(text, danger = false) {
    const status = $("#status");
    status.textContent = text;
    status.classList.toggle("danger", danger);
  }

  function render() {
    applySettings();
    renderStaticText();
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
      ["firstName", t("firstName")],
      ["lastName", t("lastName")],
      ["headline", t("headline")],
      ["email", t("email")],
      ["phone", t("phone")],
      ["location", t("location")],
      ["linkedin", t("linkedin")],
      ["website", t("website")],
      ["extra", t("extra")]
    ];

    $("#basics-editor").innerHTML = `
      <div class="photo-tools">
        <div class="avatar-preview">${state.resume.basics.photo ? `<img src="${escapeAttr(state.resume.basics.photo)}" alt="">` : ""}</div>
        <label class="secondary-button">${t("uploadPhoto")}<input id="photo-input" type="file" accept="image/*"></label>
        <button class="ghost-button" id="remove-photo" type="button">${t("remove")}</button>
      </div>
      ${fields.map(([key, label]) => inputField(`basics.${key}`, label, state.resume.basics[key] || "")).join("")}
      ${textareaField("summary", t("summary"), state.resume.summary || "")}
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
    const schemas = getSchemas();
    root.innerHTML = Object.entries(schemas).map(([key, schema]) => renderArraySection(key, schema)).join("") + renderCustomEditor();
    bindFields(root);
    bindSectionButtons(root, schemas);
  }

  function renderArraySection(key, schema) {
    const items = state.resume[key] || [];
    return `<details class="editor-section" open>
      <summary><span>${schema.title}</span><button type="button" class="mini-button" data-add="${key}">${t("add")}</button></summary>
      <div class="items">
        ${items.map((item, index) => renderItem(key, schema, item, index)).join("") || `<p class="empty-note">${t("noItems")}</p>`}
      </div>
    </details>`;
  }

  function renderItem(key, schema, item, index) {
    return `<article class="edit-item">
      <div class="item-toolbar">
        <label><input type="checkbox" data-path="${key}.${index}.hidden" ${item.hidden ? "checked" : ""}> ${t("hidden")}</label>
        <div>
          <button type="button" class="mini-button" data-move="${key}:${index}:-1">${t("moveUp")}</button>
          <button type="button" class="mini-button" data-move="${key}:${index}:1">${t("moveDown")}</button>
          <button type="button" class="mini-button danger-text" data-remove="${key}:${index}">${t("remove")}</button>
        </div>
      </div>
      ${(schema.fields || []).map(([field, label]) => inputField(`${key}.${index}.${field}`, label, item[field] || "")).join("")}
      ${(schema.textarea || []).map(([field, label]) => textareaField(`${key}.${index}.${field}`, label, item[field] || "")).join("")}
      ${schema.list ? listField(key, index, schema.list, item[schema.list] || []) : ""}
    </article>`;
  }

  function listField(key, index, field, values) {
    return `<label class="field"><span>${t("items")}</span>
      <textarea data-path="${key}.${index}.${field}" data-list="true" rows="4">${escapeHtml(values.join("\n"))}</textarea>
    </label>`;
  }

  function renderCustomEditor() {
    const sections = state.resume.customSections || [];
    return `<details class="editor-section">
      <summary><span>${t("customSections")}</span><button type="button" class="mini-button" data-add-custom-section="true">${t("addSection")}</button></summary>
      <div class="items">
        ${sections.map((section, sectionIndex) => `
          <article class="edit-item">
            <div class="item-toolbar">
              <label><input type="checkbox" data-path="customSections.${sectionIndex}.hidden" ${section.hidden ? "checked" : ""}> ${t("hidden")}</label>
              <button type="button" class="mini-button danger-text" data-remove-custom-section="${sectionIndex}">${t("removeSection")}</button>
            </div>
            ${inputField(`customSections.${sectionIndex}.title`, t("sectionTitle"), section.title || "")}
            <button type="button" class="secondary-button small" data-add-custom-item="${sectionIndex}">${t("addItem")}</button>
            ${(section.items || []).map((item, itemIndex) => `
              <div class="nested-item">
                <div class="item-toolbar">
                  <label><input type="checkbox" data-path="customSections.${sectionIndex}.items.${itemIndex}.hidden" ${item.hidden ? "checked" : ""}> ${t("hidden")}</label>
                  <button type="button" class="mini-button danger-text" data-remove-custom-item="${sectionIndex}:${itemIndex}">${t("remove")}</button>
                </div>
                ${inputField(`customSections.${sectionIndex}.items.${itemIndex}.title`, t("title"), item.title || "")}
                ${inputField(`customSections.${sectionIndex}.items.${itemIndex}.subtitle`, t("subtitle"), item.subtitle || "")}
                ${inputField(`customSections.${sectionIndex}.items.${itemIndex}.period`, t("periodLabel"), item.period || "")}
                ${listField(`customSections.${sectionIndex}.items`, itemIndex, "bullets", item.bullets || [])}
              </div>
            `).join("")}
          </article>
        `).join("") || `<p class="empty-note">${t("noCustom")}</p>`}
      </div>
    </details>`;
  }

  function bindSectionButtons(root, schemas) {
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
    $("#preview-title").textContent = title || t("resume");
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
      setStatus(`${t("imported")}: ${file.name}`);
      render();
    } catch (error) {
      setStatus(error.message || t("importFailed"), true);
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
    setStatus(t("buildingPdf"));
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
        const error = await response.json().catch(() => ({ error: t("pdfFailed") }));
        throw new Error(error.error);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name}-${state.templateId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      setStatus(t("pdfReady"));
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
  $("#language-select").addEventListener("change", (event) => {
    settings.language = event.target.value;
    saveSettings();
    render();
  });
  $("#theme-select").addEventListener("change", (event) => {
    settings.theme = event.target.value;
    saveSettings();
    applySettings();
  });
  prefersDark.addEventListener("change", () => {
    if (settings.theme === "system") applySettings();
  });
  $("#page-size").addEventListener("change", (event) => {
    state.pageSize = event.target.value;
    renderPreview();
    saveDraft();
  });

  render();
})();
