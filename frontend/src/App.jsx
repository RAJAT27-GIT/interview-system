import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Interview from './pages/Interview'
import ResumeBuilder from './pages/ResumeBuilder'
import ResumeCheck from './pages/ResumeCheck'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return(
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/interview" element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            } />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/resume-check" element={<ResumeCheck />} />
            
            {/* Admin Route */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
