import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const links = [
    { path: "/", label: "Home" },
    { path: "/interview", label: "Interview" },
    { path: "/resume-builder", label: "Resume Builder" },
    { path: "/resume-check", label: "Resume Check" },
  ];

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <h2 style={styles.logo}>
          <span style={{ color: "#3b82f6" }}>MY</span>
          <span style={{ color: "#1e293b" }}>INTRO</span>
        </h2>
      </Link>
      <div style={styles.links}>
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
      <div style={styles.authLinks}>
        {user ? (
          <>
            <span style={{marginRight: '15px', fontWeight: 'bold'}}>{user.name}</span>
            <button onClick={logout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.loginLink}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    padding: "16px 40px",
    color: "#1e293b",
    boxShadow: "0 2px 15px rgba(0,0,0,0.04)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    borderBottom: "1px solid #e2e8f0",
  },
  logo: {
    fontSize: "24px",
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
  },
};

export default Navbar;
