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
import commentRouter from "./src/router/comment.router";
import { ErrorHandler } from "./src/utils/errorHandler";
import { auth } from "express-oauth2-jwt-bearer";
import { loggedInUserAuth } from "./src/middleware";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger";
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
    origin: [
      process.env.WEB_DOMAIN as string,
      "http://192.168.20.8:5173",
      "http://localhost:5173",
    ],
    methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
    allowedHeaders: ["Authorization", "refreshjwt", "Content-Type"],
    credentials: true,
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
export const server = http.createServer(app);

app.use(express.json());

// public route
app.use("/api/v1/user", publicUserRouter);

// Auth0 protected route

app.use("/api/v1/post", auth0Check, loggedInUserAuth, postRouter);
app.use("/api/v1/user", auth0Check, loggedInUserAuth, userRouter);
app.use("/api/v1/friend", auth0Check, loggedInUserAuth, friendRouter);
app.use("/api/v1/room", auth0Check, loggedInUserAuth, chatRoomRouter);
app.use("/api/v1/message", auth0Check, loggedInUserAuth, messageRouter);
app.use("/api/v1/comment", auth0Check, loggedInUserAuth, commentRouter);
app.use(ErrorHandler);

app.get("/socket.io", () => {
  connectSocket();
});

app.get("/test", (req, res) => {
  res.json({
    status: true,
    message: "Server is Healthy",
  });
});

process.env.ENVIRONMENT === "Development"
  ? server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    })
  : server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

export interface CustomError extends Error {
  statusCode: number;
}
