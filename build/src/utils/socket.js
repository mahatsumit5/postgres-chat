"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSocket = void 0;
const socket_io_1 = require("socket.io");
const __1 = require("../..");
const ChatRoom_query_1 = require("../query/ChatRoom.query");
const user_query_1 = require("../query/user.query");
async function connectSocket() {
    console.log("connecting to socket");
    const io = new socket_io_1.Server(__1.server, {
        cors: {
            origin: [
                process.env.WEB_DOMAIN,
                "http://localhost:5173",
                "https://daisy-ui-chat-app.vercel.app/",
                "http://localhost:8080",
            ],
            methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
            allowedHeaders: ["Content-Type", "Authorization"],
            preflightContinue: true,
        },
    });
    const onLineUsers = {};
    io.on("connection", async (socket) => {
        const email = socket.handshake.query.email;
        console.log("new user connected", email);
        // changes these two
        const user = await (0, user_query_1.getUserByEmail)(email);
        const rooms = await (0, ChatRoom_query_1.getChatRoomByEmail)(email);
        console.log("these are my rooms", rooms);
        rooms.forEach((room) => socket.join(room.id));
        if (user) {
            socket.join(user?.id);
        }
        if (email != undefined && typeof email === "string")
            onLineUsers[email] = socket.id;
        console.log("onlineUsers", onLineUsers);
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
            console.log("this is logged in user id", loggedInUserId);
            socket.join(loggedInUserId);
        });
        socket.on("sendFriendRequest", (data, receiver) => {
            console.log(receiver);
            socket.to(receiver).emit("getFriendRequest", data);
        });
        socket.on("friend_request_accepted", (roomId, fromId) => {
            console.log("new room crated with id", roomId, fromId);
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
        socket.on("disconnect", (socket) => {
            console.log("user disconnected");
            delete onLineUsers[email];
        });
        console.log(socket.rooms);
    });
}
exports.connectSocket = connectSocket;
