// ═══════════════════════════════════════════════════════════════
// 5 ATS-Friendly Resume Templates
// Each template has: id, name, accent color, preview styles, and HTML generator
// ═══════════════════════════════════════════════════════════════

// ── Helper: build skills, education, experience, projects HTML ──
const skillsHTML = (skills, tag) =>
  skills.length > 0
    ? `<h2>Skills</h2><div class="skills-list">${skills.map((s) => `<span class="${tag}">${s}</span>`).join("")}</div>`
    : "";

const certHTML = (c) => (c ? `<h2>Certifications</h2><p>${c}</p>` : "");

const eduHTML = (edu) =>
  edu.some((e) => e.degree)
    ? `<h2>Education</h2>${edu
        .filter((e) => e.degree)
        .map(
          (e) => `<div class="entry"><div class="entry-header"><h3>${e.degree}</h3><span class="entry-sub">${e.year}</span></div><p><strong>${e.institution}</strong>${e.gpa ? ` — GPA: ${e.gpa}` : ""}</p></div>`
        )
        .join("")}`
    : "";

const expHTML = (exp) =>
  exp.some((e) => e.title)
    ? `<h2>Experience</h2>${exp
        .filter((e) => e.title)
        .map(
          (e) => `<div class="entry"><div class="entry-header"><h3>${e.title}</h3><span class="entry-sub">${e.duration}</span></div><p><strong>${e.company}</strong></p>${e.description ? `<p class="desc">${e.description}</p>` : ""}</div>`
        )
        .join("")}`
    : "";

const projHTML = (proj) =>
  proj.some((p) => p.name)
    ? `<h2>Projects</h2>${proj
        .filter((p) => p.name)
        .map(
          (p) => `<div class="entry"><h3>${p.name}${p.tech ? ` <span class="entry-sub">[${p.tech}]</span>` : ""}</h3>${p.description ? `<p class="desc">${p.description}</p>` : ""}</div>`
        )
        .join("")}`
    : "";

const summaryHTML = (s) => (s ? `<h2>Summary</h2><p class="summary">${s}</p>` : "");

const contactLine = (form) =>
  [form.email, form.phone, form.linkedin, form.github].filter(Boolean).join(" &bull; ");

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 1 — Classic Professional
// ═══════════════════════════════════════════════════════════════
const classicProfessional = {
  id: "classic",
  name: "Classic Professional",
  desc: "Traditional clean layout with blue accents",
  accent: "#2563eb",
  previewStyles: {
    nameColor: "#1e293b",
    headingColor: "#1e293b",
    headingBorder: "2px solid #2563eb",
    contactColor: "#2563eb",
    skillBg: "#eff6ff",
    skillColor: "#1e40af",
    skillBorder: "1px solid #bfdbfe",
  },
  getHTML: (form) => {
    const skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
    return `<!DOCTYPE html><html><head><title>${form.fullName || "Resume"}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1a1a2e;padding:40px;line-height:1.6}
h1{font-size:28px;color:#1e293b;text-align:center;margin-bottom:4px}
.contact{color:#2563eb;font-size:13px;text-align:center;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #1e293b}
h2{font-size:14px;color:#1e293b;border-bottom:2px solid #2563eb;padding-bottom:4px;margin:18px 0 10px;text-transform:uppercase;letter-spacing:1.5px}
h3{font-size:15px;color:#0f172a;margin-bottom:2px}
p,li{font-size:13px;color:#334155}
.entry{margin-bottom:12px}
.entry-header{display:flex;justify-content:space-between;align-items:baseline}
.entry-sub{color:#64748b;font-size:12px;font-style:italic}
.desc{margin-top:4px;color:#475569}
.summary{color:#334155;font-size:13px;margin-bottom:10px}
.skills-list{display:flex;flex-wrap:wrap;gap:6px}
.skill-tag{background:#eff6ff;color:#1e40af;padding:4px 10px;border-radius:4px;font-size:12px;border:1px solid #bfdbfe}
</style></head><body>
<h1>${form.fullName || "Your Name"}</h1>
<div class="contact">${contactLine(form)}</div>
${summaryHTML(form.summary)}
${eduHTML(form.education)}
${expHTML(form.experience)}
${projHTML(form.projects)}
${skillsHTML(skills, "skill-tag")}
${certHTML(form.certifications)}
</body></html>`;
  },
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 2 — Modern Minimal
// ═══════════════════════════════════════════════════════════════
const modernMinimal = {
  id: "modern",
  name: "Modern Minimal",
  desc: "Clean left-aligned with emerald accents",
  accent: "#059669",
  previewStyles: {
    nameColor: "#064e3b",
    headingColor: "#064e3b",
    headingBorder: "3px solid #10b981",
    contactColor: "#059669",
    skillBg: "#ecfdf5",
    skillColor: "#065f46",
    skillBorder: "1px solid #a7f3d0",
  },
  getHTML: (form) => {
    const skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
    return `<!DOCTYPE html><html><head><title>${form.fullName || "Resume"}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter','Segoe UI',sans-serif;color:#1e293b;padding:40px 50px;line-height:1.65}
h1{font-size:32px;color:#064e3b;margin-bottom:2px;font-weight:800;letter-spacing:-0.5px}
.contact{color:#059669;font-size:13px;margin-bottom:20px;padding-bottom:12px;border-bottom:3px solid #10b981}
h2{font-size:13px;color:#064e3b;border-bottom:3px solid #10b981;padding-bottom:4px;margin:20px 0 10px;text-transform:uppercase;letter-spacing:2px;font-weight:700}
h3{font-size:15px;color:#0f172a;margin-bottom:2px}
p,li{font-size:13px;color:#334155}
.entry{margin-bottom:12px}
.entry-header{display:flex;justify-content:space-between;align-items:baseline}
.entry-sub{color:#64748b;font-size:12px;font-style:italic}
.desc{margin-top:4px;color:#475569}
.summary{color:#475569;font-size:13px;margin-bottom:10px;border-left:3px solid #10b981;padding-left:12px}
.skills-list{display:flex;flex-wrap:wrap;gap:6px}
.skill-tag{background:#ecfdf5;color:#065f46;padding:4px 12px;border-radius:20px;font-size:12px;border:1px solid #a7f3d0}
</style></head><body>
<h1>${form.fullName || "Your Name"}</h1>
<div class="contact">${contactLine(form)}</div>
${summaryHTML(form.summary)}
${eduHTML(form.education)}
${expHTML(form.experience)}
${projHTML(form.projects)}
${skillsHTML(skills, "skill-tag")}
${certHTML(form.certifications)}
</body></html>`;
  },
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 3 — Executive Bold
// ═══════════════════════════════════════════════════════════════
const executiveBold = {
  id: "executive",
  name: "Executive Bold",
  desc: "Strong dark header with warm accents",
  accent: "#dc2626",
  previewStyles: {
    nameColor: "#ffffff",
    nameBg: "#1e293b",
    headingColor: "#1e293b",
    headingBorder: "2px solid #dc2626",
    contactColor: "#94a3b8",
    skillBg: "#fef2f2",
    skillColor: "#991b1b",
    skillBorder: "1px solid #fecaca",
  },
  getHTML: (form) => {
    const skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
    return `<!DOCTYPE html><html><head><title>${form.fullName || "Resume"}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;line-height:1.6}
.header{background:#1e293b;color:#fff;padding:30px 40px 20px;margin-bottom:5px}
.header h1{font-size:30px;font-weight:800;letter-spacing:1px;margin-bottom:4px}
.header .contact{color:#94a3b8;font-size:13px}
.body-content{padding:10px 40px 40px}
h2{font-size:14px;color:#1e293b;border-bottom:2px solid #dc2626;padding-bottom:4px;margin:18px 0 10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700}
h3{font-size:15px;color:#0f172a;margin-bottom:2px}
p,li{font-size:13px;color:#334155}
.entry{margin-bottom:12px}
.entry-header{display:flex;justify-content:space-between;align-items:baseline}
.entry-sub{color:#64748b;font-size:12px;font-style:italic}
.desc{margin-top:4px;color:#475569}
.summary{color:#334155;font-size:13px;margin-bottom:10px}
.skills-list{display:flex;flex-wrap:wrap;gap:6px}
.skill-tag{background:#fef2f2;color:#991b1b;padding:4px 10px;border-radius:4px;font-size:12px;border:1px solid #fecaca}
</style></head><body>
<div class="header">
<h1>${form.fullName || "Your Name"}</h1>
<div class="contact">${contactLine(form)}</div>
</div>
<div class="body-content">
${summaryHTML(form.summary)}
${expHTML(form.experience)}
${eduHTML(form.education)}
${projHTML(form.projects)}
${skillsHTML(skills, "skill-tag")}
${certHTML(form.certifications)}
</div>
</body></html>`;
  },
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 4 — Tech Developer
// ═══════════════════════════════════════════════════════════════
const techDeveloper = {
  id: "tech",
  name: "Tech Developer",
  desc: "Developer-focused with monospace touches",
  accent: "#7c3aed",
  previewStyles: {
    nameColor: "#1e1b4b",
    headingColor: "#1e1b4b",
    headingBorder: "2px solid #7c3aed",
    contactColor: "#7c3aed",
    skillBg: "#f5f3ff",
    skillColor: "#5b21b6",
    skillBorder: "1px solid #ddd6fe",
  },
  getHTML: (form) => {
    const skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
    return `<!DOCTYPE html><html><head><title>${form.fullName || "Resume"}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;padding:40px;line-height:1.6}
h1{font-size:28px;color:#1e1b4b;text-align:center;margin-bottom:2px;font-weight:800}
.tagline{text-align:center;font-family:'Courier New',monospace;color:#7c3aed;font-size:13px;margin-bottom:6px}
.contact{color:#7c3aed;font-size:13px;text-align:center;margin-bottom:14px;padding-bottom:10px;border-bottom:2px dashed #c4b5fd}
h2{font-size:14px;color:#1e1b4b;border-bottom:2px solid #7c3aed;padding-bottom:4px;margin:18px 0 10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700}
h3{font-size:15px;color:#0f172a;margin-bottom:2px}
p,li{font-size:13px;color:#334155}
.entry{margin-bottom:12px}
.entry-header{display:flex;justify-content:space-between;align-items:baseline}
.entry-sub{color:#7c3aed;font-size:12px;font-family:'Courier New',monospace}
.desc{margin-top:4px;color:#475569}
.summary{color:#334155;font-size:13px;margin-bottom:10px}
.skills-list{display:flex;flex-wrap:wrap;gap:6px}
.skill-tag{background:#f5f3ff;color:#5b21b6;padding:4px 10px;border-radius:4px;font-size:12px;border:1px solid #ddd6fe;font-family:'Courier New',monospace}
</style></head><body>
<h1>${form.fullName || "Your Name"}</h1>
<div class="tagline">&lt; Software Developer /&gt;</div>
<div class="contact">${contactLine(form)}</div>
${summaryHTML(form.summary)}
${skillsHTML(skills, "skill-tag")}
${expHTML(form.experience)}
${projHTML(form.projects)}
${eduHTML(form.education)}
${certHTML(form.certifications)}
</body></html>`;
  },
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 5 — Corporate Blue
// ═══════════════════════════════════════════════════════════════
const corporateBlue = {
  id: "corporate",
  name: "Corporate Blue",
  desc: "Professional two-tone with navy accents",
  accent: "#1e40af",
  previewStyles: {
    nameColor: "#1e3a5f",
    headingColor: "#1e3a5f",
    headingBorder: "2px solid #1e40af",
    contactColor: "#1e40af",
    skillBg: "#eff6ff",
    skillColor: "#1e3a5f",
    skillBorder: "1px solid #93c5fd",
  },
  getHTML: (form) => {
    const skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
    return `<!DOCTYPE html><html><head><title>${form.fullName || "Resume"}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;padding:0;line-height:1.6}
.top-bar{height:6px;background:linear-gradient(90deg,#1e40af,#3b82f6)}
.content{padding:30px 40px 40px}
h1{font-size:28px;color:#1e3a5f;margin-bottom:4px;font-weight:800}
.contact-grid{display:flex;flex-wrap:wrap;gap:8px 20px;font-size:13px;color:#1e40af;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #cbd5e1}
h2{font-size:14px;color:#1e3a5f;border-left:4px solid #1e40af;padding-left:10px;margin:18px 0 10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700}
h3{font-size:15px;color:#0f172a;margin-bottom:2px}
p,li{font-size:13px;color:#334155}
.entry{margin-bottom:12px;padding-left:14px}
.entry-header{display:flex;justify-content:space-between;align-items:baseline}
.entry-sub{color:#64748b;font-size:12px;font-style:italic}
.desc{margin-top:4px;color:#475569}
.summary{color:#334155;font-size:13px;margin-bottom:10px;padding-left:14px}
.skills-list{display:flex;flex-wrap:wrap;gap:6px;padding-left:14px}
.skill-tag{background:#eff6ff;color:#1e3a5f;padding:4px 10px;border-radius:4px;font-size:12px;border:1px solid #93c5fd}
</style></head><body>
<div class="top-bar"></div>
<div class="content">
<h1>${form.fullName || "Your Name"}</h1>
<div class="contact-grid">${[form.email, form.phone, form.linkedin, form.github].filter(Boolean).map((c) => `<span>${c}</span>`).join("")}</div>
${summaryHTML(form.summary)}
${expHTML(form.experience)}
${eduHTML(form.education)}
${projHTML(form.projects)}
${skillsHTML(skills, "skill-tag")}
${certHTML(form.certifications)}
</div>
</body></html>`;
  },
};

// ═══════════════════════════════════════════════════════════════
// Export all templates
// ═══════════════════════════════════════════════════════════════
export const RESUME_TEMPLATES = [
  classicProfessional,
  modernMinimal,
  executiveBold,
  techDeveloper,
  corporateBlue,
];

export default RESUME_TEMPLATES;
