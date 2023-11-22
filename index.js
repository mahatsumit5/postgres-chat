import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
const httpServer = createServer(app);
app.use(cors());
app.use(express.json());
import userRouter from "./src/router/userRouter.js";
import messageRouter from "./src/router/messageRouter.js";
import chatRoomRouter from "./src/router/chatRoomRouter.js";
import { getAllSession } from "./src/queries/sessionModel.js";
import { generateToken } from "./src/utils/tokenGenerator.js";
import { changePassword } from "./src/queries/userModel.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/chat-room", chatRoomRouter);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  socket.on("send_message", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_message", data);
  });
  socket.on("disconnect", () => {});
});
app.get("/", (req, res) => {
  res.json({
    status: true,
    data: "Welcome to the chat application API",
  });
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
