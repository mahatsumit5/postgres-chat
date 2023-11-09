import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
app.use(express.json());
import userRouter from "./src/router/userRouter.js";
import messageRouter from "./src/router/messageRouter.js";
import chatRoomRouter from "./src/router/chatRoomRouter.js";
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/chat-room", chatRoomRouter);

app.get("/", (req, res) => {
  res.json({
    status: true,
    data: "Welcome to the chat application API",
  });
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
