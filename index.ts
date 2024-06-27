import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { config } from "dotenv";
config();
import { connectSocket } from "./src/utils/socket";
import cors from "cors";
const port = 8080;
const app = express();
export const server = http.createServer(app);

connectSocket();

app.use(
  cors({
    origin: [process.env.WEB_DOMAIN as string],
    methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
    allowedHeaders: ["Authorization", "refreshjwt", "Content-Type"],
    credentials: true,
  })
);

const ip =
  process.env.ENVIRONMENT === "Development" ? "192.168.20.8" : "0.0.0.0";

app.use(express.json());
import userRouter from "./src/router/user.router";
import friendRouter from "./src/router/friendRequest.router";
import chatRoomRouter from "./src/router/chatRoom.router";
import messageRouter from "./src/router/message.router";
import { auth, timeout } from "./src/middleware";
app.use("/api/v1/user", userRouter);
app.use("/api/v1/friend", auth, friendRouter);
app.use("/api/v1/room", auth, chatRoomRouter);
app.use("/api/v1/message", auth, messageRouter);

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    if (error.message.includes(`"password" with value`)) {
      error.message = "Password must match the include special characters";
    }
    const code = error.statusCode || 500;
    const msg = error.message || "Internal Server Error.";
    return res.status(code).json({
      status: false,
      message: msg,
    });
  }
);

app.get("/", async (req, res) => {
  req.setTimeout(100);
  res.json({
    status: "success",
    message: "Welcome to the chat application",
  });
});
server.listen(port, ip, () => {
  console.log(`Server is running on http://${ip}:${port}`);
});

export interface CustomError extends Error {
  statusCode: number;
}
