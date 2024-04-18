import express, { NextFunction, Request, Response } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { connectSocket } from "./src/utils/socket";

const port = 8080;
const app = express();
export const server = createServer(app);

connectSocket();

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const code = error.statusCode || 500;
    const msg = error.message || "Internal Server Error.";
    return res.status(code).json({
      status: "error",
      message: error.message,
    });
  }
);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
export interface CustomError extends Error {
  statusCode: number;
}
