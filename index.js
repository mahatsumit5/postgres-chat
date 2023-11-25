import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
export const httpServer = createServer(app);
app.use(cors());
app.use(express.json());
import userRouter from "./src/router/userRouter.js";
import messageRouter from "./src/router/messageRouter.js";
import chatRoomRouter from "./src/router/chatRoomRouter.js";
import friendRequestRouter from "./src/router/friendRequestsRouter.js";

import path from "path";

const __dirname = path.resolve();
console.log(__dirname);
// convert public to static
app.use(express.static(path.join(__dirname, "public", "dist")));
// api
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/chat-room", chatRoomRouter);
app.use("/api/v1/friend-request", friendRequestRouter);

const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://vite-chat-app-lake.vercel.app"]
        : ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });
  socket.on("disconnect", () => {});
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dist", "index.html"));
});
app.use((error, req, res) => {
  const code = error.statusCode || 500;
  res.status(code).json({
    status: "error",
    message: error.message,
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
