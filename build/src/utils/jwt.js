"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokens = exports.verifyRefreshJWT = exports.createRefreshJWT = exports.verifyAccessJWT = exports.createAccessJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const session_query_1 = require("../query/session.query");
const user_query_1 = require("../query/user.query");
const createAccessJWT = async (email) => {
    const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: 24 * 60 * 60 * 5, //5 days duration
    });
    await (0, session_query_1.createSession)({ token, email });
    return token;
};
exports.createAccessJWT = createAccessJWT;
const verifyAccessJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
};
exports.verifyAccessJWT = verifyAccessJWT;
const createRefreshJWT = async (email) => {
    const refreshJWT = jsonwebtoken_1.default.sign({ email }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: 24 * 60 * 60 * 30, //30 days duration
    });
    await (0, user_query_1.getUserByEmailAndUpdate)(email, { refreshJWT: refreshJWT });
    return refreshJWT;
};
exports.createRefreshJWT = createRefreshJWT;
const verifyRefreshJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
};
exports.verifyRefreshJWT = verifyRefreshJWT;
const createTokens = (email) => {
    return {
        accessJWT: (0, exports.createAccessJWT)(email),
        refreshJWT: (0, exports.createRefreshJWT)(email),
    };
};
exports.createTokens = createTokens;
