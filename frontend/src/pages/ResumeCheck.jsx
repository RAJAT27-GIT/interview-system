import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "./Footer";
import { FaCheckCircle, FaTimesCircle, FaLightbulb, FaUserTie, FaCheck, FaExclamationTriangle } from "react-icons/fa";

const API = "http://https://interview-system-1.onrender.com:8000";

const ResumeCheck = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file first!");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API}/parse_resume`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error parsing resume:", err);
      alert("Error parsing resume. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      alert("Please drop a PDF file.");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // Excellent
    if (score >= 60) return "#fbbf24"; // Good
    return "#ef4444"; // Needs improvement
  };

  return (
    <>
      <Navbar />

      <div className="resume-bg min-vh-100 py-5">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5 mt-4">
            <h1 className="fw-bold display-4 text-gradient-purple">AI ATS Resume Analyzer</h1>
            <p className="text-secondary lead w-75 mx-auto" style={{ color: "#64748b" }}>
              Upload your resume to see your real ATS score. Our AI model analyzes 
              section coverage, keyword density, and formatting.
            </p>
          </div>

          <div className="row justify-content-center g-4">
            {/* Upload Card */}
            <div className="col-md-8 col-lg-5">
              <div className="rc-card shadow-lg border-0">
                <div className="rc-card-header bg-purple-50 py-3">
                  <h5 className="fw-bold mb-0 text-center" style={{ color: "#4c1d95" }}>
                    <FaUserTie className="me-2" /> Upload Your Resume (PDF)
                  </h5>
                </div>
                <div className="rc-card-body p-4">
                  <div
                    className={`drop-zone ${dragOver ? "drop-zone-active" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("resumeInput").click()}
                  >
                    <div className="drop-icon">📄</div>
                    <p className="text-slate-800 mb-1 fw-bold fs-5">
                      {file ? file.name : "Drop PDF here"}
                    </p>
                    <p className="small mb-0 text-muted">
                      {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports standard PDF formats"}
                    </p>
                  </div>

                  <input
                    type="file"
                    id="resumeInput"
                    accept=".pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />

                  <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="btn btn-lg w-100 mt-4 fw-bold analyze-btn shadow-sm py-3"
                  >
                    {loading ? "⏳ Decoding Resume..." : "🔍 Run ATS Analysis"}
                  </button>
                </div>
              </div>
            </div>

            {/* RESULTS DASHBOARD */}
            {result && (
              <div className="col-12 mt-4 animate-fade-in">
                <div className="row g-4">
                  
                  {/* BIG SCORE CARD */}
                  <div className="col-lg-4">
                    <div className="rc-card h-100 shadow-sm text-center">
                      <div className="rc-card-header bg-light">
                        <h5 className="fw-bold mb-0">🎯 Overall Score</h5>
                      </div>
                      <div className="rc-card-body d-flex flex-column align-items-center justify-content-center py-5">
                        <div className="score-ring-container mb-3">
                            <div className="score-ring" style={{ borderColor: getScoreColor(result.ats_score) }}>
                                {result.ats_score}<span>%</span>
                            </div>
                        </div>
                        <h4 className="fw-bold" style={{ color: getScoreColor(result.ats_score) }}>
                            {result.ats_score > 80 ? "Hireable" : result.ats_score > 60 ? "Competitive" : "Action Required"}
                        </h4>
                        <p className="text-muted small mt-2">Based on industry ATS standards</p>
                      </div>
                    </div>
                  </div>

                  {/* RECOMMENDATIONS */}
                  <div className="col-lg-8">
                    <div className="rc-card h-100 shadow-sm">
                      <div className="rc-card-header bg-blue-50">
                        <h5 className="fw-bold mb-0 text-primary">
                            <FaLightbulb className="me-2" /> Key Recommendations
                        </h5>
                      </div>
                      <div className="rc-card-body p-4">
                        {result.recommendations?.length > 0 ? (
                            <div className="list-group list-group-flush">
                                {result.recommendations.map((rec, i) => (
                                    <div key={i} className="list-group-item border-0 px-0 py-3 d-flex align-items-start">
                                        <FaExclamationTriangle className="text-warning mt-1 me-3 flex-shrink-0" />
                                        <span className="fw-medium text-slate-700">{rec}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <FaCheckCircle className="text-success display-4 mb-2" />
                                <h5 className="fw-bold">Your resume looks solid!</h5>
                                <p className="text-muted">No major issues detected by our AI.</p>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION CHECK & CONTACTS */}
                  <div className="col-md-6 col-lg-4">
                    <div className="rc-card h-100 shadow-sm">
                        <div className="rc-card-header bg-slate-50">
                            <h5 className="fw-bold mb-0">📋 Section Checklist</h5>
                        </div>
                        <div className="rc-card-body">
                            {Object.entries(result.sections || {}).map(([name, found]) => (
                                <div key={name} className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="fw-semibold text-slate-600">{name}</span>
                                    {found ? (
                                        <span className="badge bg-success-soft text-success px-3 py-2 rounded-pill">
                                            <FaCheck className="me-1" /> Found
                                        </span>
                                    ) : (
                                        <span className="badge bg-danger-soft text-danger px-3 py-2 rounded-pill">
                                            <FaTimesCircle className="me-1" /> Missing
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>

                  {/* SKILLS CHIPS */}
                  <div className="col-md-6 col-lg-8">
                    <div className="rc-card h-100 shadow-sm">
                        <div className="rc-card-header bg-green-50">
                            <h5 className="fw-bold mb-0 text-success">🛠️ Detected Job Skills</h5>
                        </div>
                        <div className="rc-card-body p-4">
                            <div className="d-flex flex-wrap gap-2">
                                {result.skills?.map((skill, i) => (
                                    <span key={i} className="badge skill-pill">
                                        {skill}
                                    </span>
                                ))}
                                {(!result.skills || result.skills.length === 0) && (
                                    <p className="text-muted">No matching technical skills found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                  </div>

                </div> {/* End Row */}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .resume-bg {
          background-color: #f8fafc;
        }

        .text-gradient-purple {
          background: linear-gradient(90deg, #6d28d9, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .rc-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .rc-card:hover {
            transform: translateY(-5px);
        }

        .rc-card-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .drop-zone {
          border: 2px dashed #cbd5e1;
          border-radius: 16px;
          padding: 50px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fbfcfe;
        }

        .drop-zone:hover, .drop-zone-active {
          border-color: #7c3aed;
          background: #f5f3ff;
        }

        .drop-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .analyze-btn {
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          color: white;
          border: none;
          border-radius: 14px;
          transition: all 0.3s ease;
        }

        .analyze-btn:hover:not(:disabled) {
          box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3);
          color: white;
        }

        .score-ring {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            border: 10px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            font-weight: 800;
            position: relative;
        }

        .score-ring span {
            font-size: 1.2rem;
            margin-top: 10px;
            margin-left: 2px;
        }

        .skill-pill {
            background: #f0fdf4;
            color: #166534;
            border: 1px solid #dcfce7;
            padding: 10px 18px;
            border-radius: 12px;
            font-size: 0.95rem;
            font-weight: 600;
        }

        .bg-success-soft { background-color: #f0fdf4; }
        .bg-danger-soft { background-color: #fef2f2; }
        .bg-blue-50 { background-color: #eff6ff; }
        .bg-slate-50 { background-color: #f8fafc; }
        .bg-purple-50 { background-color: #f5f3ff; }

        .animate-fade-in {
            animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .resume-bg { padding-top: 1.5rem !important; padding-bottom: 1rem !important; }

          .text-gradient-purple {
            font-size: 1.7rem !important;
          }

          .rc-card:hover {
            transform: none;
          }

          .drop-zone {
            padding: 32px 16px;
          }

          .drop-icon {
            font-size: 2.5rem;
            margin-bottom: 12px;
          }

          .score-ring {
            width: 110px;
            height: 110px;
            font-size: 2.2rem;
          }

          .skill-pill {
            padding: 7px 12px;
            font-size: 0.85rem;
          }

          /* Full width columns on mobile */
          .col-lg-4, .col-lg-8, .col-md-6 {
            width: 100% !important;
          }

          .col-md-8 {
            width: 100% !important;
          }

          .rc-card-body.p-4 {
            padding: 14px !important;
          }

          .w-75 {
            width: 100% !important;
          }
        }

        @media (max-width: 480px) {
          .text-gradient-purple {
            font-size: 1.4rem !important;
          }

          .drop-zone {
            padding: 24px 12px;
          }

          .analyze-btn {
            font-size: 0.95rem;
            padding: 12px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ResumeCheck;
