import { useState, useEffect } from "react";

export default function DifficultySelector({ onQuestionSelected }) {
  const [tier, setTier] = useState("tier2");
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQuestion = async (tierLevel) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/questions?tier=${tierLevel}&count=1`);
      const data = await res.json();

      if (data && data.length > 0) {
        setQuestion(data[0]);
        if (onQuestionSelected) onQuestionSelected(tierLevel, data[0]);
      } else {
        setQuestion(null);
      }
    } catch (err) {
      console.error("❌ Error fetching question:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion(tier);
  }, []);

  const handleChange = (e) => {
    const newTier = e.target.value;
    setTier(newTier);
    fetchQuestion(newTier);
  };

  const handleRefresh = () => {
    fetchQuestion(tier);
  };

  const tierInfo = {
    tier1: { label: "Hard", color: "#ef4444", desc: "Google, Microsoft level" },
    tier2: { label: "Medium", color: "#f59e0b", desc: "Infosys, Wipro level" },
    tier3: { label: "Easy", color: "#10b981", desc: "Startups, Local companies" },
  };

  return (
    <div className="diff-selector-container">
      <select
        value={tier}
        onChange={handleChange}
        className="form-select form-select-lg mb-3 shadow-sm diff-select"
      >
        <option value="tier1">🔴 Tier 1 — Hard (Google, Microsoft)</option>
        <option value="tier2">🟡 Tier 2 — Medium (Infosys, Wipro)</option>
        <option value="tier3">🟢 Tier 3 — Easy (Startups)</option>
      </select>

      <div className="diff-info-bar">
        <div className="d-flex align-items-center gap-2 flex-grow-1">
          <span
            className="badge diff-badge"
            style={{ backgroundColor: tierInfo[tier]?.color }}
          >
            {tierInfo[tier]?.label}
          </span>
          <span className="diff-desc">{tierInfo[tier]?.desc}</span>
        </div>
        <button
          onClick={handleRefresh}
          className="btn btn-sm btn-outline-primary shadow-sm refresh-btn"
          disabled={loading}
        >
          🔄 New Question
        </button>
      </div>

      {loading && <p className="text-primary fw-medium mt-3">Loading question...</p>}

      {question && !loading && (
        <div className="preview-box">
          <p className="preview-label">PREVIEW:</p>
          <p className="preview-text">{question.text}</p>
          <div className="preview-tags">
            {question.tags?.map((tag, i) => (
              <span key={i} className="badge tag-badge">{tag}</span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .diff-selector-container {
          width: 100%;
        }
        .diff-select {
          border-radius: 12px;
          font-size: 1rem;
          padding: 12px;
        }
        .diff-info-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }
        .diff-badge {
          padding: 6px 12px;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: 8px;
        }
        .diff-desc {
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .refresh-btn {
          border-radius: 10px;
          font-weight: 600;
          white-space: nowrap;
        }
        .preview-box {
          padding: 20px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }
        .preview-label {
          margin-bottom: 8px;
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1px;
        }
        .preview-text {
          margin-bottom: 12px;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.5;
        }
        .tag-badge {
          background: #fff;
          color: #64748b;
          border: 1px solid #e2e8f0;
          margin-right: 8px;
          margin-bottom: 6px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .diff-select { font-size: 0.95rem; }
          .diff-info-bar { flex-direction: column; align-items: flex-start; gap: 10px; }
          .refresh-btn { width: 100%; padding: 10px; }
          .diff-desc { font-size: 0.8rem; }
        }

        @media (max-width: 480px) {
          .preview-box { padding: 16px; }
          .preview-text { font-size: 0.9rem; }
        }
      `}</style>
    </div>
  );
}
