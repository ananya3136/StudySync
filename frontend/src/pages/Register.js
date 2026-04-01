import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        username,
        email,
        password,
        role
      });

      alert("Registered successfully ✅");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>Join StudySync</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.05rem' }}>Create your free account today</p>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="modern-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Username</label>
            <input
              type="text"
              placeholder="e.g. johndoe"
              className="modern-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
              minLength={4}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Account Role</label>
            <select
              className="modern-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ appearance: 'none', background: 'rgba(0,0,0,0.25) url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 15px center/10px' }}
            >
              <option value="Student" style={{ background: '#1e1b4b' }}>Student</option>
              <option value="Moderator" style={{ background: '#1e1b4b' }}>Moderator</option>
              <option value="Admin" style={{ background: '#1e1b4b' }}>Admin</option>
            </select>
          </div>

          <button type="submit" className="modern-button" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/" style={{ fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;