"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSocket = void 0;
const socket_io_1 = require("socket.io");
const __1 = require("../..");
async function connectSocket() {
    const origin = process.env.ENVIRONMENT === "Development"
        ? "http://192.168.20.8:5173"
        : "https://daisy-ui-chat-app.vercel.app";
    console.log("this is origin", origin);
    const io = new socket_io_1.Server(__1.server, {
        cors: {
            origin,
        },
    });
    const onLineUsers = {};
    io.on("connect", (socket) => {
        const email = socket.handshake.query.email;
        console.log("onlineUsers", onLineUsers);
        if (email != undefined && typeof email === "string")
            onLineUsers[email] = socket.id;
        io.emit("getOnlineUsers", Object.keys(onLineUsers));
        socket.on("send_message", (message, id) => {
            socket.to(id).emit("send_message_client", message);
        });
        socket.on("typing", (id, email) => {
            socket.to(id).emit("typing", email);
        });
        socket.on("stopped_typing", (id, email) => {
            socket.to(id).emit("stopped_typing", email);
        });
        socket.on("join-room", (roomIds) => {
            console.log("this is roomId", roomIds);
            socket.join(roomIds);
        });
        socket.on("join_your_room", (loggedInUserId) => {
            socket.join(loggedInUserId);
        });
        socket.on("sendFriendRequest", (data, receiver) => {
            console.log(receiver);
            socket.to(receiver).emit("getFriendRequest", data);
        });
        socket.on("friend_request_accepted", (roomId, fromId) => {
            console.log(roomId, fromId);
            socket.join(roomId);
            socket.to(fromId).emit("getReqAcceptedNotification", roomId);
        });
        socket.on("request_deleted", (data, receiver) => {
            console.log(data);
            socket.to(receiver).emit("getRequestDeleted", data);
        });
        socket.on("deleteChatRoom", (data) => {
            console.log(data);
            socket.to(data.result.id).emit("getDeletedChatRoom", data);
        });
        socket.on("disconnect", () => {
            delete onLineUsers[email];
        });
    });
    const sockets = await io.fetchSockets();
    console.log("these are sockets", sockets);
}
exports.connectSocket = connectSocket;
