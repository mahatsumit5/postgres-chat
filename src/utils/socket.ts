import { Server } from "socket.io";
import { server } from "../..";

export function connectSocket() {
  const io = new Server(server, {
    cors: {
      origin: process.env.WEB_DOMAIN,
    },
  });

  io.on("connect", (socket) => {
    // console.log("user is connected", socket.id);

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
    socket.on("join-room", (room) => {
      socket.join(room);
    });
  });
}
