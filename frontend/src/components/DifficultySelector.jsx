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
    tier1: { label: "Hard", color: "#ef4444", desc: "Google, Microsoft, Amazon level" },
    tier2: { label: "Medium", color: "#f59e0b", desc: "Infosys, Wipro, TCS level" },
    tier3: { label: "Easy", color: "#10b981", desc: "Startups, Local companies" },
  };

  return (
    <div>
      <select
        value={tier}
        onChange={handleChange}
        className="form-select form-select-lg mb-3 shadow-sm"
      >
        <option value="tier1">🔴 Tier 1 — Hard (Google, Microsoft)</option>
        <option value="tier2">🟡 Tier 2 — Medium (Infosys, Wipro)</option>
        <option value="tier3">🟢 Tier 3 — Easy (Startups)</option>
      </select>

      <div className="d-flex align-items-center gap-2 mb-4">
        <span
          className="badge py-2 px-3 text-white shadow-sm"
          style={{ backgroundColor: tierInfo[tier]?.color, fontSize: "0.85rem" }}
        >
          {tierInfo[tier]?.label}
        </span>
        <span className="text-secondary small fw-medium text-slate-600">{tierInfo[tier]?.desc}</span>
        <button
          onClick={handleRefresh}
          className="btn btn-sm btn-outline-primary ms-auto shadow-sm"
          disabled={loading}
        >
          🔄 New Question
        </button>
      </div>

      {loading && <p className="text-primary fw-medium">Loading question...</p>}

      {question && !loading && (
        <div className="p-3 rounded" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <p className="mb-1 text-secondary small fw-bold" style={{ color: "#64748b" }}>PREVIEW:</p>
          <p className="mb-2 fw-semibold" style={{ color: "#0f172a" }}>{question.text}</p>
          <div>
            {question.tags?.map((tag, i) => (
              <span key={i} className="badge bg-light text-secondary border me-2">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
