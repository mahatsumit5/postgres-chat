import { NextFunction, Request, Response } from "express";
import { verifyAccessJWT } from "../utils/jwt";
import { getUserByEmail } from "../query/user.query";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.json({
        status: "error",
        message: "Not authorized",
      });
    }
    const decoded = verifyAccessJWT(authorization);

    if (decoded?.email) {
      const user = await getUserByEmail(decoded.email);
      if (user?.id) {
        user.password = undefined;
        user.refreshJWT = undefined;
        req.userInfo = user;
        return next();
      }
    }
  } catch (error: Error | any) {
    if (error.message.includes("jwt expired")) {
      error.statusCode = 403;
      error.message = "Your session has expired. Please login Again.";
    }
    next(error);
  }
};
