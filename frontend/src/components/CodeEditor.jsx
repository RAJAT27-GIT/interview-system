import { useState } from "react";

const API = "http://localhost:8000";

export default function CodeEditor({ question, userName, onComplete }) {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(question?.starter_code?.python || "");
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(question?.starter_code?.[lang] || "");
    setTestResults(null);
  };

  const runCode = async () => {
    setRunning(true);
    setTestResults(null);
    try {
      const res = await fetch(`${API}/evaluate_code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          test_cases: question?.test_cases || [],
        }),
      });
      const data = await res.json();
      setTestResults(data);
    } catch (err) {
      console.error("Error running code:", err);
      alert("Error connecting to server. Make sure backend is running.");
    } finally {
      setRunning(false);
    }
  };

  const submitCode = async () => {
    if (!testResults) {
      await runCode();
    }
    setSubmitted(true);

    const score = testResults?.final_score ?? 0;

    try {
      await fetch(`${API}/add_score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: userName, score }),
      });
    } catch (err) {
      console.error("Score save error:", err);
    }

    if (onComplete) {
      onComplete({
        user_transcript: code,
        evaluation: {
          final_score: score,
          similarity: score,
          keyword_score: score,
          test_results: testResults?.results || [],
        },
        feedback:
          score >= 75
            ? "🌟 Great coding skills! Most test cases passed."
            : score >= 50
            ? "👍 Decent attempt. Some test cases failed — review edge cases."
            : "⚠️ Needs improvement. Try to handle all test cases correctly.",
      });
    }
  };

  const langIcons = {
    python: "🐍",
    javascript: "⚡",
    cpp: "⚙️",
  };

  return (
    <div>
      {/* Problem Statement */}
      <div className="code-problem-card">
        <div className="problem-header">
          <span className="problem-badge">💻 CODING PROBLEM</span>
          <span className="difficulty-badge">{question?.difficulty?.toUpperCase()}</span>
        </div>
        <h4 className="problem-title">{question?.text}</h4>

        {question?.test_cases && (
          <div className="examples-section">
            <p className="examples-label">📋 Examples:</p>
            {question.test_cases.slice(0, 2).map((tc, i) => (
              <div key={i} className="example-block">
                <div><strong>Input:</strong> <code>{tc.input}</code></div>
                <div><strong>Output:</strong> <code>{tc.expected_output}</code></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Language Selector */}
      <div className="lang-selector">
        {["python", "javascript", "cpp"].map((lang) => (
          <button
            key={lang}
            className={`lang-btn ${language === lang ? "active" : ""}`}
            onClick={() => handleLanguageChange(lang)}
            disabled={running || submitted}
          >
            {langIcons[lang]} {lang === "cpp" ? "C++" : lang.charAt(0).toUpperCase() + lang.slice(1)}
          </button>
        ))}
      </div>

      {/* Code Editor */}
      <div className="code-editor-wrapper">
        <div className="editor-header">
          <span className="editor-dot red"></span>
          <span className="editor-dot yellow"></span>
          <span className="editor-dot green"></span>
          <span className="editor-filename">
            solution.{language === "python" ? "py" : language === "javascript" ? "js" : "cpp"}
          </span>
        </div>
        <div className="editor-body">
          <div className="line-numbers">
            {code.split("\n").map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <textarea
            className="code-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={submitted}
            spellCheck={false}
            placeholder="Write your code here..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="code-actions">
        <button
          onClick={runCode}
          disabled={running || submitted || !code.trim()}
          className="run-btn"
        >
          {running ? "⏳ Running..." : "▶️ Run Code"}
        </button>
        <button
          onClick={submitCode}
          disabled={submitted || !code.trim()}
          className="submit-code-btn"
        >
          {submitted ? "✅ Submitted" : "🚀 Submit Solution"}
        </button>
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="test-results-panel">
          <div className="results-header">
            <h5>Test Results</h5>
            <span className={`results-score ${testResults.score >= 75 ? "pass" : "fail"}`}>
              {testResults.passed}/{testResults.total} Passed ({testResults.score}%)
            </span>
          </div>
          <div className="test-cases-list">
            {testResults.results?.map((r, i) => (
              <div key={i} className={`test-case-item ${r.passed ? "passed" : "failed"}`}>
                <div className="tc-header">
                  <span className="tc-icon">{r.passed ? "✅" : "❌"}</span>
                  <span className="tc-label">Test Case {r.test_num}</span>
                </div>
                <div className="tc-details">
                  <div><span className="tc-key">Input:</span> <code>{r.input}</code></div>
                  <div><span className="tc-key">Expected:</span> <code>{r.expected}</code></div>
                  <div><span className="tc-key">Got:</span> <code>{r.actual || "(no output)"}</code></div>
                  {r.error && <div className="tc-error">⚠️ {r.error}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .code-problem-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: #e2e8f0;
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 20px;
          border: 1px solid #334155;
        }
        .problem-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .problem-badge {
          background: #3b82f6;
          color: white;
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .difficulty-badge {
          background: #f59e0b;
          color: #1e293b;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 800;
        }
        .problem-title {
          color: #f8fafc;
          font-weight: 700;
          font-size: 1.1rem;
          line-height: 1.6;
        }
        .examples-section {
          margin-top: 16px;
          border-top: 1px solid #334155;
          padding-top: 14px;
        }
        .examples-label {
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 8px;
          font-size: 0.85rem;
        }
        .example-block {
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 8px;
          font-size: 0.85rem;
        }
        .example-block code {
          color: #67e8f9;
          background: transparent;
        }

        .lang-selector {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .lang-btn {
          padding: 8px 20px;
          border-radius: 10px;
          border: 2px solid #e2e8f0;
          background: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }
        .lang-btn:hover { border-color: #3b82f6; background: #eff6ff; }
        .lang-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        .lang-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .code-editor-wrapper {
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #334155;
          margin-bottom: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .editor-header {
          background: #1e293b;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .editor-dot {
          width: 12px; height: 12px; border-radius: 50%;
        }
        .editor-dot.red { background: #ef4444; }
        .editor-dot.yellow { background: #f59e0b; }
        .editor-dot.green { background: #22c55e; }
        .editor-filename {
          color: #94a3b8;
          font-size: 0.8rem;
          margin-left: 8px;
          font-family: 'Fira Code', 'Consolas', monospace;
        }
        .editor-body {
          display: flex;
          background: #0f172a;
          min-height: 280px;
        }
        .line-numbers {
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          background: #1e293b;
          color: #475569;
          font-family: 'Fira Code', 'Consolas', monospace;
          font-size: 0.85rem;
          line-height: 1.6;
          user-select: none;
          min-width: 40px;
        }
        .code-textarea {
          flex: 1;
          background: #0f172a;
          color: #e2e8f0;
          border: none;
          padding: 16px;
          font-family: 'Fira Code', 'Consolas', monospace;
          font-size: 0.85rem;
          line-height: 1.6;
          resize: none;
          outline: none;
          min-height: 280px;
          tab-size: 4;
        }
        .code-textarea::placeholder { color: #475569; }
        .code-textarea:disabled { opacity: 0.6; }

        .code-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .run-btn {
          padding: 12px 28px;
          border-radius: 12px;
          border: none;
          background: #22c55e;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .run-btn:hover { background: #16a34a; transform: translateY(-1px); }
        .run-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .submit-code-btn {
          padding: 12px 28px;
          border-radius: 12px;
          border: 2px solid #3b82f6;
          background: #3b82f6;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .submit-code-btn:hover { background: #2563eb; }
        .submit-code-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .test-results-panel {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
        }
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .results-header h5 { margin: 0; font-weight: 700; }
        .results-score {
          padding: 4px 14px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.85rem;
        }
        .results-score.pass { background: #dcfce7; color: #166534; }
        .results-score.fail { background: #fee2e2; color: #991b1b; }

        .test-cases-list { padding: 12px; }
        .test-case-item {
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 8px;
          border-left: 4px solid;
        }
        .test-case-item.passed {
          background: #f0fdf4;
          border-color: #22c55e;
        }
        .test-case-item.failed {
          background: #fef2f2;
          border-color: #ef4444;
        }
        .tc-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .tc-details {
          font-size: 0.85rem;
          color: #475569;
        }
        .tc-details code {
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          color: #0f172a;
          font-size: 0.8rem;
        }
        .tc-key { font-weight: 600; color: #1e293b; }
        .tc-error { color: #dc2626; margin-top: 4px; font-size: 0.8rem; }
      `}</style>
    </div>
  );
}
