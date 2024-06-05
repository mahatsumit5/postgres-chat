"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSocket = void 0;
const socket_io_1 = require("socket.io");
const __1 = require("../..");
function connectSocket() {
    const io = new socket_io_1.Server(__1.server, {
        cors: {
            origin: "http://localhost:5173",
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
        socket.on("typing", (id) => {
            console.log(id, "is typing");
            if (!id) {
                throw new Error("room is required");
            }
            else {
                socket.to(id).emit("typing", id);
            }
        });
        socket.on("join-room", (room) => {
            socket.join(room);
        });
    });
}
exports.connectSocket = connectSocket;
