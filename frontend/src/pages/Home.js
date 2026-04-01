import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "Student";
  const userUsername = localStorage.getItem("userUsername") || "user";

  const [analytics, setAnalytics] = useState({ totalUsers: 0, activeGroups: 0, messagesSent: 0 });

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    axios.get("http://localhost:5000/api/analytics", {
      headers: { Authorization: token }
    }).then(res => setAnalytics(res.data)).catch(console.error);
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const roleBadgeColor = {
    Admin: 'linear-gradient(135deg, #ef4444, #f59e0b)',
    Moderator: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    Student: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
  };

  const navItems = [
    { label: '💬 Study Rooms & Chat', desc: 'Join groups, collaborate in real-time', path: '/chat', color: '#6366f1' },
    { label: '📝 Shared Notes', desc: 'Browse all group study notes', path: '/notes', color: '#8b5cf6' },
    { label: '👤 My Profile', desc: 'View and update your profile', path: '/profile', color: '#06b6d4' }
  ];

  if (userRole === 'Admin') {
    navItems.push({ label: '⚙️ Admin Panel', desc: 'Manage users, create & delete groups', path: '/admin', color: '#ef4444' });
  }
  if (userRole === 'Moderator' || userRole === 'Admin') {
    navItems.push({ label: '🛡️ Moderation', desc: 'Review and delete messages', path: '/moderation', color: '#f59e0b' });
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '700', background: 'linear-gradient(135deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>StudySync</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Welcome back, {userName}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ padding: '6px 16px', borderRadius: '20px', background: roleBadgeColor[userRole], fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>{userRole}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>@{userUsername}</span>
          <button onClick={handleLogout} style={{ padding: '8px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' }}
            onMouseOver={(e) => e.target.style.background = 'rgba(239,68,68,0.2)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
          >Logout</button>
        </div>
      </div>

      {/* Analytics Section */}
      <div style={{ width: '100%', maxWidth: '1100px', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '24px', color: 'var(--text-main)' }}>📊 Platform Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            { label: 'Total Users', value: analytics.totalUsers, icon: '👥', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
            { label: 'Active Groups', value: analytics.activeGroups, icon: '📚', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
            { label: 'Messages Sent', value: analytics.messagesSent, icon: '💬', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' }
          ].map((stat, i) => (
            <div key={i} className="glass-panel" style={{
              padding: '28px', textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default'
            }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', background: stat.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Cards */}
      <div style={{ width: '100%', maxWidth: '1100px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '24px', color: 'var(--text-main)' }}>🚀 Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {navItems.map((item, i) => (
            <div key={i} className="glass-panel" onClick={() => navigate(item.path)} style={{
              padding: '28px', cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
              borderLeft: `3px solid ${item.color}`
            }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3)`; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
            >
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)' }}>{item.label}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
