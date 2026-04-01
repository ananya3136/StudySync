import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("userName", res.data.user.name);
      localStorage.setItem("userUsername", res.data.user.username);
      localStorage.setItem("userBio", res.data.user.bio || "");
      localStorage.setItem("userRole", res.data.user.role || "Student");
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '50px 40px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-30px', left: '-30px', width: '100px', height: '100px', background: 'rgba(99, 102, 241, 0.4)', filter: 'blur(50px)', borderRadius: '50%', zIndex: -1 }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(168, 85, 247, 0.3)', filter: 'blur(60px)', borderRadius: '50%', zIndex: -1 }}></div>
        
        <div style={{ textAlign: 'center', marginBottom: '40px', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', marginBottom: '24px', boxShadow: '0 12px 24px rgba(99, 102, 241, 0.3)' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
            </svg>
          </div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>StudySync</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.05rem' }}>Welcome back to your workspace</p>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="modern-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="modern-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="modern-button" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: '600' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;