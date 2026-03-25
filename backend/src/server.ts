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

    await sequelize.sync();

    server.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.log("DB Error:", err);
  });
import { Message } from "./models/message.model";

io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_group", (groupId: number) => {
    console.log("JOIN EVENT RECEIVED:", groupId);
    socket.join(`group_${groupId}`);
  });

  socket.on("send_message", async (data: any) => {
    console.log("MESSAGE RECEIVED:", data);

    const { groupId, userId, content } = data;

    const message = await Message.create({
      content,
      userId,
      groupId
    });

    io.to(`group_${groupId}`).emit("receive_message", message);
  });
});