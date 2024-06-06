"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const socket_1 = require("./src/utils/socket");
const cors_1 = __importDefault(require("cors"));
const port = 8080;
const app = (0, express_1.default)();
exports.server = http_1.default.createServer(app);
(0, socket_1.connectSocket)();
// app.use(
//   cors({
//     origin: process.env.WEB_DOMAIN as string,
//     methods: "GET, PUT, PATCH, DELETE, POST",
//     allowedHeaders: ["authorization", "refreshjwt"],
//     // credentials: true,
//   })
// );
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const user_router_1 = __importDefault(require("./src/router/user.router"));
const friendRequest_router_1 = __importDefault(require("./src/router/friendRequest.router"));
const chatRoom_router_1 = __importDefault(require("./src/router/chatRoom.router"));
const message_router_1 = __importDefault(require("./src/router/message.router"));
const middleware_1 = require("./src/middleware");
app.use("/api/v1/user", user_router_1.default);
app.use("/api/v1/friend", middleware_1.auth, friendRequest_router_1.default);
app.use("/api/v1/room", middleware_1.auth, chatRoom_router_1.default);
app.use("/api/v1/message", middleware_1.auth, message_router_1.default);
app.use((error, req, res, next) => {
    const code = error.statusCode || 500;
    const msg = error.message || "Internal Server Error.";
    return res.status(code).json({
        status: false,
        message: msg,
    });
});
app.get("/", async (req, res) => {
    res.json({
        status: "success",
        message: "Welcome to the chat application",
    });
});
exports.server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
