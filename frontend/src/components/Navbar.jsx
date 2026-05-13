import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { path: "/", label: "Home" },
    { path: "/interview", label: "Interview" },
    { path: "/resume-builder", label: "Resume Builder" },
    { path: "/resume-check", label: "Resume Check" },
  ];

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav style={styles.navbar}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }} onClick={closeMenu}>
          <h2 style={styles.logo}>
            <span style={{ color: "#3b82f6" }}>MY</span>
            <span style={{ color: "#1e293b" }}>INTRO</span>
          </h2>
        </Link>

        {/* Desktop Links */}
        <div style={styles.links} className="nav-desktop-links">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.link,
                color: location.pathname === link.path ? "#3b82f6" : "#475569",
                borderBottom: location.pathname === link.path ? "2px solid #3b82f6" : "2px solid transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link to="/admin" style={{...styles.link, color: '#8b5cf6'}}>Admin Panel</Link>
          )}
        </div>

        {/* Desktop Auth */}
        <div style={styles.authLinks} className="nav-desktop-auth">
          {user ? (
            <>
              <span style={{marginRight: '15px', fontWeight: 'bold', color: '#1e293b'}}>{user.name}</span>
              <button onClick={logout} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.loginLink}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Register</Link>
            </>
          )}
        </div>

        {/* Hamburger Button (mobile only) */}
        <button
          className="nav-hamburger"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          style={styles.hamburger}
        >
          <span style={{
            ...styles.hamburgerLine,
            transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
          }} />
          <span style={{
            ...styles.hamburgerLine,
            opacity: menuOpen ? 0 : 1
          }} />
          <span style={{
            ...styles.hamburgerLine,
            transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
          }} />
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu} className="nav-mobile-menu">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              style={{
                ...styles.mobileLink,
                color: location.pathname === link.path ? "#3b82f6" : "#475569",
                background: location.pathname === link.path ? "#eff6ff" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={closeMenu} style={{...styles.mobileLink, color: '#8b5cf6'}}>
              Admin Panel
            </Link>
          )}
          <div style={styles.mobileDivider} />
          {user ? (
            <>
              <span style={styles.mobileUsername}>{user.name}</span>
              <button onClick={() => { logout(); closeMenu(); }} style={styles.mobileLogoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} style={styles.mobileLink}>Login</Link>
              <Link to="/register" onClick={closeMenu} style={{...styles.mobileLink, color: '#3b82f6', fontWeight: '700'}}>
                Register
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        .nav-desktop-links { display: flex; gap: 28px; }
        .nav-desktop-auth { display: flex; align-items: center; gap: 15px; }
        .nav-hamburger { display: none !important; }
        .nav-mobile-menu { display: none !important; }

        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-desktop-auth { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-mobile-menu { display: flex !important; }
        }
      `}</style>
    </>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    padding: "14px 24px",
    color: "#1e293b",
    boxShadow: "0 2px 15px rgba(0,0,0,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    borderBottom: "1px solid #e2e8f0",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "1px",
  },
  links: {
    display: "flex",
    gap: "28px",
  },
  link: {
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
    padding: "6px 0",
    transition: "all 0.2s ease",
  },
  authLinks: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  loginLink: {
    textDecoration: "none",
    color: "#475569",
    fontWeight: "600",
  },
  registerBtn: {
    textDecoration: "none",
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "8px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
  },
  logoutBtn: {
    backgroundColor: "transparent",
    border: "1px solid #cbd5e1",
    color: "#475569",
    padding: "6px 16px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  hamburger: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "4px",
    zIndex: 1001,
  },
  hamburgerLine: {
    display: "block",
    width: "24px",
    height: "2px",
    backgroundColor: "#1e293b",
    borderRadius: "2px",
    transition: "all 0.3s ease",
  },
  mobileMenu: {
    position: "fixed",
    top: "60px",
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.98)",
    backdropFilter: "blur(12px)",
    flexDirection: "column",
    padding: "16px 0 20px",
    zIndex: 999,
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    borderBottom: "1px solid #e2e8f0",
  },
  mobileLink: {
    padding: "14px 24px",
    textDecoration: "none",
    color: "#475569",
    fontWeight: "600",
    fontSize: "16px",
    borderRadius: "0",
    display: "block",
  },
  mobileDivider: {
    height: "1px",
    background: "#e2e8f0",
    margin: "8px 24px",
  },
  mobileUsername: {
    padding: "10px 24px",
    fontWeight: "700",
    color: "#1e293b",
    display: "block",
  },
  mobileLogoutBtn: {
    margin: "8px 24px 0",
    padding: "10px 20px",
    background: "transparent",
    border: "1px solid #cbd5e1",
    color: "#475569",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    textAlign: "left",
    width: "calc(100% - 48px)",
  },
};

export default Navbar;
