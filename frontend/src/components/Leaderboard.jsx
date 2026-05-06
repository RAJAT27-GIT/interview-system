import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://localhost:8000/leaderboard?top_n=10");
        const leaderboardData = await res.json();
        setData(leaderboardData);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  if (loading) return <p className="text-secondary text-center py-4 fw-medium">Loading leaderboard...</p>;

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-secondary fw-medium fs-5">No scores yet. Be the first to take an interview!</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover table-borderless mb-0">
        <thead style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <tr>
            <th className="py-3 px-4 text-slate-500 fw-bold" style={{ color: "#64748b" }}>Rank</th>
            <th className="py-3 px-4 text-slate-500 fw-bold" style={{ color: "#64748b" }}>User</th>
            <th className="py-3 px-4 text-end text-slate-500 fw-bold" style={{ color: "#64748b" }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={idx} style={idx < 3 ? { backgroundColor: "#f0f9ff" } : {}}>
              <td className="py-3 px-4 fw-bold" style={{ fontSize: "1.05rem", color: "#1e293b", borderBottom: "1px solid #f1f5f9" }}>
                {getMedal(idx)}
              </td>
              <td className="py-3 px-4 fw-medium" style={{ color: "#334155", borderBottom: "1px solid #f1f5f9" }}>
                {entry.user}
              </td>
              <td className="py-3 px-4 text-end" style={{ borderBottom: "1px solid #f1f5f9" }}>
                <span
                  className="badge py-2 px-3 shadow-sm rounded-pill"
                  style={{
                    background: idx === 0 ? "linear-gradient(135deg, #f59e0b, #ef4444)" :
                      idx < 3 ? "#3b82f6" : "#e2e8f0",
                    color: idx < 3 ? "white" : "#475569",
                    fontSize: "0.9rem"
                  }}
                >
                  {entry.score}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
