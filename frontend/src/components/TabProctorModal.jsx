export default function TabProctorModal({ violations, maxViolations, visible, onDismiss }) {
  if (!visible) return null;

  const remaining = maxViolations - violations;
  const severity =
    violations >= maxViolations ? "terminated" :
    violations === maxViolations - 1 ? "danger" : "warning";

  const config = {
    warning: {
      bg: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
      border: "#d97706",
      icon: "⚠️",
      title: "Tab Switch!",
      text: `Warning ${violations}/${maxViolations}. Please stay on this tab during the interview.`,
      btnClass: "warn-btn",
      btnText: "I Understand",
    },
    danger: {
      bg: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
      border: "#c2410c",
      icon: "🚨",
      title: "Final Warning!",
      text: `This is your LAST warning (${violations}/${maxViolations}). One more switch and your interview will end!`,
      btnClass: "danger-btn",
      btnText: "I Won't Switch",
    },
    terminated: {
      bg: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
      border: "#991b1b",
      icon: "🛑",
      title: "Terminated",
      text: "You exceeded tab switches. Your interview has been submitted automatically.",
      btnClass: "term-btn",
      btnText: "View Results",
    },
  };

  const c = config[severity];

  return (
    <div className="proctor-overlay">
      <div className="proctor-modal" style={{ border: `3px solid ${c.border}` }}>
        <div className="proctor-modal-header" style={{ background: c.bg }}>
          <span className="proctor-icon">{c.icon}</span>
          <h3 className="proctor-title">{c.title}</h3>
        </div>
        <div className="proctor-modal-body">
          <p className="proctor-text">{c.text}</p>

          {severity !== "terminated" && (
            <div className="violation-meter">
              <div className="meter-label">Violations: {violations} / {maxViolations}</div>
              <div className="meter-track">
                <div
                  className="meter-fill"
                  style={{
                    width: `${(violations / maxViolations) * 100}%`,
                    background: severity === "danger" ? "#ef4444" : "#f59e0b",
                  }}
                />
              </div>
            </div>
          )}

          <button className={`proctor-btn ${c.btnClass}`} onClick={onDismiss}>
            {c.btnText}
          </button>
        </div>
      </div>

      <style>{`
        .proctor-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          padding: 16px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .proctor-modal {
          background: #fff;
          border-radius: 24px;
          width: 100%;
          max-width: 440px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes slideUp {
          from { transform: translateY(40px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .proctor-modal-header {
          padding: 32px 24px;
          text-align: center;
          color: white;
        }
        .proctor-icon {
          font-size: 3.5rem;
          display: block;
          margin-bottom: 12px;
        }
        .proctor-title {
          margin: 0;
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .proctor-modal-body {
          padding: 28px 24px;
          text-align: center;
        }
        .proctor-text {
          color: #475569;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 24px;
          font-weight: 500;
        }
        .violation-meter {
          margin-bottom: 24px;
          background: #f1f5f9;
          padding: 12px;
          border-radius: 12px;
        }
        .meter-label {
          font-size: 0.8rem;
          font-weight: 800;
          color: #64748b;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .meter-track {
          height: 8px;
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
        }
        .meter-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .proctor-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .proctor-btn:active {
          transform: scale(0.98);
        }
        .warn-btn { background: #f59e0b; }
        .warn-btn:hover { background: #d97706; }
        .danger-btn { background: #ea580c; }
        .danger-btn:hover { background: #c2410c; }
        .term-btn { background: #ef4444; }
        .term-btn:hover { background: #dc2626; }

        @media (max-width: 480px) {
          .proctor-modal-header { padding: 24px 20px; }
          .proctor-icon { font-size: 2.8rem; }
          .proctor-title { font-size: 1.3rem; }
          .proctor-modal-body { padding: 20px; }
          .proctor-text { font-size: 0.9rem; margin-bottom: 18px; }
          .proctor-btn { padding: 12px; font-size: 0.95rem; }
        }
      `}</style>
    </div>
  );
}
