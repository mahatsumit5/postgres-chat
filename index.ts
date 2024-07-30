import express from "express";
import http from "http";
import { config } from "dotenv";
import { connectSocket } from "./src/utils/socket";
import cors from "cors";
import publicUserRouter from "./src/router/public.router";
import userRouter from "./src/router/user.router";
import friendRouter from "./src/router/friendRequest.router";
import chatRoomRouter from "./src/router/chatRoom.router";
import messageRouter from "./src/router/message.router";
import postRouter from "./src/router/post.router";
import { ErrorHandler } from "./src/utils/errorHandler";
import { auth } from "express-oauth2-jwt-bearer";
import { loggedInUserAuth } from "./src/middleware";
import path from "path";
config();
export const auth0Check = auth({
  audience: process.env.audience,
  issuerBaseURL: process.env.issuerBaseURL,
});
export const sessions: Record<string, string> = {};

const port = Number(process.env.PORT) || 8080;
const app = express();
app.use(
  cors({
    origin: [process.env.WEB_DOMAIN as string, "http://localhost:5173"],
    methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
    allowedHeaders: ["Authorization", "refreshjwt", "Content-Type"],
    credentials: true,
  })
);
export const server = http.createServer(app);
app.use("/", express.static(path.join(__dirname, "../dist")));

app.use(express.json());

app.use("/api/v1/post", auth0Check, postRouter);
app.use("/api/v1/user", publicUserRouter);
app.use("/api/v1/user", auth0Check, loggedInUserAuth, userRouter);
app.use("/api/v1/friend", auth0Check, loggedInUserAuth, friendRouter);
app.use("/api/v1/room", auth0Check, loggedInUserAuth, chatRoomRouter);
app.use("/api/v1/message", auth0Check, loggedInUserAuth, messageRouter);
app.use(ErrorHandler);
app.get("/socket.io", () => {
  connectSocket();
});
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"), (err) => {
    err && res.send(`<h1>Unexpected Error Occured</h1>`);
  });
});
process.env.ENVIRONMENT === "Development"
  ? server.listen(port, "192.168.20.8", () => {
      console.log(`Server is running on http://192.168.20.8:${port}`);
    })
  : server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

export interface CustomError extends Error {
  statusCode: number;
}
