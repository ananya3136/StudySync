import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");

  useEffect(() => {
    if (!token || userRole !== 'Admin') { navigate("/dashboard"); return; }
    fetchData();
  }, [token, userRole, navigate]);

  const fetchData = () => {
    axios.get("http://localhost:5000/api/user/all", { headers: { Authorization: token } }).then(res => setUsers(res.data)).catch(console.error);
    axios.get("http://localhost:5000/api/groups", { headers: { Authorization: token } }).then(res => setGroups(res.data)).catch(console.error);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await axios.delete(`http://localhost:5000/api/user/${id}`, { headers: { Authorization: token } });
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const deleteGroup = async (id) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    await axios.delete(`http://localhost:5000/api/groups/${id}`, { headers: { Authorization: token } });
    setGroups(prev => prev.filter(g => g.id !== id));
  };

  const createGroup = async (e) => {
    e.preventDefault();
    if (!newGroup.trim()) return;
    await axios.post("http://localhost:5000/api/groups/create", { name: newGroup }, { headers: { Authorization: token } });
    setNewGroup("");
    fetchData();
  };

  const roleBadge = { Admin: '#ef4444', Moderator: '#3b82f6', Student: '#8b5cf6' };

  return (
    <div style={{ minHeight: '100vh', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1100px' }}>
        <button onClick={() => navigate("/dashboard")} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '30px', padding: 0 }}>← Back to Dashboard</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
          <span style={{ fontSize: '2rem' }}>⚙️</span>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '700', background: 'linear-gradient(135deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin Panel</h1>
        </div>

        {/* Users Table */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', fontWeight: '600' }}>👥 All Users ({users.length})</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  {['ID', 'Name', 'Username', 'Email', 'Role', 'Joined', 'Action'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user.id}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>{user.name}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>@{user.username}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user.email}</td>
                    <td style={{ padding: '14px 16px' }}><span style={{ padding: '3px 11px', borderRadius: '12px', background: roleBadge[user.role], fontSize: '0.75rem', fontWeight: '600', color: '#fff' }}>{user.role}</span></td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => deleteUser(user.id)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' }}
                        onMouseOver={(e) => e.target.style.background = 'rgba(239,68,68,0.2)'}
                        onMouseOut={(e) => e.target.style.background = 'rgba(239,68,68,0.1)'}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Groups Management */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', fontWeight: '600' }}>📚 All Groups ({groups.length})</h2>
          <form onSubmit={createGroup} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input className="modern-input" placeholder="New group name..." value={newGroup} onChange={e => setNewGroup(e.target.value)} style={{ flex: 1 }} />
            <button type="submit" className="modern-button" style={{ width: 'auto', padding: '0 24px' }}>Create Group</button>
          </form>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '14px' }}>
            {groups.map(group => (
              <div key={group.id} style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>#{group.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{group.description || "No description"}</span>
                </div>
                <button onClick={() => deleteGroup(group.id)} style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem' }}>🗑️</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
