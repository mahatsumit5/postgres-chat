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

    if (email != undefined && typeof email === "string")
      onLineUsers[email] = socket.id;
    console.log(onLineUsers);
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
    socket.on("join-room", (room) => {
      socket.join(room);
    });

    socket.on("join_your_room", (loggedInUserId) => {
      socket.join(loggedInUserId);
    });
    socket.on("friend_request_notification", (userID, sender) => {
      console.log("friend req received from ", sender, "to", userID);
      socket.to(userID).emit("receive_friend_request", sender);
    });
    socket.on("friend_request_accepted", (senderId) => {
      console.log("request accepted", senderId);
      socket.to(senderId).emit("friend_req_accepted_notification");
    });
    socket.on("disconnect", (reason, detail) => {
      console.log("disconnected", reason);
      delete onLineUsers[email as string];
    });
  });
}
