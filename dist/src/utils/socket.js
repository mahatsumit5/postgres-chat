"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSocket = void 0;
const socket_io_1 = require("socket.io");
const __1 = require("../..");
function connectSocket() {
    const origin = process.env.ENVIRONMENT === "Development"
        ? "http://localhost:5173"
        : "https://daisy-ui-chat-app.vercel.app";
    console.log("this is origin", origin);
    const io = new socket_io_1.Server(__1.server, {
        cors: {
            origin,
        },
    });
    io.on("connect", (socket) => {
        console.log("user is connected", socket.id);
        socket.on("send_message", (message, id) => {
            console.log(message, id);
            if (!id) {
                throw new Error("room is required");
            }
            else {
                socket.to(id).emit("send_message_client", message, id);
            }
        });
        socket.on("typing", (id, email) => {
            if (!id) {
                throw new Error("room is required");
            }
            else {
                socket.to(id).emit("typing", email);
            }
        });
        socket.on("stopped_typing", (id, email) => {
            if (!id) {
                throw new Error("room is required");
            }
            else {
                socket.to(id).emit("stopped_typing", email);
            }
        });
        socket.on("join-room", (room, email) => {
            console.log(email, "is online and joined", room.length, "rooms");
            socket.join(room);
            socket.to(room).emit("online_users", email);
        });
        socket.on("disconnect", (reason, detail) => {
            console.log("disconnected", reason);
        });
    });
}
exports.connectSocket = connectSocket;
