import React from "react";
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-root">
      <div className="container footer-container">
        {/* BRAND */}
        <div className="footer-brand">
          <h2 className="footer-logo">
            <span style={{ color: "#3b82f6" }}>MY</span><span style={{ color: "#0f172a" }}>INTRO</span>
          </h2>
          <p className="footer-tagline">
            AI-powered mock interviews, resume builder, ATS checker and complete job-prep tools —
            everything you need to land your dream job in one elegant platform.
          </p>
        </div>

        {/* SOCIAL */}
        <div className="footer-social">
          {[FaTwitter, FaInstagram, FaLinkedin, FaGithub].map((Icon, idx) => (
            <a
              key={idx}
              href="#"
              className="footer-social-icon hover-shadow"
              style={{ textDecoration: "none" }}
            >
              <Icon size={20} />
            </a>
          ))}
        </div>

        {/* LINKS SECTION */}
        <div className="footer-links-grid">
          <div className="footer-links-col">
            <h5 className="footer-links-heading">Products</h5>
            <ul className="footer-links-list">
              <li><a href="#" className="footer-link hover-text">Mock Interview</a></li>
              <li><a href="#" className="footer-link hover-text">Resume Builder</a></li>
              <li><a href="#" className="footer-link hover-text">Resume Checker</a></li>
              <li><a href="#" className="footer-link hover-text">ATS Analyzer</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h5 className="footer-links-heading">Company</h5>
            <ul className="footer-links-list">
              <li><a href="#" className="footer-link hover-text">About Us</a></li>
              <li><a href="#" className="footer-link hover-text">Careers</a></li>
              <li><a href="#" className="footer-link hover-text">Contact</a></li>
              <li><a href="#" className="footer-link hover-text">Partners</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h5 className="footer-links-heading">Support</h5>
            <ul className="footer-links-list">
              <li><a href="#" className="footer-link hover-text">Help Center</a></li>
              <li><a href="#" className="footer-link hover-text">Guides</a></li>
              <li><a href="#" className="footer-link hover-text">API Docs</a></li>
              <li><a href="#" className="footer-link hover-text">System Status</a></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="footer-bottom">
          <p style={{ color: "#94a3b8", margin: 0 }}>© {year} MYINTRO — All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <a href="#" className="footer-link hover-text">Terms of Service</a>
            <a href="#" className="footer-link hover-text">Privacy Policy</a>
            <a href="#" className="footer-link hover-text">Security Setup</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-root {
          background-color: #ffffff;
          border-top: 1px solid #f1f5f9;
          padding-top: 48px;
          margin-top: 40px;
        }
        .footer-container {
          max-width: 1200px;
        }
        .footer-brand {
          text-align: center;
          margin-bottom: 28px;
        }
        .footer-logo {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }
        .footer-tagline {
          color: #64748b;
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.7;
          font-size: 0.97rem;
        }
        .footer-social {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .footer-social-icon {
          width: 46px;
          height: 46px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 36px;
          text-align: center;
        }
        .footer-links-heading {
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 16px;
          font-size: 1rem;
        }
        .footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-links-list li {
          margin-bottom: 10px;
        }
        .footer-link {
          text-decoration: none;
          color: #64748b;
          font-size: 0.93rem;
          display: block;
        }
        .footer-bottom {
          border-top: 1px solid #f1f5f9;
          padding: 20px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.9rem;
        }
        .footer-bottom-links {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .footer-links-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
          .footer-links-heading {
            font-size: 0.9rem;
          }
          .footer-link {
            font-size: 0.85rem;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .footer-bottom-links {
            justify-content: center;
            gap: 14px;
          }
        }

        @media (max-width: 480px) {
          .footer-links-grid {
            grid-template-columns: 1fr;
            text-align: left;
          }
          .footer-brand {
            text-align: left;
          }
          .footer-tagline {
            text-align: left;
          }
          .footer-social {
            justify-content: flex-start;
          }
          .footer-logo {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
