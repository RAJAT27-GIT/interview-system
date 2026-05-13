import { useNavigate } from "react-router-dom";
import { FaMicrophone, FaFileAlt, FaCheckCircle, FaChartBar } from "react-icons/fa";
import Footer from "./Footer";
import Navbar from "../components/Navbar";

function Home({ onStartInterview }) {
  const navigate = useNavigate();

  const features = [
    {
      title: "AI Mock Interviews",
      desc: "Timed voice interviews with detailed feedback, exactly like real human HRs.",
      icon: <FaMicrophone size={32} style={{ color: "#3b82f6" }} />,
    },
    {
      title: "Smart Resume Builder",
      desc: "Instantly create beautiful, ATS-optimized resumes that stand out.",
      icon: <FaFileAlt size={32} style={{ color: "#10b981" }} />,
    },
    {
      title: "Resume Check & OCR",
      desc: "Drag & drop your PDF. AI extracts and rates your resume instantly.",
      icon: <FaCheckCircle size={32} style={{ color: "#8b5cf6" }} />,
    },
    {
      title: "Real-time Leaderboard",
      desc: "Track your scores against others globally and see where you rank.",
      icon: <FaChartBar size={32} style={{ color: "#f43f5e" }} />,
    },
  ];

  return (
    <div style={{ backgroundColor: "#f8fafc", color: "#0f172a", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO SECTION */}
      <section className="home-hero-section" style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%)" }}>
        <div className="container home-hero-inner">
          <h1 className="home-hero-title">
            Get Interview-Ready with <br />
            <span style={{ color: "#3b82f6" }}>AI-Powered Tools</span>
          </h1>
          <p className="home-hero-sub mx-auto mb-5" style={{ color: "#475569" }}>
            The ultimate platform to practice realistic voice interviews, build modern ATS-friendly resumes,
            and evaluate your existing CV — all inside one sleek aesthetic dashboard.
          </p>
          <div className="home-hero-btns">
            <button
              onClick={() => navigate("/interview")}
              style={{ background: "#3b82f6", color: "#fff", padding: "14px 32px", borderRadius: "12px", border: "none", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }}
            >
              Start Free Mock
            </button>
            <button
              onClick={() => {
                document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ padding: "14px 32px", borderRadius: "12px", border: "1px solid #cbd5e1", color: "#475569", background: "white", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }}
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      <main>
        {/* FEATURES SECTION */}
        <section id="features-section" className="home-features-section">
          <div className="container">
            <h2 className="text-center fw-bold mb-5" style={{ fontSize: "2rem", color: "#0f172a" }}>Platform Features</h2>
            <div className="home-features-grid">
              {features.map((f, idx) => (
                <div key={idx} className="home-feature-card hover-shadow">
                  <div className="mb-4">{f.icon}</div>
                  <h5 className="fw-bold mb-3" style={{ color: "#1e293b" }}>{f.title}</h5>
                  <p className="mb-0" style={{ color: "#64748b" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DETAILS SECTION */}
        <section className="home-details-section">
          <div className="container">
            <div className="home-details-grid">
              <div className="home-detail-box" style={{ background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                <h3 className="fw-bold mb-4" style={{ color: "#0369a1" }}>Interactive Voice Interviews</h3>
                <p style={{ fontSize: "1rem", lineHeight: "1.8", color: "#334155" }}>
                  Tired of generic coding pads? Experience a real interview simulation where an AI asks you dynamic questions based on your difficulty choice.
                  Speak directly into your microphone, get evaluated using multiple criteria (keywords, accuracy, similarity), and receive actionable feedback.
                </p>
              </div>
              <div className="home-detail-box" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                <h3 className="fw-bold mb-4" style={{ color: "#15803d" }}>Intelligent Resume Studio</h3>
                <p style={{ fontSize: "1rem", lineHeight: "1.8", color: "#334155" }}>
                  Your resume is the first point of contact. We provide a full Resume Builder with live preview, and an AI-driven Resume Checker that extracts skills and details from your uploaded PDF directly into analytics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        .home-hero-section {
          padding: 60px 0 80px;
        }
        .home-hero-inner {
          text-align: center;
          padding-top: 40px;
        }
        .home-hero-title {
          font-weight: 800;
          font-size: 3rem;
          letter-spacing: -1px;
          color: #0f172a;
          margin-bottom: 1.5rem;
          line-height: 1.15;
        }
        .home-hero-sub {
          max-width: 700px;
          font-size: 1.1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        .home-hero-btns {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .home-features-section {
          padding: 60px 0;
        }
        .home-features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .home-feature-card {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          padding: 28px 20px;
          text-align: center;
        }

        .home-details-section {
          padding: 40px 0 60px;
        }
        .home-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .home-detail-box {
          border-radius: 24px;
          padding: 36px 32px;
        }

        @media (max-width: 992px) {
          .home-features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .home-hero-title {
            font-size: 2.2rem;
          }
        }

        @media (max-width: 768px) {
          .home-hero-section {
            padding: 32px 0 48px;
          }
          .home-hero-title {
            font-size: 1.8rem;
            letter-spacing: -0.5px;
          }
          .home-hero-sub {
            font-size: 0.97rem;
            max-width: 100%;
            padding: 0 4px;
          }
          .home-hero-btns {
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }
          .home-hero-btns button {
            width: 100%;
            max-width: 320px;
          }
          .home-features-grid {
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }
          .home-feature-card {
            padding: 20px 14px;
          }
          .home-details-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .home-detail-box {
            padding: 24px 20px;
          }
          .home-features-section {
            padding: 36px 0;
          }
          .home-details-section {
            padding: 20px 0 40px;
          }
        }

        @media (max-width: 480px) {
          .home-features-grid {
            grid-template-columns: 1fr;
          }
          .home-hero-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
