import { getUserByEmail } from "../queries/userModel.js";
import { verifyAccessJWt } from "../utils/jwt.js";

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
  } catch (error) {
    if (error.message.includes("jwt expired")) {
      error.statusCode = 403;
      error.message = "Your session has expired. Please login Again.";
    }
    next(error);
  }
};
