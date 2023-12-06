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
import { connectSocket } from "./src/utils/socket.js";
import { createAccessJWT } from "./src/utils/jwt.js";
import { auth, refreshAccessJWT } from "./src/middleware/authMiddleware.js";
connectSocket();
const __dirname = path.resolve();

// convert public to static
app.use(express.static(path.join(__dirname, "public", "dist")));
app.use(express.static("public"));
// api
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", auth, messageRouter);
app.use("/api/v1/chat-room", auth, chatRoomRouter);
app.use("/api/v1/friend-request", auth, friendRequestRouter);
createAccessJWT("mahatsumit5@gmail.com");

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dist", "index.html"));
});

app.get("/get-refreshAccessJWT", refreshAccessJWT);
app.use((error, req, res, next) => {
  const code = error.statusCode || 500;
  res.status(code).json({
    status: "error",
    message: error.message,
  });
});
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
