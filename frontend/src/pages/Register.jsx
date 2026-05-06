import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [adminSecret, setAdminSecret] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { 
                name, 
                email, 
                password,
                role 
            };
            if (role === 'admin') {
                payload.admin_secret = adminSecret;
            }
            const response = await axios.post('http://localhost:8000/auth/register', payload);
            login({ name: response.data.name, role: response.data.role }, response.data.access_token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Join Us</h2>
                <p>Create your AI Interview account</p>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            placeholder="your@email.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="form-group">
                        <label>Account Type</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="role-select">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    {role === 'admin' && (
                        <div className="form-group">
                            <label>Admin Secret Key</label>
                            <input 
                                type="password" 
                                value={adminSecret} 
                                onChange={(e) => setAdminSecret(e.target.value)} 
                                required 
                                placeholder="Enter secret key to register as admin"
                            />
                        </div>
                    )}
                    <button type="submit" className="login-btn">Register</button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>

            <style jsx>{`
                .login-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: white;
                }
                .login-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    padding: 40px;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                h2 { margin-bottom: 10px; font-size: 2rem; }
                p { color: #94a3b8; margin-bottom: 30px; }
                .form-group { margin-bottom: 20px; text-align: left; }
                label { display: block; margin-bottom: 8px; color: #cbd5e1; }
                input, .role-select {
                    width: 100%;
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.2);
                    background: rgba(255,255,255,0.05);
                    color: white;
                    outline: none;
                }
                input:focus, .role-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
                .role-select option { background: #1e293b; color: white; }
                .login-btn {
                    width: 100%;
                    padding: 12px;
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                .login-btn:hover { background: #2563eb; }
                .error-message {
                    background: rgba(239, 68, 68, 0.2);
                    color: #f87171;
                    padding: 10px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                }
                .auth-footer { margin-top: 20px; font-size: 0.9rem; }
                .auth-footer a { color: #3b82f6; text-decoration: none; }
            `}</style>
        </div>
    );
};

export default Register;
