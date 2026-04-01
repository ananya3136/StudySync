import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("Chat");
  const [sharedNotes, setSharedNotes] = useState("");
  const [analytics, setAnalytics] = useState({ totalUsers: 0, activeGroups: 0, messagesSent: 0 });

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const userUsername = localStorage.getItem("userUsername") || "user";
  const userBio = localStorage.getItem("userBio") || "No bio available.";
  const userRole = localStorage.getItem("userRole") || "Student";
  
  const [showProfile, setShowProfile] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        const container = messagesEndRef.current.parentNode;
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }, 100);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    fetchGroups();

    // Fetch analytics
    axios.get("http://localhost:5000/api/analytics", {
      headers: { Authorization: token }
    }).then(res => setAnalytics(res.data)).catch(console.error);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("update_users", (users) => {
      const uniqueUsers = Array.from(new Map(users.map(u => [u.userId, u])).values());
      setOnlineUsers(uniqueUsers);
    });

    socket.on("user_typing", (data) => {
      setTypingUsers(prev => prev.includes(data.userName) ? prev : [...prev, data.userName]);
    });

    socket.on("user_stop_typing", (data) => {
      setTypingUsers(prev => prev.filter(name => name !== data.userName));
    });

    socket.on("message_deleted", (msgId) => {
      setMessages(prev => prev.filter(msg => msg.id !== msgId));
    });

    socket.on("load_notes", (notes) => {
      setSharedNotes(notes);
    });

    socket.on("receive_notes", (content) => {
      setSharedNotes(content);
    });

    return () => {
      socket.off("receive_message");
      socket.off("update_users");
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.off("message_deleted");
      socket.off("load_notes");
      socket.off("receive_notes");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedGroup]);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups", {
        headers: { Authorization: token }
      });
      setGroups(res.data);
      if (res.data.length > 0 && !selectedGroup) {
        handleGroupSelect(res.data[0].id);
      }
    } catch (error) {
      console.log("Failed to fetch groups", error);
    }
  };

  const handleGroupSelect = async (id) => {
    setSelectedGroup(id);
    socket.emit("join_group", { groupId: id, userId, userName: userUsername });
    setTypingUsers([]);
    setSharedNotes("");

    // Load chat history from DB
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${id}`, {
        headers: { Authorization: token }
      });
      setMessages(res.data);
    } catch (err) {
      console.log("Failed to load chat history", err);
      setMessages([]);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/api/groups/create",
        { name: newGroupName, description: "Dynamic user group" },
        { headers: { Authorization: token } }
      );
      setNewGroupName("");
      setIsCreatingGroup(false);
      await fetchGroups();
      handleGroupSelect(res.data.id); // Auto join new group
    } catch (err) {
      alert("Failed to create group");
    }
  };

  const sendMessage = (e) => {
    e?.preventDefault();
    if (!selectedGroup || !message.trim()) return;

    socket.emit("stop_typing", { groupId: selectedGroup, userName: userUsername });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    const data = {
      groupId: selectedGroup,
      userId: userId,
      userName: userUsername,
      content: message
    };

    socket.emit("send_message", data);
    setMessage("");
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (!selectedGroup) return;

    socket.emit("typing", { groupId: selectedGroup, userName: userUsername });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { groupId: selectedGroup, userName: userUsername });
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const deleteMessage = (msgId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      socket.emit("delete_message", { messageId: msgId, groupId: selectedGroup });
    }
  };

  const activeGroup = groups.find(g => g.id === selectedGroup);

  return (
    <div style={{ display: 'flex', height: '100vh', padding: '20px', gap: '20px', boxSizing: 'border-box' }}>

      {/* Sidebar */}
      <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>Channels</h2>
          {userRole === 'Admin' && (
            <button
              onClick={() => setIsCreatingGroup(!isCreatingGroup)}
              style={{
                background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-main)',
                width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.target.style.background = 'transparent'}
            >
              {isCreatingGroup ? '×' : '+'}
            </button>
          )}
        </div>

        {isCreatingGroup && userRole === 'Admin' && (
          <form onSubmit={handleCreateGroup} style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
            <input
              autoFocus
              className="modern-input"
              placeholder="New group name..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              style={{ marginBottom: '10px', padding: '8px 12px' }}
            />
            <button type="submit" className="modern-button" style={{ padding: '8px' }}>Create Group</button>
          </form>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {groups.length === 0 && !isCreatingGroup ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px', fontSize: '0.9rem' }}>
              No channels yet. Click + to create one.
            </div>
          ) : null}

          {groups.map((g) => (
            <div
              key={g.id}
              onClick={() => handleGroupSelect(g.id)}
              style={{
                cursor: 'pointer',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '6px',
                background: selectedGroup === g.id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                color: selectedGroup === g.id ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontWeight: selectedGroup === g.id ? '600' : '500',
                boxShadow: selectedGroup === g.id ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
              }}
              onMouseOver={(e) => { if (selectedGroup !== g.id) { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.color = '#fff' } }}
              onMouseOut={(e) => { if (selectedGroup !== g.id) { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-muted)' } }}
            >
              # {g.name}
            </div>
          ))}
        </div>

        <div 
          onClick={() => setShowProfile(true)}
          style={{ padding: '20px', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {userName?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{userName}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{userUsername}</div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}
            title="Logout"
          >
            🚪
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        {selectedGroup ? (
          <>
            <div style={{ padding: '15px 30px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.1)' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '600' }}>#{activeGroup?.name}</h2>
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '4px' }}>
                <button
                  onClick={() => setActiveTab('Chat')}
                  style={{
                    padding: '8px 24px', border: 'none', background: activeTab === 'Chat' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                    color: activeTab === 'Chat' ? '#fff' : 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', fontSize: '0.9rem'
                  }}
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => setActiveTab('Notes')}
                  style={{
                    padding: '8px 24px', border: 'none', background: activeTab === 'Notes' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                    color: activeTab === 'Notes' ? '#fff' : 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', fontSize: '0.9rem'
                  }}
                >
                  📝 Shared Notes
                </button>
              </div>
            </div>

            {activeTab === 'Chat' ? (
              <>
                <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.length === 0 && (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👋</div>
                  <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>Welcome to #{activeGroup?.name}!</h3>
                  <p style={{ margin: 0 }}>This is the start of the conversation.</p>
                </div>
              )}

              {messages.map((msg, index) => {
                const isMe = String(msg.userId) === String(userId);
                return (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', maxWidth: '70%', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                      {!isMe && (
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {(msg.userName || `U${msg.userId}`).charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', position: 'relative' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: isMe ? 'var(--accent-color)' : 'var(--text-muted)', fontWeight: '500' }}>
                            {isMe ? 'You' : (msg.userName ? `@${msg.userName}` : `User ${msg.userId}`)}
                          </span>
                          {(userRole === 'Moderator' || userRole === 'Admin') && (
                            <span 
                              onClick={() => deleteMessage(msg.id)}
                              style={{ cursor: 'pointer', fontSize: '0.8rem', opacity: 0.6, transition: 'opacity 0.2s' }}
                              title="Delete Message"
                              onMouseOver={(e) => e.target.style.opacity = 1}
                              onMouseOut={(e) => e.target.style.opacity = 0.6}
                            >
                              🗑️
                            </span>
                          )}
                        </div>
                        <div 
                          className={`message-bubble ${isMe ? 'is-me' : 'is-other'}`}
                          style={{
                          padding: '12px 16px',
                          borderRadius: '16px',
                          borderBottomRightRadius: isMe ? '4px' : '16px',
                          borderBottomLeftRadius: !isMe ? '4px' : '16px',
                          background: isMe ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255, 255, 255, 0.08)',
                          color: '#fff',
                          boxShadow: isMe ? '0 4px 12px rgba(99, 102, 241, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                          wordBreak: 'break-word',
                          lineHeight: '1.5',
                          border: isMe ? 'none' : '1px solid rgba(255,255,255,0.05)'
                        }}>
                          {msg.content}
                        </div>
                        {msg.createdAt && (
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', opacity: 0.7 }}>
                            {new Date(msg.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {typingUsers.length > 0 && (
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontStyle: 'italic', margin: '4px 0 10px 10px' }}>
                   {typingUsers.length === 1 
                     ? `${typingUsers[0]} is typing...` 
                     : typingUsers.length === 2 
                       ? `${typingUsers[0]} and ${typingUsers[1]} are typing...`
                       : 'Several people are typing...'}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--glass-border)' }}>
              <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
                <input
                  className="modern-input"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                  placeholder={`Message #${activeGroup?.name}...`}
                  value={message}
                  onChange={handleMessageChange}
                />
                <button type="submit" className="modern-button" style={{ width: 'auto', padding: '0 24px' }}>
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontWeight: '600', fontSize: '1.2rem', color: 'var(--text-main)' }}>Study Notes</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)' }}>● Syncing live with group</span>
            </div>
            <textarea
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '24px',
                color: 'var(--text-main)',
                fontSize: '1.05rem',
                lineHeight: '1.6',
                resize: 'none',
                outline: 'none',
                fontFamily: 'var(--font-main)',
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
              }}
              placeholder="Start typing study notes here... Everyone in the group will see this live."
              value={sharedNotes}
              onChange={(e) => {
                setSharedNotes(e.target.value);
                socket.emit("edit_notes", { groupId: selectedGroup, content: e.target.value });
              }}
            />
          </div>
        )}
      </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>📊</div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.8rem', fontWeight: '700', background: 'linear-gradient(135deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard Analytics</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem' }}>Your StudySync platform at a glance</p>
            </div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { label: 'Total Users', value: analytics.totalUsers, icon: '👥', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
                { label: 'Active Groups', value: analytics.activeGroups, icon: '📚', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
                { label: 'Messages Sent', value: analytics.messagesSent, icon: '💬', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' }
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '30px 40px',
                  minWidth: '180px',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default'
                }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)'; }}
                >
                  <div style={{ fontSize: '2.2rem', marginBottom: '10px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', background: stat.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '6px' }}>{stat.value}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: '30px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Select a channel from the sidebar to start collaborating.</p>
          </div>
        )}
      </div>

      {/* Active Users Sidebar */}
      {selectedGroup && (
        <div className="glass-panel" style={{ width: '250px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>Online — {onlineUsers.length}</h2>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {onlineUsers.map((u, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '12px', transition: 'background 0.2s', cursor: 'default' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: 'white' }}>
                    {u.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ position: 'absolute', bottom: '0', right: '-2px', width: '10px', height: '10px', background: '#10b981', border: '2px solid #0f172a', borderRadius: '50%' }}></div>
                </div>
                <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.9rem', fontWeight: '500' }}>
                  {u.userName} {String(u.userId) === String(userId) ? '(You)' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowProfile(false)}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '400px', padding: '40px', textAlign: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowProfile(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
              {userName?.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ margin: '0 0 5px', fontSize: '1.8rem' }}>{userName}</h2>
            <div style={{ color: 'var(--accent-color)', fontWeight: '500', marginBottom: '20px' }}>@{userUsername}</div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Bio</div>
              <div style={{ lineHeight: '1.5', fontSize: '0.95rem' }}>{userBio}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;