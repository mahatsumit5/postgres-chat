import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { config } from "dotenv";
import { connectSocket } from "./src/utils/socket";
import cors from "cors";
import userRouter from "./src/router/user.router";
import friendRouter from "./src/router/friendRequest.router";
import chatRoomRouter from "./src/router/chatRoom.router";
import messageRouter from "./src/router/message.router";
import { auth } from "./src/middleware";

config();

const port = Number(process.env.PORT) || 8080;
const app = express();
export const server = http.createServer(app);

// import path from "path";
// const _dirName = path.resolve();
// app.use(express.static(path.join(_dirName + "/dist")));
//GIVE ACCESS TO USE FILE INSIDE OF BUILD FOLDER

// app.use(
//   cors({
//     origin: [
//       process.env.WEB_DOMAIN as string,
//       "http://localhost:5173",
//       "https://daisy-ui-chat-app.vercel.app/",
//     ],
//     methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
//     allowedHeaders: ["Authorization", "refreshjwt", "Content-Type"],
//     credentials: true,
//   })
// );
app.use(cors());

app.use(express.json());

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
app.get("/", (req, res) => {
  res.json({ status: true, message: "Healthy" });
});

// app.get("/*", (req, res) => {
//   // You would typically send your HTML here
//   res.sendFile(_dirName + "/dist" + "/index.html");
// });
app.get("/socket.io", () => {
  connectSocket();
});
server.listen(port, () => {
  console.log(`Server is running on http://:${port}`);
});

export interface CustomError extends Error {
  statusCode: number;
}
