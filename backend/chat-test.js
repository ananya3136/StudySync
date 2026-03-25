const io = require("socket.io-client");

const socket = io("http://localhost:5000");

// 🔥 check connection
socket.on("connect", () => {
  console.log("Connected to server:", socket.id);

  // join group AFTER connection
  socket.emit("join_group", 1);

  console.log("Joined group 1");

  // send message
  setTimeout(() => {
    console.log("Sending message...");
    
    socket.emit("send_message", {
      groupId: 1,
      userId: 1,
      content: "Hello group chat 🚀"
    });
  }, 2000);
});

// receive message
socket.on("receive_message", (data) => {
  console.log("Received:", data);
});