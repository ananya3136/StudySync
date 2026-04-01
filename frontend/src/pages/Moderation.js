import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Moderation() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!token || (userRole !== 'Admin' && userRole !== 'Moderator')) { navigate("/dashboard"); return; }
    fetchMessages();
  }, [token, userRole, navigate]);

  const fetchMessages = () => {
    axios.get("http://localhost:5000/api/messages", {
      headers: { Authorization: token }
    }).then(res => setMessages(res.data)).catch(console.error);
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    await axios.delete(`http://localhost:5000/api/messages/${id}`, { headers: { Authorization: token } });
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        <button onClick={() => navigate("/dashboard")} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '30px', padding: 0 }}>← Back to Dashboard</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
          <span style={{ fontSize: '2rem' }}>🛡️</span>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '700', background: 'linear-gradient(135deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Moderation Panel</h1>
          <span style={{ marginLeft: 'auto', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{messages.length} messages</span>
        </div>

        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  {['ID', 'Group', 'User', 'Content', 'Sent At', 'Action'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => (
                  <tr key={msg.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{msg.id}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--accent-color)' }}>#{msg.groupId}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '500' }}>{msg.userName || `User ${msg.userId}`}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.9rem', color: 'var(--text-main)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.content}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(msg.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => deleteMessage(msg.id)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' }}
                        onMouseOver={(e) => e.target.style.background = 'rgba(239,68,68,0.2)'}
                        onMouseOut={(e) => e.target.style.background = 'rgba(239,68,68,0.1)'}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px', opacity: 0.5 }}>✅</div>
              <p>No messages to moderate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Moderation;
