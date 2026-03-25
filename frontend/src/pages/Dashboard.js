import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchGroups();

    socket.on("receive_message", (data) => {
      console.log("Message:", data);
    });
  }, []);

  const fetchGroups = async () => {
    const res = await axios.get("http://localhost:5000/api/groups", {
      headers: { Authorization: token }
    });
    setGroups(res.data);
  };

  const sendMessage = () => {
    socket.emit("send_message", {
      groupId: 1,
      userId: 1,
      content: message
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      <h3>Groups</h3>
      {groups.map((g) => (
        <div key={g.id}>{g.name}</div>
      ))}

      <h3>Chat</h3>
      <input onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Dashboard;