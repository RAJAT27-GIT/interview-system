import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "./Footer";
import { RESUME_TEMPLATES } from "../components/resumeTemplates";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  summary: "",
  education: [{ degree: "", institution: "", year: "", gpa: "" }],
  experience: [{ title: "", company: "", duration: "", description: "" }],
  skills: "",
  projects: [{ name: "", description: "", tech: "" }],
  certifications: "",
};

const ResumeBuilder = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState("personal");
  const [selectedTemplate, setSelectedTemplate] = useState(RESUME_TEMPLATES[0]);
  const previewRef = useRef(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field, index, key, value) => {
    setForm((prev) => {
      const arr = [...prev[field]];
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field, template) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], template] }));
  };

  const removeArrayItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const html = selectedTemplate.getHTML(form);
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const tabs = [
    { key: "personal", label: "👤 Personal" },
    { key: "education", label: "🎓 Education" },
    { key: "experience", label: "💼 Experience" },
    { key: "skills", label: "🛠️ Skills" },
    { key: "projects", label: "🚀 Projects" },
  ];

  return (
    <>
      <Navbar />

      <div className="rb-bg min-vh-100 py-5">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-4 mt-4">
            <h1 className="fw-bold display-4 text-gradient-green">Smart Resume Builder</h1>
            <p className="text-secondary lead rb-header-sub" style={{ color: "#64748b" }}>
              Build a professional, ATS-friendly resume in minutes.
              Choose a template, fill your details, and download as PDF.
            </p>
          </div>

          {/* ── Template Selector ── */}
          <div className="template-selector mb-4">
            <h5 className="fw-bold mb-3" style={{ color: "#1e293b" }}>🎨 Choose Template</h5>
            <div className="template-grid">
              {RESUME_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`template-card ${selectedTemplate.id === tpl.id ? "template-card-active" : ""}`}
                  style={{ "--accent": tpl.accent }}
                >
                  <div className="template-card-bar" style={{ background: tpl.accent }} />
                  <div className="template-card-body">
                    <div className="template-card-lines">
                      <div className="tl tl-name" style={{ background: tpl.accent }} />
                      <div className="tl tl-contact" />
                      <div className="tl tl-section" style={{ borderColor: tpl.accent }} />
                      <div className="tl tl-text" />
                      <div className="tl tl-text short" />
                    </div>
                  </div>
                  <div className="template-card-footer">
                    <span className="fw-bold small">{tpl.name}</span>
                    <span className="text-muted" style={{ fontSize: "11px" }}>{tpl.desc}</span>
                  </div>
                  {selectedTemplate.id === tpl.id && (
                    <div className="template-check">✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="row g-4">
            {/* Form Side */}
            <div className="col-lg-6">
              <div className="rb-card hover-shadow">
                {/* Tabs */}
                <div className="rb-tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`rb-tab ${activeTab === tab.key ? "rb-tab-active" : ""}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="rb-card-body">
                  {/* Personal */}
                  {activeTab === "personal" && (
                    <div className="form-section">
                      <Input label="Full Name" value={form.fullName} onChange={(v) => updateField("fullName", v)} placeholder="John Doe" />
                      <Input label="Email" value={form.email} onChange={(v) => updateField("email", v)} placeholder="john@example.com" />
                      <Input label="Phone" value={form.phone} onChange={(v) => updateField("phone", v)} placeholder="+91 9876543210" />
                      <Input label="LinkedIn URL" value={form.linkedin} onChange={(v) => updateField("linkedin", v)} placeholder="linkedin.com/in/johndoe" />
                      <Input label="GitHub URL" value={form.github} onChange={(v) => updateField("github", v)} placeholder="github.com/johndoe" />
                      <div className="mb-3">
                        <label className="form-label text-slate-500 fw-semibold small">Professional Summary</label>
                        <textarea
                          className="form-control form-control-lg"
                          rows={3}
                          value={form.summary}
                          onChange={(e) => updateField("summary", e.target.value)}
                          placeholder="Brief summary of your professional background..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {activeTab === "education" && (
                    <div className="form-section">
                      {form.education.map((edu, i) => (
                        <div key={i} className="array-card mb-4 shadow-sm border">
                          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                            <span className="fw-bold" style={{ color: "#0369a1" }}>Education #{i + 1}</span>
                            {form.education.length > 1 && (
                              <button className="btn btn-sm btn-outline-danger" onClick={() => removeArrayItem("education", i)}>✕ Remove</button>
                            )}
                          </div>
                          <Input label="Degree" value={edu.degree} onChange={(v) => updateArrayField("education", i, "degree", v)} placeholder="B.Tech in Computer Science" />
                          <Input label="Institution" value={edu.institution} onChange={(v) => updateArrayField("education", i, "institution", v)} placeholder="IIT Delhi" />
                          <div className="row">
                            <div className="col-6"><Input label="Year" value={edu.year} onChange={(v) => updateArrayField("education", i, "year", v)} placeholder="2020-2024" /></div>
                            <div className="col-6"><Input label="GPA" value={edu.gpa} onChange={(v) => updateArrayField("education", i, "gpa", v)} placeholder="8.5/10" /></div>
                          </div>
                        </div>
                      ))}
                      <button className="btn btn-outline-primary fw-bold" onClick={() => addArrayItem("education", { degree: "", institution: "", year: "", gpa: "" })}>
                        + Add Education
                      </button>
                    </div>
                  )}

                  {/* Experience */}
                  {activeTab === "experience" && (
                    <div className="form-section">
                      {form.experience.map((exp, i) => (
                        <div key={i} className="array-card mb-4 shadow-sm border">
                          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                            <span className="fw-bold" style={{ color: "#0369a1" }}>Experience #{i + 1}</span>
                            {form.experience.length > 1 && (
                              <button className="btn btn-sm btn-outline-danger" onClick={() => removeArrayItem("experience", i)}>✕ Remove</button>
                            )}
                          </div>
                          <Input label="Job Title" value={exp.title} onChange={(v) => updateArrayField("experience", i, "title", v)} placeholder="Software Engineer" />
                          <Input label="Company" value={exp.company} onChange={(v) => updateArrayField("experience", i, "company", v)} placeholder="Google" />
                          <Input label="Duration" value={exp.duration} onChange={(v) => updateArrayField("experience", i, "duration", v)} placeholder="Jan 2023 - Present" />
                          <div className="mb-3">
                            <label className="form-label text-slate-500 fw-semibold small">Description</label>
                            <textarea
                              className="form-control form-control-lg"
                              rows={2}
                              value={exp.description}
                              onChange={(e) => updateArrayField("experience", i, "description", e.target.value)}
                              placeholder="Key responsibilities and achievements..."
                            />
                          </div>
                        </div>
                      ))}
                      <button className="btn btn-outline-primary fw-bold" onClick={() => addArrayItem("experience", { title: "", company: "", duration: "", description: "" })}>
                        + Add Experience
                      </button>
                    </div>
                  )}

                  {/* Skills */}
                  {activeTab === "skills" && (
                    <div className="form-section">
                      <div className="mb-3">
                        <label className="form-label text-slate-500 fw-semibold small">Skills (comma-separated)</label>
                        <textarea
                          className="form-control form-control-lg"
                          rows={4}
                          value={form.skills}
                          onChange={(e) => updateField("skills", e.target.value)}
                          placeholder="Python, JavaScript, React, Node.js, MongoDB, Docker, AWS..."
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-slate-500 fw-semibold small">Certifications</label>
                        <textarea
                          className="form-control form-control-lg"
                          rows={2}
                          value={form.certifications}
                          onChange={(e) => updateField("certifications", e.target.value)}
                          placeholder="AWS Certified, Google Cloud Associate..."
                        />
                      </div>
                      <div className="d-flex flex-wrap gap-2 mt-3">
                        {form.skills.split(",").map((s) => s.trim()).filter(Boolean).map((s, i) => (
                          <span key={i} className="badge bg-green-100 text-green-800 py-2 px-3 shadow-sm" style={{ backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {activeTab === "projects" && (
                    <div className="form-section">
                      {form.projects.map((proj, i) => (
                        <div key={i} className="array-card mb-4 shadow-sm border">
                          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                            <span className="fw-bold" style={{ color: "#0369a1" }}>Project #{i + 1}</span>
                            {form.projects.length > 1 && (
                              <button className="btn btn-sm btn-outline-danger" onClick={() => removeArrayItem("projects", i)}>✕ Remove</button>
                            )}
                          </div>
                          <Input label="Project Name" value={proj.name} onChange={(v) => updateArrayField("projects", i, "name", v)} placeholder="E-commerce Platform" />
                          <Input label="Technologies" value={proj.tech} onChange={(v) => updateArrayField("projects", i, "tech", v)} placeholder="React, Node.js, MongoDB" />
                          <div className="mb-3">
                            <label className="form-label text-slate-500 fw-semibold small">Description</label>
                            <textarea
                              className="form-control form-control-lg"
                              rows={2}
                              value={proj.description}
                              onChange={(e) => updateArrayField("projects", i, "description", e.target.value)}
                              placeholder="Brief description of the project..."
                            />
                          </div>
                        </div>
                      ))}
                      <button className="btn btn-outline-primary fw-bold" onClick={() => addArrayItem("projects", { name: "", description: "", tech: "" })}>
                        + Add Project
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Live Preview Side */}
            <div className="col-lg-6">
              <div className="rb-card sticky-top shadow-sm" style={{ top: "100px" }}>
                <div className="rb-card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: "#f0fdf4" }}>
                  <div>
                    <h5 className="fw-bold mb-0" style={{ color: "#166534" }}>📋 Live Preview</h5>
                    <span className="small" style={{ color: selectedTemplate.accent }}>Template: {selectedTemplate.name}</span>
                  </div>
                  <button onClick={handlePrint} className="btn btn-sm download-btn fw-bold px-3">
                    📥 Download PDF
                  </button>
                </div>
                <div className="rb-card-body" ref={previewRef} style={{ background: "#e2e8f0", padding: "30px" }}>
                  <div className="resume-preview shadow">
                    {/* Executive template has dark header */}
                    {selectedTemplate.id === "executive" ? (
                      <div style={{ background: "#1e293b", margin: "-40px -40px 20px", padding: "25px 40px 15px", borderRadius: "2px 2px 0 0" }}>
                        <h2 className="preview-name" style={{ color: "#fff" }}>{form.fullName || "Your Name"}</h2>
                        <p style={{ color: "#94a3b8", fontSize: "0.85rem", textAlign: "center", marginBottom: 0 }}>
                          {[form.email, form.phone, form.linkedin, form.github].filter(Boolean).join(" • ") || "your@email.com • +91 XXXXXXXXXX"}
                        </p>
                      </div>
                    ) : selectedTemplate.id === "corporate" ? (
                      <>
                        <div style={{ height: "5px", background: `linear-gradient(90deg, #1e40af, #3b82f6)`, margin: "-40px -40px 20px", borderRadius: "2px 2px 0 0" }} />
                        <h2 className="preview-name" style={{ color: selectedTemplate.previewStyles.nameColor, textAlign: "left" }}>{form.fullName || "Your Name"}</h2>
                        <p className="preview-contact" style={{ color: selectedTemplate.previewStyles.contactColor, textAlign: "left" }}>
                          {[form.email, form.phone, form.linkedin, form.github].filter(Boolean).join(" • ") || "your@email.com • +91 XXXXXXXXXX"}
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="preview-name" style={{ color: selectedTemplate.previewStyles.nameColor }}>{form.fullName || "Your Name"}</h2>
                        {selectedTemplate.id === "tech" && <p style={{ textAlign: "center", fontFamily: "'Courier New', monospace", color: selectedTemplate.accent, fontSize: "0.85rem", marginBottom: "6px" }}>&lt; Software Developer /&gt;</p>}
                        <p className="preview-contact" style={{ color: selectedTemplate.previewStyles.contactColor, borderBottom: selectedTemplate.id === "tech" ? "2px dashed #c4b5fd" : undefined }}>
                          {[form.email, form.phone, form.linkedin, form.github].filter(Boolean).join(" • ") || "your@email.com • +91 XXXXXXXXXX"}
                        </p>
                      </>
                    )}

                    {form.summary && (
                      <>
                        <h4 className="preview-heading" style={{ color: selectedTemplate.previewStyles.headingColor, borderBottom: selectedTemplate.previewStyles.headingBorder, borderLeft: selectedTemplate.id === "corporate" ? `4px solid ${selectedTemplate.accent}` : undefined, paddingLeft: selectedTemplate.id === "corporate" ? "10px" : undefined, borderBottomWidth: selectedTemplate.id === "corporate" ? 0 : undefined }}>
                          Summary
                        </h4>
                        <p className="preview-text" style={{ borderLeft: selectedTemplate.id === "modern" ? "3px solid #10b981" : undefined, paddingLeft: selectedTemplate.id === "modern" ? "12px" : undefined }}>{form.summary}</p>
                      </>
                    )}

                    {form.education.some((e) => e.degree) && (
                      <>
                        <h4 className="preview-heading" style={{ color: selectedTemplate.previewStyles.headingColor, borderBottom: selectedTemplate.previewStyles.headingBorder, borderLeft: selectedTemplate.id === "corporate" ? `4px solid ${selectedTemplate.accent}` : undefined, paddingLeft: selectedTemplate.id === "corporate" ? "10px" : undefined, borderBottomWidth: selectedTemplate.id === "corporate" ? 0 : undefined }}>Education</h4>
                        {form.education.filter((e) => e.degree).map((e, i) => (
                          <div key={i} className="preview-entry">
                            <div className="d-flex justify-content-between">
                              <strong style={{ color: "#0f172a" }}>{e.degree}</strong>
                              <span className="small text-slate-500" style={{ color: "#64748b" }}>{e.year}</span>
                            </div>
                            <p className="mb-0 text-slate-800"><strong>{e.institution}</strong>{e.gpa ? ` — GPA: ${e.gpa}` : ""}</p>
                          </div>
                        ))}
                      </>
                    )}

                    {form.experience.some((e) => e.title) && (
                      <>
                        <h4 className="preview-heading" style={{ color: selectedTemplate.previewStyles.headingColor, borderBottom: selectedTemplate.previewStyles.headingBorder, borderLeft: selectedTemplate.id === "corporate" ? `4px solid ${selectedTemplate.accent}` : undefined, paddingLeft: selectedTemplate.id === "corporate" ? "10px" : undefined, borderBottomWidth: selectedTemplate.id === "corporate" ? 0 : undefined }}>Experience</h4>
                        {form.experience.filter((e) => e.title).map((e, i) => (
                          <div key={i} className="preview-entry">
                            <div className="d-flex justify-content-between">
                              <strong style={{ color: "#0f172a" }}>{e.title}</strong>
                              <span className="small text-slate-500" style={{ color: "#64748b" }}>{e.duration}</span>
                            </div>
                            <p className="mb-1 text-slate-800"><strong>{e.company}</strong></p>
                            {e.description && <p className="preview-text m-0">{e.description}</p>}
                          </div>
                        ))}
                      </>
                    )}

                    {form.projects.some((p) => p.name) && (
                      <>
                        <h4 className="preview-heading" style={{ color: selectedTemplate.previewStyles.headingColor, borderBottom: selectedTemplate.previewStyles.headingBorder, borderLeft: selectedTemplate.id === "corporate" ? `4px solid ${selectedTemplate.accent}` : undefined, paddingLeft: selectedTemplate.id === "corporate" ? "10px" : undefined, borderBottomWidth: selectedTemplate.id === "corporate" ? 0 : undefined }}>Projects</h4>
                        {form.projects.filter((p) => p.name).map((p, i) => (
                          <div key={i} className="preview-entry">
                            <strong style={{ color: "#0f172a" }}>{p.name}</strong>
                            {p.tech && <span className="small ms-2" style={{ color: "#64748b" }}>[{p.tech}]</span>}
                            {p.description && <p className="preview-text mb-0 mt-1">{p.description}</p>}
                          </div>
                        ))}
                      </>
                    )}

                    {form.skills && (
                      <>
                        <h4 className="preview-heading" style={{ color: selectedTemplate.previewStyles.headingColor, borderBottom: selectedTemplate.previewStyles.headingBorder, borderLeft: selectedTemplate.id === "corporate" ? `4px solid ${selectedTemplate.accent}` : undefined, paddingLeft: selectedTemplate.id === "corporate" ? "10px" : undefined, borderBottomWidth: selectedTemplate.id === "corporate" ? 0 : undefined }}>Skills</h4>
                        <div className="d-flex flex-wrap gap-2">
                          {form.skills.split(",").map((s) => s.trim()).filter(Boolean).map((s, i) => (
                            <span key={i} style={{ background: selectedTemplate.previewStyles.skillBg, color: selectedTemplate.previewStyles.skillColor, border: selectedTemplate.previewStyles.skillBorder, padding: "4px 10px", borderRadius: selectedTemplate.id === "modern" ? "20px" : "4px", fontSize: "12px", fontFamily: selectedTemplate.id === "tech" ? "'Courier New', monospace" : undefined }}>{s}</span>
                          ))}
                        </div>
                      </>
                    )}

                    {form.certifications && (
                      <>
                        <h4 className="preview-heading" style={{ color: selectedTemplate.previewStyles.headingColor, borderBottom: selectedTemplate.previewStyles.headingBorder, borderLeft: selectedTemplate.id === "corporate" ? `4px solid ${selectedTemplate.accent}` : undefined, paddingLeft: selectedTemplate.id === "corporate" ? "10px" : undefined, borderBottomWidth: selectedTemplate.id === "corporate" ? 0 : undefined }}>Certifications</h4>
                        <p className="preview-text">{form.certifications}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .rb-bg {
          background-color: #f8fafc;
        }

        .text-gradient-green {
          background: linear-gradient(90deg, #10b981, #0ea5e9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .rb-card {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .rb-card-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .rb-card-body {
          padding: 25px;
        }

        .rb-tabs {
          display: flex;
          overflow-x: auto;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          border-radius: 18px 18px 0 0;
        }

        .rb-tab {
          padding: 16px 20px;
          background: none;
          border: none;
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }

        .rb-tab:hover { color: #1e293b; background: #f1f5f9; }

        .rb-tab-active {
          color: #10b981;
          border-bottom-color: #10b981;
          background: #ffffff;
        }

        .array-card {
          padding: 20px;
          border-radius: 12px;
          background: #f8fafc;
        }

        .download-btn {
          background: linear-gradient(135deg, #10b981, #0ea5e9);
          color: white;
          border: none;
          border-radius: 8px;
        }

        .download-btn:hover {
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          color: white;
          transform: translateY(-2px);
        }

        .resume-preview {
          background: #ffffff;
          border-radius: 2px;
          padding: 40px;
          min-height: 500px;
          color: #1e293b;
          font-family: Arial, sans-serif;
        }

        .preview-name {
          font-size: 1.8rem;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin-bottom: 5px;
        }

        .preview-contact {
          color: #3b82f6;
          font-size: 0.85rem;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #cbd5e1;
          text-align: center;
        }

        .preview-heading {
          font-size: 1rem;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 1px;
          color: #0f172a;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 4px;
          margin: 20px 0 10px;
        }

        .preview-text {
          color: #334155;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .preview-entry {
          margin-bottom: 14px;
        }

        /* ── Template Selector ── */
        .template-selector {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .template-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }

        @media (max-width: 992px) {
          .template-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 576px) {
          .template-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .template-card {
          position: relative;
          background: #fff;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.25s ease;
          text-align: left;
          padding: 0;
        }

        .template-card:hover {
          border-color: var(--accent);
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .template-card-active {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent);
        }

        .template-card-bar {
          height: 5px;
          width: 100%;
        }

        .template-card-body {
          padding: 14px 12px 8px;
        }

        .template-card-lines {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .tl {
          border-radius: 2px;
          height: 6px;
          background: #e2e8f0;
        }

        .tl-name {
          width: 60%;
          height: 8px;
          margin: 0 auto 2px;
        }

        .tl-contact {
          width: 80%;
          height: 4px;
          margin: 0 auto;
          background: #cbd5e1;
        }

        .tl-section {
          width: 40%;
          height: 4px;
          margin-top: 6px;
          border-bottom: 2px solid;
          background: transparent;
        }

        .tl-text {
          width: 90%;
          height: 4px;
        }

        .tl-text.short {
          width: 60%;
        }

        .template-card-footer {
          padding: 8px 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .template-check {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--accent);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }

        /* ── Responsive Header ── */
        .rb-header-sub {
          max-width: 75%;
          margin-left: auto;
          margin-right: auto;
        }

        /* ── Mobile: stack form + preview vertically ── */
        @media (max-width: 992px) {
          .template-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .rb-bg { padding-top: 1.5rem !important; padding-bottom: 1rem !important; }

          .rb-header-sub {
            max-width: 100%;
            font-size: 0.95rem;
          }

          .template-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .template-selector {
            padding: 16px;
          }

          .rb-tabs {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .rb-tab {
            padding: 13px 14px;
            font-size: 0.88rem;
          }

          .rb-card-body {
            padding: 16px;
          }

          /* Preview moves below form on mobile */
          .col-lg-6 {
            width: 100% !important;
          }

          .rb-card.sticky-top {
            position: relative !important;
            top: auto !important;
          }

          .resume-preview {
            padding: 20px;
            min-height: 300px;
          }

          .preview-name {
            font-size: 1.3rem;
          }

          .array-card {
            padding: 14px;
          }

          .display-4 {
            font-size: 1.6rem !important;
          }
        }

        @media (max-width: 480px) {
          .template-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }

          .rb-tab {
            padding: 11px 10px;
            font-size: 0.82rem;
          }

          .download-btn {
            font-size: 0.85rem;
            padding: 6px 12px;
          }
        }
      `}</style>
    </>
  );
};

// Reusable Input component
function Input({ label, value, onChange, placeholder }) {
  return (
    <div className="mb-3">
      <label className="form-label text-slate-500 fw-semibold small" style={{ color: "#64748b" }}>{label}</label>
      <input
        type="text"
        className="form-control form-control-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default ResumeBuilder;
