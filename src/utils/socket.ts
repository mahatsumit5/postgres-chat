import { Server } from "socket.io";
import { server } from "../..";
import { send } from "process";

export function connectSocket() {
  const origin =
    process.env.ENVIRONMENT === "Development"
      ? "http://localhost:5173"
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
      console.log(message, id);
      if (!id) {
        throw new Error("room is required");
      } else {
        socket.to(id).emit("send_message_client", message, id);
      }
    });
    socket.on("typing", (id, email) => {
      if (!id) {
        throw new Error("room is required");
      } else {
        console.log(email, "is typing");
        socket.to(id).emit("typing", email);
      }
    });
    socket.on("stopped_typing", (id, email) => {
      if (!id) {
        throw new Error("room is required");
      } else {
        socket.to(id).emit("stopped_typing", email);
      }
    });
    socket.on("join-room", (room, email, id) => {
      socket.join(room);
      socket.to(room).emit("online_users", email);
    });
    socket.on("friend_request_notification", (userID, sender) => {
      console.log("friend request received from", sender, "to", userID);
      socket.to(userID).emit("receive_friend_request", sender);
    });
    socket.on("disconnect", (reason, detail) => {
      console.log("disconnected", reason);
    });
  });
}
