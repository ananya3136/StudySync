console.log("SERVER FILE LOADED 🚀");
import app from "./app";
import { sequelize } from "./config/db";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import "./models/message.model";
import "./models/file.model";
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
sequelize.authenticate()
  .then(async () => {
    console.log("Database connected ✅");

    await sequelize.sync({ alter: true });

    server.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.log("DB Error:", err);
  });
import { Message } from "./models/message.model";
import { User } from "./models/user.model";
import { Group } from "./models/group.model";

const connectedUsers = new Map<string, { userId: string, userName: string, groupId: number }>();

io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_group", (data: any) => {
    let groupId, userId, userName;
    if (typeof data === "object") {
      groupId = data.groupId;
      userId = data.userId;
      userName = data.userName;
    } else {
      groupId = data;
      userId = "unknown";
      userName = "Anonymous";
    }

    console.log("JOIN EVENT RECEIVED:", groupId, "User:", userName);
    
    // Clear previous rooms (except their personal socket.id room)
    socket.rooms.forEach((room) => {
      if (room !== socket.id) socket.leave(room); 
    });

    socket.join(`group_${groupId}`);
    connectedUsers.set(socket.id, { userId, userName, groupId });

    // Fetch and send current notes asynchronously
    Group.findByPk(groupId).then((group: any) => {
      if (group) {
        socket.emit("load_notes", group.notes || "");
      }
    }).catch(console.error);

    // Emit updated user list to the group
    const usersInGroup = Array.from(connectedUsers.values()).filter(u => String(u.groupId) === String(groupId));
    io.to(`group_${groupId}`).emit("update_users", usersInGroup);
  });

  socket.on("typing", (data: any) => {
    socket.to(`group_${data.groupId}`).emit("user_typing", { userName: data.userName });
  });

  socket.on("stop_typing", (data: any) => {
    socket.to(`group_${data.groupId}`).emit("user_stop_typing", { userName: data.userName });
  });

  socket.on("edit_notes", async (data: any) => {
    const { groupId, content } = data;
    // Broadcast immediately for low latency
    socket.to(`group_${groupId}`).emit("receive_notes", content);
    
    // Save to database asynchronously
    try {
      await Group.update({ notes: content }, { where: { id: groupId } });
    } catch (err) {
      console.error("Error saving notes", err);
    }
  });

  socket.on("send_message", async (data) => {
    const { groupId, userId, userName, content } = data;

    const newMessage = await Message.create({
      groupId,
      userId,
      userName,
      content
    });

    io.to(`group_${groupId}`).emit("receive_message", newMessage);
  });

  socket.on("delete_message", async (data: any) => {
    const { messageId, groupId } = data;
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    try {
      const dbUser: any = await User.findByPk(user.userId);
      if (dbUser && (dbUser.role === 'Admin' || dbUser.role === 'Moderator')) {
        await Message.destroy({ where: { id: messageId } });
        io.to(`group_${groupId}`).emit("message_deleted", messageId);
      }
    } catch (err) {
      console.log("Delete msg error", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    const user = connectedUsers.get(socket.id);
    if (user) {
      connectedUsers.delete(socket.id);
      const usersInGroup = Array.from(connectedUsers.values()).filter(u => String(u.groupId) === String(user.groupId));
      io.to(`group_${user.groupId}`).emit("update_users", usersInGroup);
    }
  });
});