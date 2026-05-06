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
                {loading ? <p>Loading...</p> : (
                    <>
                        {activeTab === 'activity' && (
                            <div className="activity-tab">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h2>System Activity</h2>
                                    <button className="delete-btn" onClick={handleClearLogs}>Clear All Logs</button>
                                </div>
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

                                <h3>Existing Questions</h3>
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
                        )}

                        {activeTab === 'users' && (
                            <div className="users-tab">
                                <h2>Registered Users</h2>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Score</th>
                                            <th>Auto-Submitted</th>
                                            <th>Violations</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.filter(u => u.role !== 'admin').map(u => (
                                            <tr key={u._id}>
                                                <td>{u.name}</td>
                                                <td>{u.email}</td>
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
                        )}

                        {activeTab === 'admins' && (
                            <div className="users-tab">
                                <h2>Administrators</h2>
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
                                                <td>{u._id}</td>
                                                <td>{u.name}</td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <button className="delete-btn" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </main>

            <style jsx>{`
                .admin-dashboard {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                    color: #e2e8f0;
                    font-family: 'Inter', sans-serif;
                }
                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    border-bottom: 1px solid #334155;
                    padding-bottom: 20px;
                }
                .admin-tabs {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 30px;
                }
                .admin-tabs button {
                    padding: 10px 20px;
                    background: #1e293b;
                    border: 1px solid #334155;
                    color: #94a3b8;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .admin-tabs button.active {
                    background: #3b82f6;
                    color: white;
                    border-color: #3b82f6;
                }
                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: #1e293b;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                .admin-table th, .admin-table td {
                    padding: 15px;
                    text-align: left;
                    border-bottom: 1px solid #334155;
                }
                .admin-table th {
                    background: #0f172a;
                    color: #94a3b8;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.8rem;
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
                    padding: 25px;
                    border-radius: 12px;
                    margin-bottom: 30px;
                    border: 1px solid #334155;
                }
                .question-form textarea, .question-form input, .question-form select {
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 15px;
                    background: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 8px;
                    color: white;
                }
                .form-row { display: flex; gap: 15px; }
                .add-btn {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                }
                .delete-btn {
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .text-cell { max-width: 400px; }
                .role-badge.admin { color: #8b5cf6; font-weight: bold; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
