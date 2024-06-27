"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = require("dotenv");
const socket_1 = require("./src/utils/socket");
const cors_1 = __importDefault(require("cors"));
const user_router_1 = __importDefault(require("./src/router/user.router"));
const friendRequest_router_1 = __importDefault(require("./src/router/friendRequest.router"));
const chatRoom_router_1 = __importDefault(require("./src/router/chatRoom.router"));
const message_router_1 = __importDefault(require("./src/router/message.router"));
const middleware_1 = require("./src/middleware");
(0, dotenv_1.config)();
const port = Number(process.env.PORT) || 8080;
const app = (0, express_1.default)();
exports.server = http_1.default.createServer(app);
// import path from "path";
// const _dirName = path.resolve();
// app.use(express.static(path.join(_dirName + "/dist")));
//GIVE ACCESS TO USE FILE INSIDE OF BUILD FOLDER
app.use((0, cors_1.default)({
    origin: [
        process.env.WEB_DOMAIN,
        "http://localhost:5173",
        "https://daisy-ui-chat-app.vercel.app/",
    ],
    methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
    allowedHeaders: ["Authorization", "refreshjwt", "Content-Type"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api/v1/user", user_router_1.default);
app.use("/api/v1/friend", middleware_1.auth, friendRequest_router_1.default);
app.use("/api/v1/room", middleware_1.auth, chatRoom_router_1.default);
app.use("/api/v1/message", middleware_1.auth, message_router_1.default);
app.use((error, req, res, next) => {
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
});
app.get("/", (req, res) => {
    res.json({ status: true, message: "Healthy" });
});
// app.get("/*", (req, res) => {
//   // You would typically send your HTML here
//   res.sendFile(_dirName + "/dist" + "/index.html");
// });
app.get("/socket.io", () => {
    (0, socket_1.connectSocket)();
});
exports.server.listen(port, () => {
    console.log(`Server is running on http://:${port}`);
});
