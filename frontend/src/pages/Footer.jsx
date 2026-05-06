import React from "react";
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="pt-5 mt-5 border-top position-relative" style={{ backgroundColor: "#ffffff", borderColor: "#f1f5f9" }}>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        {/* BRAND */}
        <div className="text-center mb-4 mt-3">
          <h2 className="fw-bold fs-1" style={{ letterSpacing: "1px" }}>
            <span style={{ color: "#3b82f6" }}>MY</span><span style={{ color: "#0f172a" }}>INTRO</span>
          </h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: "600px", lineHeight: "1.8", color: "#64748b" }}>
            AI-powered mock interviews, resume builder, ATS checker and complete job-prep tools —
            everything you need to land your dream job in one elegant platform.
          </p>
        </div>

        {/* SOCIAL */}
        <div className="d-flex justify-content-center gap-3 mb-5">
          {[FaTwitter, FaInstagram, FaLinkedin, FaGithub].map((Icon, idx) => (
            <a
              key={idx}
              href="#"
              className="d-flex align-items-center justify-content-center hover-shadow transition"
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "50%",
                color: "#475569",
                textDecoration: "none"
              }}
            >
              <Icon size={20} />
            </a>
          ))}
        </div>

        {/* LINKS SECTION */}
        <div className="row text-center text-md-start mb-5">
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-4" style={{ color: "#0f172a" }}>Products</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-decoration-none d-block mb-3 hover-text" style={{ color: "#64748b" }}>Mock Interview</a></li>
              <li><a href="#" className="text-decoration-none d-block mb-3 hover-text" style={{ color: "#64748b" }}>Resume Builder</a></li>
              <li><a href="#" className="text-decoration-none d-block mb-3 hover-text" style={{ color: "#64748b" }}>Resume Checker</a></li>
              <li><a href="#" className="text-decoration-none d-block mb-3 hover-text" style={{ color: "#64748b" }}>ATS Analyzer</a></li>
            </ul>
          </div>

          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-4" style={{ color: "#0f172a" }}>Company</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="d-block mb-3 text-decoration-none hover-text" style={{ color: "#64748b" }}>About Us</a></li>
              <li><a href="#" className="d-block mb-3 text-decoration-none hover-text" style={{ color: "#64748b" }}>Careers</a></li>
              <li><a href="#" className="d-block mb-3 text-decoration-none hover-text" style={{ color: "#64748b" }}>Contact</a></li>
              <li><a href="#" className="d-block mb-3 text-decoration-none hover-text" style={{ color: "#64748b" }}>Partners</a></li>
            </ul>
          </div>

          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-4" style={{ color: "#0f172a" }}>Support</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="d-block mb-3 text-decoration-none hover-text" style={{ color: "#64748b" }}>Help Center</a></li>
              <li><a href="#" className="d-block mb-3 text-decoration-none hover-text" style={{ color: "#64748b" }}>Guides</a></li>
              <li><a href="#" className="d-block mb-3 text-decoration-none hover-text" style={{ color: "#64748b" }}>API Docs</a></li>
              <li><a href="#" className="d-block mb-3 text-decoration-none hover-text" style={{ color: "#64748b" }}>System Status</a></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-4 pb-4 d-flex flex-column flex-md-row justify-content-between align-items-center" style={{ borderTop: "1px solid #f1f5f9" }}>
          <p className="mb-3 mb-md-0" style={{ color: "#94a3b8" }}>© {year} MYINTRO — All Rights Reserved.</p>

          <div className="d-flex gap-4">
            <a href="#" className="text-decoration-none hover-text" style={{ color: "#94a3b8" }}>Terms of Service</a>
            <a href="#" className="text-decoration-none hover-text" style={{ color: "#94a3b8" }}>Privacy Policy</a>
            <a href="#" className="text-decoration-none hover-text" style={{ color: "#94a3b8" }}>Security Setup</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
