import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('activity');
    const [activities, setActivities] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newQuestion, setNewQuestion] = useState({ text: '', difficulty: 'medium', tags: '', model_answer: '' });
    
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'activity') {
                const res = await axios.get('http://localhost:8000/admin/activity', { headers });
                setActivities(res.data);
            } else if (activeTab === 'questions') {
                const res = await axios.get('http://localhost:8000/admin/questions', { headers });
                setQuestions(res.data);
            } else if (activeTab === 'users' || activeTab === 'admins') {
                const res = await axios.get('http://localhost:8000/admin/users', { headers });
                setUsers(res.data);
            }
        } catch (err) {
            console.error('Error fetching data', err);
        }
        setLoading(false);
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        try {
            const tagsArray = newQuestion.tags.split(',').map(t => t.trim()).filter(t => t);
            await axios.post('http://localhost:8000/admin/questions', { 
                ...newQuestion, 
                tags: tagsArray 
            }, { headers });
            setNewQuestion({ text: '', difficulty: 'medium', tags: '', model_answer: '' });
            fetchData();
        } catch (err) {
            alert('Failed to add question');
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`http://localhost:8000/admin/questions/${id}`, { headers });
            fetchData();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
        try {
            await axios.delete(`http://localhost:8000/admin/users/${id}`, { headers });
            fetchData();
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const handleClearLogs = async () => {
        if (!window.confirm('Are you sure you want to clear all activity logs? This cannot be undone.')) return;
        try {
            await axios.delete('http://localhost:8000/admin/activity', { headers });
            fetchData();
        } catch (err) {
            alert('Failed to clear logs');
        }
    };

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>Admin Panel</h1>
                <div className="admin-info">
                    <span>Welcome, <strong>{user?.name}</strong></span>
                </div>
            </header>

            <nav className="admin-tabs">
                <button className={activeTab === 'activity' ? 'active' : ''} onClick={() => setActiveTab('activity')}>Activity Logs</button>
                <button className={activeTab === 'questions' ? 'active' : ''} onClick={() => setActiveTab('questions')}>Manage Questions</button>
                <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users List</button>
                <button className={activeTab === 'admins' ? 'active' : ''} onClick={() => setActiveTab('admins')}>Admins List</button>
            </nav>

            <main className="admin-content">
                {loading ? <p style={{color:'#94a3b8', padding:'20px 0'}}>Loading...</p> : (
                    <>
                        {activeTab === 'activity' && (
                            <div className="activity-tab">
                                <div className="tab-action-bar">
                                    <h2>System Activity</h2>
                                    <button className="delete-btn" onClick={handleClearLogs}>Clear All Logs</button>
                                </div>
                                <div className="table-scroll-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Action</th>
                                                <th>Details</th>
                                                <th>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activities.map(a => (
                                                <tr key={a._id}>
                                                    <td>{a.user_name}</td>
                                                    <td><span className={`badge ${a.action}`}>{a.action}</span></td>
                                                    <td>{JSON.stringify(a.details)}</td>
                                                    <td>{new Date(a.timestamp).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'questions' && (
                            <div className="questions-tab">
                                <div className="add-question-section">
                                    <h3>Add New Question</h3>
                                    <form onSubmit={handleAddQuestion} className="question-form">
                                        <textarea 
                                            placeholder="Question Text" 
                                            value={newQuestion.text} 
                                            onChange={e => setNewQuestion({...newQuestion, text: e.target.value})}
                                            required
                                        />
                                        <div className="form-row">
                                            <select 
                                                value={newQuestion.difficulty} 
                                                onChange={e => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                                            >
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </select>
                                            <input 
                                                type="text" 
                                                placeholder="Tags (comma separated)" 
                                                value={newQuestion.tags} 
                                                onChange={e => setNewQuestion({...newQuestion, tags: e.target.value})}
                                            />
                                        </div>
                                        <textarea 
                                            placeholder="Model Answer (Optional)" 
                                            value={newQuestion.model_answer} 
                                            onChange={e => setNewQuestion({...newQuestion, model_answer: e.target.value})}
                                        />
                                        <button type="submit" className="add-btn">Add Question</button>
                                    </form>
                                </div>

                                <h3 style={{marginBottom:'16px'}}>Existing Questions</h3>
                                <div className="table-scroll-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Text</th>
                                                <th>Difficulty</th>
                                                <th>Tags</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {questions.map(q => (
                                                <tr key={q._id}>
                                                    <td className="text-cell">{q.text}</td>
                                                    <td><span className={`diff-badge ${q.difficulty}`}>{q.difficulty}</span></td>
                                                    <td>{q.tags.join(', ')}</td>
                                                    <td>
                                                        <button className="delete-btn" onClick={() => handleDeleteQuestion(q._id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="users-tab">
                                <h2 style={{marginBottom:'16px'}}>Registered Users</h2>
                                <div className="table-scroll-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Score</th>
                                                <th>Auto-Sub</th>
                                                <th>Violations</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.filter(u => u.role !== 'admin').map(u => (
                                                <tr key={u._id}>
                                                    <td>{u.name}</td>
                                                    <td style={{fontSize:'0.85rem'}}>{u.email}</td>
                                                    <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                                                    <td>{u.latest_score !== undefined ? `${u.latest_score}%` : 'N/A'}</td>
                                                    <td>
                                                        {u.auto_submitted ? (
                                                            <span className="badge" style={{ background: '#ef4444', color: 'white' }}>Yes</span>
                                                        ) : (
                                                            <span className="badge" style={{ background: '#22c55e', color: 'white' }}>No</span>
                                                        )}
                                                    </td>
                                                    <td>{u.violations || 0}</td>
                                                    <td>
                                                        <button className="delete-btn" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'admins' && (
                            <div className="users-tab">
                                <h2 style={{marginBottom:'16px'}}>Administrators</h2>
                                <div className="table-scroll-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Admin ID</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.filter(u => u.role === 'admin').map(u => (
                                                <tr key={u._id}>
                                                    <td style={{fontSize:'0.75rem', wordBreak:'break-all'}}>{u._id}</td>
                                                    <td>{u.name}</td>
                                                    <td style={{fontSize:'0.85rem'}}>{u.email}</td>
                                                    <td>
                                                        <button className="delete-btn" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            <style>{`
                .admin-dashboard {
                    padding: 20px 16px;
                    max-width: 1200px;
                    margin: 0 auto;
                    color: #e2e8f0;
                    font-family: 'Inter', sans-serif;
                    min-height: 100vh;
                    background: #0f172a;
                }
                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    border-bottom: 1px solid #334155;
                    padding-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .admin-header h1 {
                    font-size: 1.6rem;
                    font-weight: 700;
                    margin: 0;
                }
                .admin-tabs {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                }
                .admin-tabs button {
                    padding: 9px 16px;
                    background: #1e293b;
                    border: 1px solid #334155;
                    color: #94a3b8;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: 0.9rem;
                    white-space: nowrap;
                }
                .admin-tabs button.active {
                    background: #3b82f6;
                    color: white;
                    border-color: #3b82f6;
                }
                .tab-action-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .tab-action-bar h2 {
                    margin: 0;
                    font-size: 1.2rem;
                }
                /* Scrollable table wrapper for mobile */
                .table-scroll-wrapper {
                    width: 100%;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    border-radius: 12px;
                }
                .admin-table {
                    width: 100%;
                    min-width: 600px;
                    border-collapse: collapse;
                    background: #1e293b;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                .admin-table th, .admin-table td {
                    padding: 13px 14px;
                    text-align: left;
                    border-bottom: 1px solid #334155;
                    font-size: 0.9rem;
                }
                .admin-table th {
                    background: #0f172a;
                    color: #94a3b8;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    white-space: nowrap;
                }
                .badge {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    text-transform: capitalize;
                }
                .badge.login { background: #059669; color: white; }
                .badge.register { background: #3b82f6; color: white; }
                .badge.upload_resume { background: #8b5cf6; color: white; }
                .badge.start_interview { background: #f59e0b; color: white; }
                .diff-badge {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .diff-badge.easy { color: #10b981; border: 1px solid #10b981; }
                .diff-badge.medium { color: #f59e0b; border: 1px solid #f59e0b; }
                .diff-badge.hard { color: #ef4444; border: 1px solid #ef4444; }
                .add-question-section {
                    background: #1e293b;
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 24px;
                    border: 1px solid #334155;
                }
                .add-question-section h3 {
                    margin-bottom: 16px;
                    font-size: 1.1rem;
                }
                .question-form textarea, .question-form input, .question-form select {
                    width: 100%;
                    padding: 11px;
                    margin-bottom: 14px;
                    background: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 8px;
                    color: white;
                    font-size: 0.95rem;
                }
                .form-row {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .form-row > * {
                    flex: 1;
                    min-width: 160px;
                }
                .add-btn {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 11px 22px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 0.95rem;
                }
                .delete-btn {
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    white-space: nowrap;
                }
                .text-cell {
                    max-width: 300px;
                    word-break: break-word;
                }
                .role-badge.admin { color: #8b5cf6; font-weight: bold; }

                @media (max-width: 768px) {
                    .admin-dashboard {
                        padding: 14px 10px;
                    }
                    .admin-header h1 {
                        font-size: 1.3rem;
                    }
                    .admin-tabs button {
                        padding: 8px 12px;
                        font-size: 0.82rem;
                    }
                    .admin-table th, .admin-table td {
                        padding: 10px 10px;
                        font-size: 0.82rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
