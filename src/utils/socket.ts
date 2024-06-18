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

  io.on("connect", (socket) => {
    console.log("user is connected", socket.id);

    socket.on("send_message", (message, id) => {
      if (!id) {
        throw new Error("room is required");
      } else {
        socket.to(id).emit("send_message_client", message);
      }
    });
    socket.on("typing", (id, email) => {
      console.log(email, "is typing");
      socket.to(id).emit("typing", email);
    });
    socket.on("stopped_typing", (id, email) => {
      if (!id) {
        throw new Error("room is required");
      } else {
        socket.to(id).emit("stopped_typing", email);
      }
    });
    socket.on("join-room", (room, email) => {
      console.log(email);
      socket.join(room);
      socket.to(room).emit("online_users", email);
    });

    socket.on("join_your_room", (loggedInUserId) => {
      console.log(loggedInUserId);
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
    });
  });
}
