import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NotesHub() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    axios.get("http://localhost:5000/api/groups", {
      headers: { Authorization: token }
    }).then(res => setGroups(res.data)).catch(console.error);
  }, [token, navigate]);

  return (
    <div style={{ minHeight: '100vh', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '900px' }}>
        <button onClick={() => navigate("/dashboard")} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '30px', padding: 0 }}>← Back to Dashboard</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
          <span style={{ fontSize: '2rem' }}>📝</span>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '700', background: 'linear-gradient(135deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shared Notes Hub</h1>
        </div>

        {groups.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.5 }}>📂</div>
            <p style={{ color: 'var(--text-muted)' }}>No groups found. Join a study room to start collaborating!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {groups.map(group => (
              <div key={group.id} className="glass-panel" style={{ padding: '24px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onClick={() => navigate("/chat")}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)' }}>#{group.name}</h3>
                  <span style={{ fontSize: '1.2rem' }}>📝</span>
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{group.description || "No description"}</p>
                <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', maxHeight: '80px', overflow: 'hidden' }}>
                  {group.notes ? group.notes.substring(0, 150) + (group.notes.length > 150 ? '...' : '') : 'No notes yet. Click to start editing!'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesHub;
