import { NextFunction, Request, Response } from "express";
import { CustomError } from "../types";

export const ErrorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};
