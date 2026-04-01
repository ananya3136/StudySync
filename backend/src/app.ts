import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Working ✅");
});
import authRoutes from "./routes/auth.routes";

app.use("/api/auth", authRoutes);

import userRoutes from "./routes/user.routes";

app.use("/api/user", userRoutes);
import groupRoutes from "./routes/group.routes";

app.use("/api/groups", groupRoutes);
import messageRoutes from "./routes/message.routes";

app.use("/api/messages", messageRoutes);
import uploadRoutes from "./routes/upload.routes";

app.use("/api/upload", uploadRoutes);
import testRoutes from "./routes/test.routes";

app.use("/api/test", testRoutes);
import analyticsRoutes from "./routes/analytics.routes";

app.use("/api/analytics", analyticsRoutes);
export default app;