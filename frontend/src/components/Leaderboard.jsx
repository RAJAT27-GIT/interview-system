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
    <div className="table-responsive leaderboard-container">
      <table className="table table-hover table-borderless mb-0">
        <thead className="leaderboard-thead">
          <tr>
            <th className="py-3 px-3 px-md-4 text-slate-500 fw-bold">Rank</th>
            <th className="py-3 px-3 px-md-4 text-slate-500 fw-bold">User</th>
            <th className="py-3 px-3 px-md-4 text-end text-slate-500 fw-bold">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={idx} className="leaderboard-row" style={idx < 3 ? { backgroundColor: "#f0f9ff" } : {}}>
              <td className="py-3 px-3 px-md-4 fw-bold rank-cell">
                {getMedal(idx)}
              </td>
              <td className="py-3 px-3 px-md-4 fw-medium user-cell">
                {entry.user}
              </td>
              <td className="py-3 px-3 px-md-4 text-end score-cell">
                <span
                  className="badge score-badge"
                  style={{
                    background: idx === 0 ? "linear-gradient(135deg, #f59e0b, #ef4444)" :
                      idx < 3 ? "#3b82f6" : "#e2e8f0",
                    color: idx < 3 ? "white" : "#475569",
                  }}
                >
                  {entry.score}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .leaderboard-container {
          border-radius: 12px;
          overflow: hidden;
          background: white;
        }
        .leaderboard-thead {
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .leaderboard-thead th {
          color: #64748b !important;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .leaderboard-row td {
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        .rank-cell {
          font-size: 1.05rem;
          color: #1e293b;
          width: 70px;
        }
        .user-cell {
          color: #334155;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .score-badge {
          padding: 6px 12px;
          font-size: 0.85rem;
          font-weight: 700;
          border-radius: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        @media (max-width: 576px) {
          .rank-cell { width: 60px; font-size: 0.95rem; padding-left: 12px !important; }
          .user-cell { font-size: 0.9rem; padding-left: 12px !important; }
          .score-cell { padding-right: 12px !important; }
          .score-badge { padding: 4px 10px; font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}
