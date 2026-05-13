import React, { useState, useCallback, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "./Footer";
import InterviewFlow from "../components/InterviewFlow";
import CodeEditor from "../components/CodeEditor";
import TabProctorModal from "../components/TabProctorModal";
import { useAuth } from "../context/AuthContext";
import {
  FaFileUpload, FaPlay, FaCheckCircle, FaChartPie,
  FaGraduationCap, FaCode, FaComments, FaArrowRight,
  FaBrain, FaPencilAlt, FaProjectDiagram, FaShieldAlt,
  FaExclamationTriangle
} from "react-icons/fa";

const API = "http://localhost:8000";
const MAX_VIOLATIONS = 3;

const ROUND_ICONS = {
  technical: <FaGraduationCap />,
  coding: <FaCode />,
  hr: <FaComments />,
  aptitude: <FaBrain />,
  system_design: <FaProjectDiagram />,
  dsa: <FaPencilAlt />,
};

const Interview = () => {
  const { user } = useAuth();
  // ─── Phase State ───
  const [step, setStep] = useState("setup"); // 'setup' | 'active' | 'results'

  // ─── Setup State ───
  const [userName, setUserName] = useState(user?.name || "");
  const [resumeFile, setResumeFile] = useState(null);
  const [difficulty, setDifficulty] = useState("tier2");
  const [loading, setLoading] = useState(false);

  // ─── Interview Session State ───
  const [session, setSession] = useState(null);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [allResults, setAllResults] = useState([]);

  // ─── Tab Proctoring State ───
  const [violations, setViolations] = useState(0);
  const [showProctorModal, setShowProctorModal] = useState(false);
  const [terminated, setTerminated] = useState(false);
  const violationsRef = useRef(0);

  // ─── Navigation ───
  const currentRound = session?.rounds?.[currentRoundIdx];
  const currentQuestion = currentRound?.questions?.[currentQuestionIdx];
  const isCodingRound = currentRound?.type === "coding" || currentQuestion?.type === "coding";

  // ─── Tab Switch Detection ───
  useEffect(() => {
    if (step !== "active" || terminated) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        violationsRef.current += 1;
        setViolations(violationsRef.current);
        setShowProctorModal(true);

        if (violationsRef.current >= MAX_VIOLATIONS) {
          setTerminated(true);
        }
      }
    };

    const handleBlur = () => {
      // Also detect window blur (alt-tab etc.)
      if (step === "active" && !terminated) {
        violationsRef.current += 1;
        setViolations(violationsRef.current);
        setShowProctorModal(true);

        if (violationsRef.current >= MAX_VIOLATIONS) {
          setTerminated(true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    // Note: we only use visibilitychange to avoid double-counting
    // window blur fires too aggressively in some environments

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [step, terminated]);

  // ─── Auto-terminate: go to results ───
  useEffect(() => {
    if (terminated && step === "active") {
      // Small delay so modal shows first
      const timer = setTimeout(() => {
        setStep("results");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [terminated, step]);

  // ─── Save Results to Backend ───
  useEffect(() => {
    if (step === "results") {
      const finalScore = allResults.length > 0
        ? Math.round(allResults.reduce((acc, r) => acc + (r.evaluation?.final_score || 0), 0) / allResults.length)
        : 0;
        
      const token = localStorage.getItem('token');
      if (token) {
        fetch(`${API}/submit_interview`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            score: finalScore,
            auto_submitted: terminated,
            violations: violationsRef.current
          })
        }).catch(err => console.error("Failed to submit results", err));
      }
    }
  }, [step, allResults, terminated]);

  const handleDismissProctor = () => {
    setShowProctorModal(false);
    if (terminated) {
      setStep("results");
    }
  };

  // ─── Start Interview ───
  const handleStartInterview = async () => {
    if (!userName.trim()) return alert("Please enter your name!");
    if (!resumeFile) return alert("Please upload your resume!");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("user_name", userName);
      formData.append("difficulty", difficulty);
      formData.append("file", resumeFile);

      const res = await fetch(`${API}/start_interview`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setSession(data.session);
      setViolations(0);
      violationsRef.current = 0;
      setTerminated(false);
      setStep("active");
    } catch (err) {
      console.error("Error starting interview:", err);
      alert("Failed to connect to backend. Make sure the server is running!");
    } finally {
      setLoading(false);
    }
  };

  // ─── Question Done Handler ───
  const handleQuestionDone = (data) => {
    const resultEntry = {
      ...data,
      roundName: currentRound.name,
      roundType: currentRound.type || "theory",
      questionText: currentQuestion.text,
    };

    setAllResults((prev) => [...prev, resultEntry]);

    if (currentQuestionIdx < currentRound.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else if (currentRoundIdx < session.rounds.length - 1) {
      setCurrentRoundIdx((prev) => prev + 1);
      setCurrentQuestionIdx(0);
    } else {
      setStep("results");
    }
  };

  // ─── Calculate Aggregates ───
  const getRoundAverages = () => {
    const rounds = {};
    allResults.forEach((r) => {
      if (!rounds[r.roundName]) rounds[r.roundName] = { score: 0, count: 0, type: r.roundType };
      rounds[r.roundName].score += r.evaluation?.final_score || 0;
      rounds[r.roundName].count += 1;
    });
    return Object.keys(rounds).map((name) => ({
      name,
      type: rounds[name].type,
      avg: Math.round(rounds[name].score / rounds[name].count),
    }));
  };

  const totalAvg =
    allResults.length > 0
      ? Math.round(allResults.reduce((acc, r) => acc + (r.evaluation?.final_score || 0), 0) / allResults.length)
      : 0;

  const totalRounds = session?.rounds?.length || 3;
  const diffLabel = { tier1: "Hard", tier2: "Medium", tier3: "Easy" };

  return (
    <>
      <Navbar />

      <div className="interview-bg min-vh-100 py-5">
        <div className="container mt-4">

          {/* ──── PHASE 1: SETUP ──── */}
          {step === "setup" && (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="text-center mb-5">
                  <h1 className="fw-bold display-4 text-slate-900 border-bottom-pulse mb-3">
                    AI Multi-Round Interview
                  </h1>
                  <p className="lead text-secondary">
                    Upload your resume and let our AI create a custom hiring process just for you.
                  </p>
                  {/* Round info cards */}
                  <div className="round-info-row">
                    <div className="round-info-card easy-card">
                      <span className="ri-level">Easy</span>
                      <span className="ri-rounds">3 Rounds</span>
                    </div>
                    <div className="round-info-card medium-card">
                      <span className="ri-level">Medium</span>
                      <span className="ri-rounds">4 Rounds</span>
                    </div>
                    <div className="round-info-card hard-card">
                      <span className="ri-level">Hard</span>
                      <span className="ri-rounds">5 Rounds</span>
                    </div>
                  </div>
                </div>

                <div className="ui-card shadow-lg p-5">
                  <div className="row g-4">
                    <div className="col-md-6 border-end-sm">
                      <h5 className="fw-bold mb-3">
                        <span className="step-num">1</span> Your Identity
                      </h5>
                      <input
                        type="text"
                        className="form-control form-control-lg mb-4"
                        placeholder="Enter your full name..."
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />

                      <h5 className="fw-bold mb-3">
                        <span className="step-num">2</span> Select Difficulty
                      </h5>
                      <div className="btn-group w-100 mb-3" role="group">
                        <input type="radio" className="btn-check" name="diff" id="d1" checked={difficulty === "tier3"} onChange={() => setDifficulty("tier3")} />
                        <label className="btn btn-outline-success py-2" htmlFor="d1">🟢 Easy (3R)</label>

                        <input type="radio" className="btn-check" name="diff" id="d2" checked={difficulty === "tier2"} onChange={() => setDifficulty("tier2")} />
                        <label className="btn btn-outline-primary py-2" htmlFor="d2">🟡 Medium (4R)</label>

                        <input type="radio" className="btn-check" name="diff" id="d3" checked={difficulty === "tier1"} onChange={() => setDifficulty("tier1")} />
                        <label className="btn btn-outline-danger py-2" htmlFor="d3">🔴 Hard (5R)</label>
                      </div>

                      {/* Proctoring notice */}
                      <div className="proctor-notice">
                        <FaShieldAlt className="me-2" />
                        <span>Tab-switch proctoring enabled. Switching tabs 3+ times will auto-terminate your interview.</span>
                      </div>
                    </div>

                    <div className="col-md-6 ps-md-4">
                      <h5 className="fw-bold mb-3">
                        <span className="step-num">3</span> Resume Context
                      </h5>
                      <div
                        className="resume-dropzone text-center p-4 border-dashed rounded mb-4"
                        onClick={() => document.getElementById("resInput").click()}
                      >
                        <FaFileUpload className="display-4 text-primary mb-2" />
                        <p className="mb-0 fw-medium">
                          {resumeFile ? resumeFile.name : "Click or Drop Resume (PDF)"}
                        </p>
                        <input
                          id="resInput"
                          type="file"
                          accept=".pdf"
                          className="d-none"
                          onChange={(e) => setResumeFile(e.target.files[0])}
                        />
                      </div>

                      <button
                        className="btn btn-primary btn-lg w-100 py-3 fw-bold shadow-sm"
                        onClick={handleStartInterview}
                        disabled={loading}
                      >
                        {loading ? "⏳ Preparing AI Rounds..." : "🚀 Launch Interview"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──── PHASE 2: ACTIVE INTERVIEW ──── */}
          {step === "active" && session && (
            <div className="row justify-content-center">
              <div className="col-lg-10">
                {/* Proctoring Status Bar */}
                <div className="proctor-bar">
                  <div className="proctor-bar-left">
                    <FaShieldAlt />
                    <span>Proctoring Active</span>
                  </div>
                  <div className="proctor-bar-right">
                    <span className={`violation-badge ${violations > 0 ? (violations >= 2 ? "critical" : "warn") : ""}`}>
                      <FaExclamationTriangle className="me-1" />
                      {violations}/{MAX_VIOLATIONS} Violations
                    </span>
                  </div>
                </div>

                {/* Round Tracker */}
                <div className="round-tracker">
                  {session.rounds.map((r, idx) => (
                    <div key={r.id} className={`round-tab ${idx === currentRoundIdx ? "active" : idx < currentRoundIdx ? "done" : ""}`}>
                      <div className="round-icon">
                        {ROUND_ICONS[r.icon] || ROUND_ICONS[r.type] || <FaGraduationCap />}
                      </div>
                      <span className="d-none d-md-block ms-2 round-tab-label">{r.name}</span>
                    </div>
                  ))}
                </div>

                <div className="ui-card shadow-sm p-0 overflow-hidden">
                  <div className="active-round-header">
                    <div>
                      <h5 className="mb-0 fw-bold">{currentRound.name}</h5>
                      <small className="opacity-75">
                        Round {currentRoundIdx + 1} of {totalRounds} • {diffLabel[difficulty]} Level
                        {isCodingRound && " • 💻 Coding Round"}
                      </small>
                    </div>
                    <span className="badge bg-white text-primary fs-6">
                      Q{currentQuestionIdx + 1}/{currentRound.questions.length}
                    </span>
                  </div>

                  <div className="p-4 p-md-5">
                    {isCodingRound ? (
                      <CodeEditor
                        key={`code-${currentRoundIdx}-${currentQuestionIdx}`}
                        question={currentQuestion}
                        userName={userName}
                        onComplete={handleQuestionDone}
                      />
                    ) : (
                      <InterviewFlow
                        key={`flow-${currentRoundIdx}-${currentQuestionIdx}`}
                        question={currentQuestion}
                        userName={userName}
                        onComplete={handleQuestionDone}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──── PHASE 3: RESULTS ──── */}
          {step === "results" && (
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="text-center mb-5">
                  <h1 className="fw-bold display-4">
                    {terminated ? "Interview Terminated" : "Full Performance Report"}
                  </h1>
                  {terminated && (
                    <div className="badge bg-danger fs-6 mt-2 py-2 px-4 mb-2">
                      🛑 Terminated — Tab Switch Violations ({violations}/{MAX_VIOLATIONS})
                    </div>
                  )}
                  <div className={`badge fs-5 mt-2 py-2 px-4 ${totalAvg > 70 ? "bg-success" : totalAvg > 40 ? "bg-warning" : "bg-danger"}`}>
                    Overall Score: {totalAvg}%
                  </div>
                </div>

                <div className="row g-4">
                  {/* Round Summary */}
                  <div className="col-md-5">
                    <div className="ui-card h-100 p-4">
                      <h5 className="fw-bold mb-4 border-bottom pb-2">Round Summary</h5>
                      {getRoundAverages().map((r, i) => (
                        <div key={i} className="mb-4">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-bold">
                              {r.type === "coding" ? "💻 " : ""}{r.name}
                            </span>
                            <span className="fw-bold">{r.avg}%</span>
                          </div>
                          <div className="progress" style={{ height: "10px" }}>
                            <div
                              className={`progress-bar ${r.avg > 70 ? "bg-success" : r.avg > 40 ? "bg-warning" : "bg-danger"}`}
                              style={{ width: `${r.avg}%` }}
                            />
                          </div>
                        </div>
                      ))}

                      {terminated && (
                        <div className="mt-3 p-3 bg-light rounded border border-danger">
                          <p className="mb-0 text-danger fw-bold small">
                            ⚠️ Interview was terminated due to {violations} tab switch violations.
                            Remaining rounds were not completed.
                          </p>
                        </div>
                      )}

                      {violations > 0 && !terminated && (
                        <div className="mt-3 p-3 bg-light rounded border border-warning">
                          <p className="mb-0 text-warning fw-bold small">
                            ⚠️ {violations} tab switch violation(s) detected during interview.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="col-md-7">
                    <div className="ui-card p-4">
                      <h5 className="fw-bold mb-4 border-bottom pb-2">Detailed Breakdown</h5>
                      <div className="result-scroll">
                        {allResults.map((res, i) => (
                          <div key={i} className="mb-3 p-3 rounded bg-light border-start border-4 border-primary">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              {res.roundType === "coding" && <span className="badge bg-dark">💻 Code</span>}
                              <p className="mb-0 fw-bold text-dark">{res.questionText}</p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <span className="small text-secondary">{res.roundName}</span>
                              <span className="badge bg-white text-dark border shadow-sm">
                                Score: {res.evaluation?.final_score}
                              </span>
                            </div>
                            <p className="small mt-2 mb-0 italic" style={{ color: "#64748b" }}>
                              "{res.feedback}"
                            </p>
                          </div>
                        ))}
                        {allResults.length === 0 && (
                          <p className="text-center text-secondary">No answers were submitted before termination.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-5">
                  <button
                    className="btn btn-lg btn-outline-primary px-5 py-3 fw-bold"
                    onClick={() => window.location.reload()}
                  >
                    🔄 Take Another Interview
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab Proctor Modal */}
      <TabProctorModal
        violations={violations}
        maxViolations={MAX_VIOLATIONS}
        visible={showProctorModal}
        onDismiss={handleDismissProctor}
      />

      <Footer />

      <style>{`
        .interview-bg { background-color: #f8fafc; }
        .ui-card { background: #fff; border-radius: 20px; border: 1px solid #e2e8f0; }
        .step-num {
          display: inline-block; width: 28px; height: 28px; background: #3b82f6;
          color: #fff; border-radius: 50%; text-align: center; line-height: 28px;
          font-size: 0.9rem; margin-right: 8px;
        }
        .resume-dropzone {
          cursor: pointer; border: 2px dashed #cbd5e1;
          transition: all 0.3s; background: #fdfdfd;
        }
        .resume-dropzone:hover { border-color: #3b82f6; background: #f0f7ff; }

        /* Round Info Cards */
        .round-info-row {
          display: flex; justify-content: center; gap: 12px;
          margin-top: 20px; flex-wrap: wrap;
        }
        .round-info-card {
          padding: 10px 20px; border-radius: 12px;
          display: flex; flex-direction: column; align-items: center;
          border: 2px solid; font-weight: 700;
        }
        .easy-card { border-color: #22c55e; background: #f0fdf4; color: #166534; }
        .medium-card { border-color: #3b82f6; background: #eff6ff; color: #1e40af; }
        .hard-card { border-color: #ef4444; background: #fef2f2; color: #991b1b; }
        .ri-level { font-size: 0.85rem; }
        .ri-rounds { font-size: 1.1rem; }

        /* Proctor Notice */
        .proctor-notice {
          background: #fef3c7; border: 1px solid #fbbf24;
          border-radius: 10px; padding: 10px 14px;
          font-size: 0.8rem; color: #92400e;
          display: flex; align-items: flex-start; gap: 8px; margin-top: 12px;
        }

        /* Proctor Status Bar */
        .proctor-bar {
          display: flex; justify-content: space-between; align-items: center;
          background: #1e293b; color: #e2e8f0; padding: 10px 16px;
          border-radius: 12px; margin-bottom: 16px; font-size: 0.85rem;
          flex-wrap: wrap; gap: 8px;
        }
        .proctor-bar-left {
          display: flex; align-items: center; gap: 8px; font-weight: 600;
          color: #22c55e;
        }
        .violation-badge {
          background: #334155; padding: 4px 14px; border-radius: 20px;
          font-weight: 600; font-size: 0.8rem;
          display: flex; align-items: center;
        }
        .violation-badge.warn { background: #f59e0b; color: #1e293b; }
        .violation-badge.critical { background: #ef4444; color: white; }

        /* Round Tracker */
        .round-tracker {
          display: flex; justify-content: space-between;
          margin-bottom: 16px; padding: 0 2px; gap: 5px;
          overflow-x: auto;
        }
        .round-tab {
          flex: 1; text-align: center; padding: 12px 6px;
          background: #fff; border-radius: 12px;
          border: 1px solid #e2e8f0; transition: all 0.3s;
          display: flex; align-items: center; justify-content: center;
          font-weight: 600; color: #64748b; font-size: 0.85rem;
          min-width: 44px;
        }
        .round-tab.active {
          background: #3b82f6; color: #fff;
          border-color: #3b82f6; transform: scale(1.03);
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }
        .round-tab.done {
          background: #dcfce7; color: #166534; border-color: #bbf7d0;
        }
        .round-icon { font-size: 1.1rem; }
        .round-tab-label { font-size: 0.75rem; }

        /* Active Round Header */
        .active-round-header {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white; padding: 14px 20px;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 8px;
        }

        .result-scroll { max-height: 450px; overflow-y: auto; padding-right: 5px; }
        .border-bottom-pulse { position: relative; display: inline-block; padding-bottom: 5px; }
        .border-bottom-pulse::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 60px; height: 4px; background: #3b82f6; border-radius: 2px;
        }

        @media (min-width: 768px) { .border-end-sm { border-right: 1px solid #e2e8f0; } }

        @media (max-width: 768px) {
          .round-tab-label { display: none !important; }
          .round-tab { padding: 10px 4px; }
          .interview-bg { padding-top: 20px !important; padding-bottom: 20px !important; }
          .ui-card { border-radius: 14px; }
          .p-4 { padding: 14px !important; }
          .p-5 { padding: 16px !important; }
          .border-bottom-pulse { font-size: 1.5rem !important; }
          .display-4 { font-size: 1.6rem !important; }
          .col-md-5, .col-md-7 { width: 100% !important; }
        }

        @media (max-width: 480px) {
          .round-info-row { gap: 8px; }
          .round-info-card { padding: 8px 12px; font-size: 0.85rem; }
          .proctor-bar { font-size: 0.78rem; padding: 8px 12px; }
          .active-round-header { padding: 12px 14px; }
          .active-round-header h5 { font-size: 1rem !important; }
        }
      `}</style>
    </>
  );
};

export default Interview;
