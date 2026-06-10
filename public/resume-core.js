(function () {
  const SECTION_TITLES = {
    experience: "EXPERIENCE",
    education: "EDUCATION",
    projects: "PROJECTS",
    certifications: "COURSES",
    languages: "LANGUAGES",
    interests: "INTERESTS",
    publications: "PUBLICATIONS",
    achievements: "ACHIEVEMENTS",
    skills: "SKILLS"
  };

  const TEMPLATES = [
    { id: "dark-sidebar", name: "Dark Sidebar", pageSize: "A4" },
    { id: "classic-blue-lines", name: "Classic Blue", pageSize: "Letter" },
    { id: "purple-compact", name: "Purple Compact", pageSize: "A4" }
  ];

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const compact = (items) => items.filter(Boolean).join(" · ");
  const uid = () => Math.random().toString(36).slice(2, 10);

  function emptyResume() {
    return {
      basics: {
        firstName: "MOHAMMAD",
        lastName: "AHMADKHANLOO",
        headline: "Researcher | Data Analyst | Behavioral & Cognitive Scientist",
        email: "m.ahmadkhanloo@ipm.ir",
        phone: "+98-936-179-3083",
        location: "Tehran, Iran",
        website: "",
        linkedin: "mohammad-ahmadkhanloo",
        extra: "",
        photo: ""
      },
      summary: "Aspiring to Product Manager with a strong background in cognitive science, data analysis and computational modeling. Proven expertise in brain-data and eye-tracking systems, translating user and behavioral insights into clear MVP definitions, product roadmaps and Agile development cycles.",
      skills: [
        { id: uid(), hidden: false, name: "Technical Skills", keywords: ["Lab & Instrumentation: Eye-tracking, EEG, GSR", "Methodologies: Experimental Design, Computational Modeling"] },
        { id: uid(), hidden: false, name: "Programming Skills", keywords: ["Python", "MATLAB", "R", "Git", "Jupyter", "Linux"] },
        { id: uid(), hidden: false, name: "Professional Skills", keywords: ["Team Leadership", "Project Management", "Technical Documentation"] }
      ],
      experience: [
        { id: uid(), hidden: false, title: "AI Product Manager", organization: "Zharfatech", location: "Tehran", period: "2025 - Present", bullets: ["Led AI products including LLM training, speech-to-text systems, and AI-based database query tools."] }
      ],
      education: [],
      projects: [],
      certifications: [],
      languages: [],
      interests: [],
      publications: [],
      achievements: [],
      customSections: []
    };
  }

  function textFromRich(value) {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value.content === "string") return value.content;
    if (Array.isArray(value)) return value.map(textFromRich).filter(Boolean).join("\n");
    return "";
  }

  function splitName(name = "") {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length <= 1) return { firstName: parts[0] || "", lastName: "" };
    return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
  }

  function itemVisible(item) {
    return !item || item.hidden !== true;
  }

  function normalizeBullets(value) {
    const text = textFromRich(value);
    if (!text) return [];
    return text
      .replace(/<\/?[^>]+>/g, "")
      .split(/\n+|(?:^|\s)[•●]\s*/g)
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean);
  }

  function normalizeRxResume(input) {
    const source = typeof input === "string" ? JSON.parse(input) : input;
    const resume = emptyResume();
    const basics = source.basics || {};
    const name = splitName(basics.name || "");

    resume.basics = {
      firstName: name.firstName || resume.basics.firstName,
      lastName: name.lastName || resume.basics.lastName,
      headline: basics.headline || "",
      email: basics.email || "",
      phone: basics.phone || "",
      location: basics.location || "",
      website: basics.website || "",
      linkedin: "",
      extra: "",
      photo: source.picture?.url || source.picture || basics.picture || ""
    };

    const profiles = source.sections?.profiles?.items || [];
    const linkedIn = profiles.find((profile) => /linkedin/i.test(profile.network || "")) || profiles[0];
    if (linkedIn) resume.basics.linkedin = linkedIn.username || linkedIn.website || "";
    if (Array.isArray(basics.customFields)) {
      resume.basics.extra = basics.customFields.map((field) => field.value || field.name).filter(Boolean).join(" · ");
    }

    resume.summary = textFromRich(source.summary);
    const sections = source.sections || {};

    resume.experience = mapItems(sections.experience, (item) => ({
      id: item.id || uid(),
      hidden: item.hidden === true,
      title: item.position || "",
      organization: item.company || "",
      location: item.location || "",
      period: item.period || "",
      bullets: normalizeBullets(item.description).concat((item.roles || []).map((role) => role.name || role).filter(Boolean))
    }));

    resume.education = mapItems(sections.education, (item) => ({
      id: item.id || uid(),
      hidden: item.hidden === true,
      degree: compact([item.degree, item.area]),
      organization: item.school || "",
      location: item.location || "",
      period: item.period || "",
      description: textFromRich(item.description || item.grade)
    }));

    resume.projects = mapItems(sections.projects, (item) => ({
      id: item.id || uid(),
      hidden: item.hidden === true,
      name: item.name || "",
      period: item.period || "",
      website: item.website || "",
      bullets: normalizeBullets(item.description)
    }));

    resume.skills = mapItems(sections.skills, (item) => ({
      id: item.id || uid(),
      hidden: item.hidden === true,
      name: item.name || "",
      level: item.proficiency || item.level || "",
      keywords: Array.isArray(item.keywords) ? item.keywords : normalizeBullets(item.keywords)
    }));

    resume.languages = mapItems(sections.languages, (item) => ({
      id: item.id || uid(),
      hidden: item.hidden === true,
      language: item.language || "",
      fluency: item.fluency || "",
      level: item.level || ""
    }));

    resume.interests = mapItems(sections.interests, (item) => ({
      id: item.id || uid(),
      hidden: item.hidden === true,
      name: item.name || "",
      keywords: Array.isArray(item.keywords) ? item.keywords : []
    }));

    resume.certifications = mapItems(sections.certifications, (item) => ({
      id: item.id || uid(),
      hidden: item.hidden === true,
      title: item.title || "",
      issuer: item.issuer || "",
      date: item.date || "",
      description: textFromRich(item.description)
    }));

    resume.publications = mapItems(sections.publications, (item) => ({
      id: item.id || uid(),
      hidden: item.hidden === true,
      title: item.title || "",
      publisher: item.publisher || "",
      date: item.date || "",
      description: textFromRich(item.description)
    }));

    resume.customSections = (source.customSections || []).map((section) => ({
      id: section.id || uid(),
      title: section.name || section.title || "Custom Section",
      hidden: section.hidden === true,
      items: (section.items || []).map((item) => ({
        id: item.id || uid(),
        hidden: item.hidden === true,
        title: item.name || item.title || "",
        subtitle: item.subtitle || item.organization || "",
        period: item.period || item.date || "",
        bullets: normalizeBullets(item.description || item.summary)
      }))
    }));

    return resume;
  }

  function mapItems(section, mapper) {
    return ((section && section.items) || []).map(mapper);
  }

  function parseMarkdown(markdown) {
    const resume = emptyResume();
    resume.experience = [];
    resume.education = [];
    resume.projects = [];
    resume.certifications = [];
    resume.languages = [];
    resume.interests = [];
    resume.publications = [];
    resume.achievements = [];
    resume.customSections = [];

    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const titleLine = lines.find((line) => /^#\s+/.test(line));
    if (titleLine) {
      const name = splitName(titleLine.replace(/^#\s+/, ""));
      resume.basics.firstName = name.firstName.toUpperCase();
      resume.basics.lastName = name.lastName.toUpperCase();
    }

    const contactLine = lines.find((line) => line.includes("@") && /·|\|/.test(line));
    if (contactLine) {
      const parts = cleanMd(contactLine).split(/[·|]/).map((part) => part.trim()).filter(Boolean);
      resume.basics.location = parts.find((part) => !part.includes("@") && !/^\+/.test(part) && !/linkedin/i.test(part)) || resume.basics.location;
      resume.basics.email = parts.find((part) => part.includes("@")) || resume.basics.email;
      resume.basics.phone = parts.find((part) => /^\+/.test(part)) || resume.basics.phone;
      const linkedin = parts.find((part) => /linkedin/i.test(part));
      if (linkedin) resume.basics.linkedin = linkedin.replace(/linkedin:/i, "").trim();
    }

    const headlineIndex = lines.findIndex((line) => /^\*\*.*\*\*/.test(line));
    if (headlineIndex > -1) resume.basics.headline = cleanMd(lines[headlineIndex]);

    let section = "";
    let currentItem = null;
    const commit = () => {
      if (!currentItem) return;
      const key = classifySection(section);
      pushParsedItem(resume, key, currentItem);
      currentItem = null;
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line === "---") continue;
      if (/^##\s+/.test(line)) {
        commit();
        section = cleanMd(line.replace(/^##\s+/, ""));
        if (classifySection(section) === "summary") resume.summary = "";
        continue;
      }
      if (/^###\s+/.test(line)) {
        commit();
        currentItem = parseHeadingItem(line.replace(/^###\s+/, ""));
        continue;
      }
      if (!section || /^#\s+/.test(line)) continue;

      const key = classifySection(section);
      if (key === "summary") {
        resume.summary += `${resume.summary ? "\n" : ""}${cleanMd(line)}`;
      } else if (/^[-*]\s+/.test(line)) {
        const bullet = cleanMd(line.replace(/^[-*]\s+/, ""));
        if (currentItem) currentItem.bullets.push(bullet);
        else pushLooseLine(resume, key, bullet, section);
      } else if (/^\*\*.*\*\*/.test(line) && currentItem) {
        currentItem.meta = cleanMd(line);
      } else if (currentItem) {
        currentItem.description = [currentItem.description, cleanMd(line)].filter(Boolean).join(" ");
      }
    }
    commit();
    resume.summary = resume.summary.trim();
    return resume;
  }

  function classifySection(title) {
    const t = title.toLowerCase();
    if (t.includes("summary")) return "summary";
    if (t.includes("experience") || t.includes("professional")) return "experience";
    if (t.includes("education")) return "education";
    if (t.includes("project") || t.includes("product work")) return "projects";
    if (t.includes("skill")) return "skills";
    if (t.includes("language")) return "languages";
    if (t.includes("interest")) return "interests";
    if (t.includes("publication") || t.includes("output")) return "publications";
    if (t.includes("certification") || t.includes("course") || t.includes("training") || t.includes("workshop")) return "certifications";
    if (t.includes("achievement")) return "achievements";
    return "custom";
  }

  function cleanMd(text) {
    return String(text || "")
      .replace(/\*\*/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/<[^>]+>/g, "")
      .trim();
  }

  function parseHeadingItem(text) {
    const parts = cleanMd(text).split(/\s+—\s+|\s+-\s+/);
    return {
      id: uid(),
      hidden: false,
      title: parts.slice(1).join(" - ") || parts[0] || "",
      organization: parts[0] || "",
      period: "",
      location: "",
      bullets: []
    };
  }

  function pushParsedItem(resume, key, item) {
    const meta = parseMeta(item.meta || "");
    if (key === "experience") {
      resume.experience.push({ id: item.id, hidden: false, title: item.title, organization: item.organization, period: meta.period || item.period, location: meta.location || item.location, bullets: item.bullets });
    } else if (key === "education") {
      resume.education.push({ id: item.id, hidden: false, degree: item.title || item.description || "", organization: item.organization, period: meta.period || "", location: meta.location || "", description: item.description || "" });
    } else if (key === "projects") {
      resume.projects.push({ id: item.id, hidden: false, name: item.organization || item.title, period: meta.period || "", website: "", bullets: item.bullets });
    } else if (key === "publications") {
      resume.publications.push({ id: item.id, hidden: false, title: item.organization || item.title, publisher: item.title || "", date: meta.period || "", description: item.bullets.join(" ") || item.description || "" });
    } else {
      addCustom(resume, key, key === "custom" ? "Custom Section" : SECTION_TITLES[key], {
        id: item.id,
        hidden: false,
        title: item.organization || item.title,
        subtitle: item.title || "",
        period: meta.period || "",
        bullets: item.bullets
      });
    }
  }

  function parseMeta(text) {
    const parts = cleanMd(text).split("|").map((part) => part.trim()).filter(Boolean);
    return { period: parts[0] || "", location: parts[1] || "" };
  }

  function pushLooseLine(resume, key, line, title) {
    if (key === "skills") {
      const [name, rest] = line.split(":");
      resume.skills.push({ id: uid(), hidden: false, name: name.trim(), keywords: rest ? rest.split(",").map((x) => x.trim()).filter(Boolean) : [line] });
    } else if (key === "languages") {
      cleanMd(line).split(/[·|,]/).map((x) => x.trim()).filter(Boolean).forEach((language) => {
        const [name, fluency] = language.split(":");
        resume.languages.push({ id: uid(), hidden: false, language: name.trim(), fluency: (fluency || "").trim(), level: "" });
      });
    } else if (key === "interests") {
      cleanMd(line).split(/[·|,]/).map((x) => x.trim()).filter(Boolean).forEach((name) => {
        resume.interests.push({ id: uid(), hidden: false, name, keywords: [] });
      });
    } else if (key === "certifications") {
      const [certTitle, issuerDate] = line.split("—");
      resume.certifications.push({ id: uid(), hidden: false, title: certTitle.trim(), issuer: (issuerDate || "").trim(), date: "", description: "" });
    } else {
      addCustom(resume, key, title, { id: uid(), hidden: false, title: line, subtitle: "", period: "", bullets: [] });
    }
  }

  function addCustom(resume, key, title, item) {
    const sectionTitle = title || SECTION_TITLES[key] || "Custom Section";
    let section = resume.customSections.find((entry) => entry.title === sectionTitle);
    if (!section) {
      section = { id: uid(), hidden: false, title: sectionTitle, items: [] };
      resume.customSections.push(section);
    }
    section.items.push(item);
  }

  function resumeToMarkdown(resume) {
    const r = normalizeResume(resume);
    const parts = [
      `# ${compact([r.basics.firstName, r.basics.lastName])}`,
      "",
      `**${r.basics.headline || ""}**`,
      compact([r.basics.location, r.basics.email, r.basics.phone, r.basics.linkedin && `LinkedIn: ${r.basics.linkedin}`]),
      "",
      "## Summary",
      r.summary || ""
    ];
    markdownItems(parts, "Professional Experience", r.experience, (item) => `${item.organization} — ${item.title}`, (item) => compact([item.period, item.location]), (item) => item.bullets);
    markdownItems(parts, "Selected Projects", r.projects, (item) => item.name, (item) => item.period, (item) => item.bullets);
    markdownItems(parts, "Education", r.education, (item) => item.organization, (item) => compact([item.degree, item.period, item.location]), (item) => item.description ? [item.description] : []);
    markdownItems(parts, "Certifications & Courses", r.certifications, (item) => item.title, (item) => compact([item.issuer, item.date]), (item) => item.description ? [item.description] : []);
    parts.push("", "## Core Skills", ...r.skills.filter(itemVisible).map((item) => `- **${item.name}:** ${(item.keywords || []).join(", ")}`));
    parts.push("", "## Languages", `- ${r.languages.filter(itemVisible).map((item) => compact([item.language, item.fluency])).join(" · ")}`);
    return parts.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  }

  function markdownItems(parts, title, items, heading, meta, bullets) {
    const visible = (items || []).filter(itemVisible);
    if (!visible.length) return;
    parts.push("", `## ${title}`);
    visible.forEach((item) => {
      parts.push("", `### ${heading(item)}`);
      const metaText = meta(item);
      if (metaText) parts.push(`**${metaText}**`);
      (bullets(item) || []).forEach((bullet) => parts.push(`- ${bullet}`));
    });
  }

  function normalizeResume(resume) {
    const base = emptyResume();
    return Object.assign(base, clone(resume || {}), {
      basics: Object.assign(base.basics, (resume && resume.basics) || {})
    });
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

  function renderResume(resume, templateId = "dark-sidebar", options = {}) {
    const r = normalizeResume(resume);
    const id = TEMPLATES.some((template) => template.id === templateId) ? templateId : "dark-sidebar";
    if (id === "classic-blue-lines") return renderClassic(r, options);
    if (id === "purple-compact") return renderPurple(r, options);
    return renderDark(r, options);
  }

  function renderDark(r) {
    return `<article class="resume resume-dark">
      <aside class="resume-side">
        ${renderIdentity(r, "side")}
        ${renderContact(r)}
        ${renderTextSection("SUMMARY", r.summary)}
        ${renderSkills(r.skills, true)}
        ${renderPills("INTERESTS", r.interests.map((item) => item.name))}
        ${renderPills("LANGUAGES", r.languages.map((item) => item.language))}
      </aside>
      <section class="resume-main">
        ${renderTimeline("EXPERIENCE", r.experience, "briefcase")}
        ${renderEducation(r.education)}
        ${renderCertifications(r.certifications)}
        ${renderProjects(r.projects)}
        ${renderPublications(r.publications)}
        ${renderCustomSections(r.customSections)}
      </section>
    </article>`;
  }

  function renderClassic(r) {
    return `<article class="resume resume-classic">
      <header class="classic-head">
        <div>${renderName(r)}<p>${escapeHtml(r.basics.headline)}</p>${renderInlineContact(r)}</div>
        ${renderPhoto(r)}
      </header>
      <div class="classic-grid">
        <section>
          ${renderTimeline("EXPERIENCE", r.experience)}
          ${renderEducation(r.education)}
          ${renderCertifications(r.certifications)}
          ${renderProjects(r.projects)}
        </section>
        <aside>
          ${renderTextSection("SUMMARY", r.summary)}
          ${renderSkills(r.skills, false)}
          ${renderLanguagesWithDots(r.languages)}
          ${renderPills("ACHIEVEMENTS", r.achievements.map((item) => item.title || item.name))}
          ${renderPills("INTERESTS", r.interests.map((item) => item.name))}
          ${renderPublications(r.publications)}
        </aside>
      </div>
    </article>`;
  }

  function renderPurple(r) {
    return `<article class="resume resume-purple">
      <div class="purple-grid">
        <aside class="purple-left">
          ${renderIdentity(r, "purple")}
          ${renderContact(r)}
          ${renderTextSection("SUMMARY", r.summary)}
          ${renderSkills(r.skills, true)}
        </aside>
        <section class="purple-right">
          ${renderTimeline("EXPERIENCE", r.experience, "briefcase")}
          ${renderEducation(r.education)}
          ${renderCertifications(r.certifications)}
          ${renderLanguagesInline(r.languages)}
          ${renderPills("INTERESTS", r.interests.map((item) => item.name))}
          ${renderProjects(r.projects)}
          ${renderPublications(r.publications)}
        </section>
      </div>
    </article>`;
  }

  function renderName(r) {
    return `<h1><span>${escapeHtml(r.basics.firstName)}</span><span>${escapeHtml(r.basics.lastName)}</span></h1>`;
  }

  function renderIdentity(r) {
    return `<div class="identity">${renderName(r)}<p>${escapeHtml(r.basics.headline)}</p>${renderPhoto(r)}</div>`;
  }

  function renderPhoto(r) {
    if (!r.basics.photo) return `<div class="photo placeholder"></div>`;
    return `<img class="photo" src="${escapeHtml(r.basics.photo)}" alt="">`;
  }

  function renderInlineContact(r) {
    return `<p class="inline-contact">${[r.basics.phone, r.basics.email, r.basics.linkedin, r.basics.location].filter(Boolean).map(escapeHtml).join(" · ")}</p>`;
  }

  function renderContact(r) {
    const fields = [
      ["mail", r.basics.email],
      ["pin", r.basics.location],
      ["phone", r.basics.phone],
      ["in", r.basics.linkedin],
      ["info", r.basics.extra]
    ].filter((entry) => entry[1]);
    return `<div class="contact">${fields.map(([icon, value]) => `<span><b>${escapeHtml(icon)}</b>${escapeHtml(value)}</span>`).join("")}</div>`;
  }

  function renderTextSection(title, text) {
    if (!text) return "";
    return `<section class="resume-section"><h2>${escapeHtml(title)}</h2><p class="summary-text">${escapeHtml(text)}</p></section>`;
  }

  function renderSkills(skills, bullets) {
    const visible = (skills || []).filter(itemVisible);
    if (!visible.length) return "";
    return `<section class="resume-section skills"><h2>SKILLS</h2>${visible.map((skill) => `
      <div class="skill-group">
        <h3>${escapeHtml(skill.name)}</h3>
        ${bullets ? `<ul>${(skill.keywords || []).map((kw) => `<li>${escapeHtml(kw)}</li>`).join("")}</ul>` : `<p>${(skill.keywords || []).map((kw) => `<span>${escapeHtml(kw)}</span>`).join("")}</p>`}
      </div>`).join("")}</section>`;
  }

  function renderTimeline(title, items) {
    const visible = (items || []).filter(itemVisible);
    if (!visible.length) return "";
    return `<section class="resume-section timeline"><h2>${escapeHtml(title)}</h2>${visible.map((item) => `
      <div class="entry">
        <h3>${escapeHtml(item.organization || item.name || item.title)}</h3>
        <p class="entry-role">${escapeHtml(item.title || "")}</p>
        <p class="entry-meta">${escapeHtml(compact([item.period, item.location]))}</p>
        ${renderBullets(item.bullets)}
      </div>`).join("")}</section>`;
  }

  function renderEducation(items) {
    const visible = (items || []).filter(itemVisible);
    if (!visible.length) return "";
    return `<section class="resume-section"><h2>EDUCATION</h2>${visible.map((item) => `
      <div class="entry compact-entry">
        <h3>${escapeHtml(item.degree || item.organization)}</h3>
        <p>${escapeHtml(item.organization || "")}</p>
        <p class="entry-meta">${escapeHtml(compact([item.period, item.location]))}</p>
        ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
      </div>`).join("")}</section>`;
  }

  function renderCertifications(items) {
    const visible = (items || []).filter(itemVisible);
    if (!visible.length) return "";
    return `<section class="resume-section"><h2>COURSES</h2>${visible.map((item) => `
      <div class="entry compact-entry">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(compact([item.issuer, item.date]))}</p>
        ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
      </div>`).join("")}</section>`;
  }

  function renderProjects(items) {
    const visible = (items || []).filter(itemVisible);
    if (!visible.length) return "";
    return `<section class="resume-section"><h2>PROJECTS</h2>${visible.map((item) => `
      <div class="entry compact-entry">
        <h3>${escapeHtml(item.name)}</h3>
        <p class="entry-meta">${escapeHtml(compact([item.period, item.website]))}</p>
        ${renderBullets(item.bullets)}
      </div>`).join("")}</section>`;
  }

  function renderPublications(items) {
    const visible = (items || []).filter(itemVisible);
    if (!visible.length) return "";
    return `<section class="resume-section"><h2>PUBLICATIONS</h2>${visible.map((item) => `
      <div class="entry compact-entry">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(compact([item.publisher, item.date]))}</p>
        ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
      </div>`).join("")}</section>`;
  }

  function renderCustomSections(sections) {
    return (sections || []).filter(itemVisible).map((section) => `
      <section class="resume-section"><h2>${escapeHtml(section.title)}</h2>${(section.items || []).filter(itemVisible).map((item) => `
        <div class="entry compact-entry"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(compact([item.subtitle, item.period]))}</p>${renderBullets(item.bullets)}</div>
      `).join("")}</section>`).join("");
  }

  function renderBullets(bullets = []) {
    const visible = bullets.filter(Boolean);
    if (!visible.length) return "";
    return `<ul>${visible.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>`;
  }

  function renderPills(title, items) {
    const visible = items.filter(Boolean);
    if (!visible.length) return "";
    return `<section class="resume-section pills"><h2>${escapeHtml(title)}</h2><p>${visible.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</p></section>`;
  }

  function renderLanguagesInline(items) {
    const visible = (items || []).filter(itemVisible).map((item) => item.language);
    return renderPills("LANGUAGES", visible);
  }

  function renderLanguagesWithDots(items) {
    const visible = (items || []).filter(itemVisible);
    if (!visible.length) return "";
    return `<section class="resume-section language-dots"><h2>LANGUAGES</h2>${visible.map((item) => `<p><span>${escapeHtml(item.language)}</span><b>${"●".repeat(Math.max(1, Math.min(5, Number(item.level) || 4)))}<i>${"●".repeat(5 - Math.max(1, Math.min(5, Number(item.level) || 4)))}</i></b></p>`).join("")}</section>`;
  }

  window.CVLite = {
    TEMPLATES,
    SECTION_TITLES,
    emptyResume,
    normalizeResume,
    normalizeRxResume,
    parseMarkdown,
    resumeToMarkdown,
    renderResume
  };
})();
