import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", username: "", bio: "" });

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    axios.get("http://localhost:5000/api/user/profile", {
      headers: { Authorization: token }
    }).then(res => {
      setProfile(res.data);
      setForm({ name: res.data.name, username: res.data.username || "", bio: res.data.bio || "" });
    }).catch(console.error);
  }, [token, navigate]);

  const handleSave = async () => {
    try {
      const res = await axios.put("http://localhost:5000/api/user/profile", form, {
        headers: { Authorization: token }
      });
      setProfile(res.data);
      setEditing(false);
      localStorage.setItem("userName", form.name);
      localStorage.setItem("userUsername", form.username);
      localStorage.setItem("userBio", form.bio);
    } catch (err) {
      alert("Error updating profile");
    }
  };

  const roleBadge = { Admin: '#ef4444', Moderator: '#3b82f6', Student: '#8b5cf6' };

  if (!profile) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '700px' }}>
        <button onClick={() => navigate("/dashboard")} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '30px', padding: 0 }}>← Back to Dashboard</button>

        <div className="glass-panel" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '700', color: '#fff', boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}>
              {profile.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 style={{ margin: '0 0 4px 0', fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-main)' }}>{profile.name}</h1>
              <p style={{ margin: '0 0 6px 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>@{profile.username}</p>
              <span style={{ padding: '4px 14px', borderRadius: '20px', background: roleBadge[profile.role], fontSize: '0.75rem', fontWeight: '600', color: '#fff' }}>{profile.role}</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px' }}>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full Name</label>
                  <input className="modern-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Username</label>
                  <input className="modern-input" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bio</label>
                  <textarea className="modern-input" rows={3} style={{ resize: 'none' }} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleSave} className="modern-button" style={{ width: 'auto', padding: '10px 28px' }}>Save Changes</button>
                  <button onClick={() => setEditing(false)} style={{ padding: '10px 28px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1rem', color: 'var(--text-main)' }}>{profile.email}</p>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bio</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1rem', color: 'var(--text-main)' }}>{profile.bio || "No bio set"}</p>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Member Since</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1rem', color: 'var(--text-main)' }}>{new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <button onClick={() => setEditing(true)} className="modern-button" style={{ width: 'auto', padding: '10px 28px' }}>Edit Profile</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
