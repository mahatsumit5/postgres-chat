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
app.use("/api/v1/users", userRouter);

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const code = error.statusCode || 500;
    const msg = error.message || "Internal Server Error.";
    return res.status(code).json({
      status: "error",
      message: msg,
    });
  }
);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Welcome to the User",
  });
});
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
export interface CustomError extends Error {
  statusCode: number;
}
