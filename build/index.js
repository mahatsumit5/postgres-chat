"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.sessions = exports.auth0Check = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = require("dotenv");
const socket_1 = require("./src/utils/socket");
const cors_1 = __importDefault(require("cors"));
const public_router_1 = __importDefault(require("./src/router/public.router"));
const user_router_1 = __importDefault(require("./src/router/user.router"));
const friendRequest_router_1 = __importDefault(require("./src/router/friendRequest.router"));
const chatRoom_router_1 = __importDefault(require("./src/router/chatRoom.router"));
const message_router_1 = __importDefault(require("./src/router/message.router"));
const errorHandler_1 = require("./src/utils/errorHandler");
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const middleware_1 = require("./src/middleware");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)();
exports.auth0Check = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: process.env.audience,
    issuerBaseURL: process.env.issuerBaseURL,
});
exports.sessions = {};
const port = Number(process.env.PORT) || 8080;
const app = (0, express_1.default)();
exports.server = http_1.default.createServer(app);
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../dist")));
app.use(express_1.default.json());
app.use("/api/v1/user", public_router_1.default);
app.use("/api/v1/user", exports.auth0Check, middleware_1.loggedInUserAuth, user_router_1.default);
app.use("/api/v1/friend", exports.auth0Check, middleware_1.loggedInUserAuth, friendRequest_router_1.default);
app.use("/api/v1/room", exports.auth0Check, middleware_1.loggedInUserAuth, chatRoom_router_1.default);
app.use("/api/v1/message", exports.auth0Check, middleware_1.loggedInUserAuth, message_router_1.default);
app.use(errorHandler_1.ErrorHandler);
app.get("/socket.io", () => {
    (0, socket_1.connectSocket)();
});
app.get("/*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../dist/index.html"), (err) => {
        err && res.send(`<h1>Unexpected Error Occured</h1>`);
    });
});
app.use((0, cors_1.default)({
    origin: [process.env.WEB_DOMAIN, "http://localhost:5173"],
    methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
    allowedHeaders: ["Authorization", "refreshjwt", "Content-Type"],
    credentials: true,
}));
exports.server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
