import express, { NextFunction, Request, Response } from "express";
import { createServer } from "node:http";
import { connectSocket } from "./src/utils/socket";
import cors from "cors";
connectSocket();
const port = 8080;
const app = express();
export const server = createServer(app);
app.use(cors());
app.use(express.json());
import userRouter from "./src/router/user.router";
import { getAllUsers } from "./src/query/user.query";
import friendRouter from "./src/router/friendRequest.router";
import chatRoomRouter from "./src/router/chatRoom.router";
import { auth } from "./src/middleware";
app.use("/api/v1/user", userRouter);
app.use("/api/v1/friend", auth, friendRouter);
app.use("/api/v1/room", auth, chatRoomRouter);

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const code = error.statusCode || 500;
    const msg = error.message || "Internal Server Error.";
    return res.status(code).json({
      status: false,
      message: msg,
    });
  }
);

app.get("/", async (req, res) => {
  res.json({
    status: "success",
    message: "Welcome to the chat application",
    data: await getAllUsers("mahatsumit5@gmail.com"),
  });
});
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
export interface CustomError extends Error {
  statusCode: number;
}
