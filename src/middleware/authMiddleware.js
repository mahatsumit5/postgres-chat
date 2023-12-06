import { getUserByEmail } from "../queries/userModel.js";
import {
  createAccessJWT,
  veifyRefreshAuth,
  verifyAccessJWt,
} from "../utils/jwt.js";

export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.json({
        status: "error",
        message: "Your are not Authorised.Please provide JWT token",
      });
    }
    const decoded = verifyAccessJWt(authorization);

    if (decoded?.email) {
      const user = await getUserByEmail(decoded.email);
      if (user?.id) {
        user.password = undefined;
        user.refreshJWT = undefined;
        req.userInfo = user;
        return next();
      }
    }
    console.log(decoded, "from jwt");
  } catch (error) {
    if (error.message.includes("jwt expired")) {
      error.statusCode = 403;
      error.message = "Your session has expired. Please login Again.";
    }
    next(error);
  }
};

export const refreshAccessJWT = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const decoded = veifyRefreshAuth(authorization);
    if (decoded?.email) {
      const user = await getUserByEmail(decoded.email);
      if (user?.id) {
        let accessJWT = await createAccessJWT(user);
        return res.json({
          status: "success",
          accessJWT,
        });
      }
    }
    res.json({
      status: "error",
      message: "Invalid Refresh Token.",
    });
  } catch (error) {
    next(error);
  }
};
