"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jwt_1 = require("../utils/jwt");
const user_query_1 = require("../query/user.query");
const auth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.json({
                status: "error",
                message: "Not authorized",
            });
        }
        const decoded = (0, jwt_1.verifyAccessJWT)(authorization);
        if (decoded?.email) {
            const user = await (0, user_query_1.getUserByEmail)(decoded.email);
            if (user?.id) {
                user.password = undefined;
                user.refreshJWT = undefined;
                req.userInfo = user;
                return next();
            }
        }
    }
    catch (error) {
        if (error.message.includes("jwt expired")) {
            error.statusCode = 403;
            error.message = "Your session has expired. Please login Again.";
        }
        next(error);
    }
};
exports.auth = auth;
