import { Server } from "socket.io";
import { server } from "../..";

export function connectSocket() {
  const origin =
    process.env.ENVIRONMENT === "Development"
      ? "http://192.168.20.8:5173"
      : "https://daisy-ui-chat-app.vercel.app";
  console.log("this is origin", origin);
  const io = new Server(server, {
    cors: {
      origin,
    },
  });

  const onLineUsers: Record<string, string> = {};
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
      socket.join(roomIds);
    });

    socket.on("join_your_room", (loggedInUserId) => {
      socket.join(loggedInUserId);
    });

    socket.on("sendFriendRequest", (data, receiver) => {
      console.log(receiver);
      socket.to(receiver).emit("getFriendRequest", data);
    });

    socket.on("friend_request_accepted", (acceptedRequest, fromId) => {
      socket
        .to(fromId)
        .emit("friend_req_accepted_notification", acceptedRequest);
    });

    socket.on("request_deleted", (data, receiver) => {
      console.log(data);
      socket.to(receiver).emit("getRequestDeleted", data);
    });

    socket.on("disconnect", () => {
      delete onLineUsers[email as string];
    });
  });
}
