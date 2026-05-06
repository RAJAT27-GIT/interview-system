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
      <section className="py-5" style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%)", paddingBottom: "100px" }}>
        <div className="container py-5 text-center mt-5">
          <h1 className="display-3 fw-bold mb-4" style={{ letterSpacing: "-1px", color: "#0f172a" }}>
            Get Interview-Ready with <br />
            <span style={{ color: "#3b82f6" }}>AI-Powered Tools</span>
          </h1>
          <p className="lead mx-auto mb-5" style={{ maxWidth: "700px", color: "#475569" }}>
            The ultimate platform to practice realistic voice interviews, build modern ATS-friendly resumes, and evaluate your existing CV — all inside one sleek aesthetic dashboard.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => navigate("/interview")}
              className="btn btn-lg fw-bold shadow-sm"
              style={{ background: "#3b82f6", color: "#fff", padding: "14px 32px", borderRadius: "12px", border: "none" }}
            >
              Start Free Mock
            </button>
            <button
              onClick={() => {
                document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn btn-lg fw-bold"
              style={{ padding: "14px 32px", borderRadius: "12px", border: "1px solid #cbd5e1", color: "#475569", background: "white" }}
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      <main>
        {/* FEATURES SECTION */}
        <section id="features-section" className="py-5 mt-5">
          <div className="container">
            <h2 className="text-center fw-bold mb-5" style={{ fontSize: "2.5rem", color: "#0f172a" }}>Platform Features</h2>
            <div className="row g-4">
              {features.map((f, idx) => (
                <div key={idx} className="col-md-6 col-lg-3 text-center">
                  <div
                    className="card h-100 p-4 hover-shadow"
                    style={{
                      background: "#ffffff",
                      borderRadius: "18px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
                    }}
                  >
                    <div className="mb-4">{f.icon}</div>
                    <h5 className="fw-bold mb-3" style={{ color: "#1e293b" }}>{f.title}</h5>
                    <p className="mb-0" style={{ color: "#64748b" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DETAILS SECTION */}
        <section className="py-5 my-5">
          <div className="container">
            <div className="row align-items-center mb-5">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <div className="p-5" style={{ background: "#f0f9ff", borderRadius: "24px", border: "1px solid #bae6fd" }}>
                  <h3 className="fw-bold mb-4" style={{ color: "#0369a1" }}>Interactive Voice Interviews</h3>
                  <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#334155" }}>
                    Tired of generic coding pads? Experience a real interview simulation where an AI asks you dynamic questions based on your difficulty choice. 
                    Speak directly into your microphone, get evaluated using multiple criteria (keywords, accuracy, similarity), and receive actionable feedback.
                  </p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="p-5" style={{ background: "#f0fdf4", borderRadius: "24px", border: "1px solid #bbf7d0" }}>
                  <h3 className="fw-bold mb-4" style={{ color: "#15803d" }}>Intelligent Resume Studio</h3>
                  <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#334155" }}>
                    Your resume is the first point of contact. We provide a full Resume Builder with live preview, and an AI-driven Resume Checker that extracts skills and details from your uploaded PDF directly into analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
