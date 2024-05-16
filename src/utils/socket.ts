import { Server } from "socket.io";
import { server } from "../..";

export function connectSocket() {
  const io = new Server(server, {
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
      } else {
        socket.to(id).emit("send_message_client", message, id);
      }
    });
    socket.on("typing", (id) => {
      console.log(id, "is typing");
      if (!id) {
        throw new Error("room is required");
      } else {
        socket.to(id).emit("typing", id);
      }
    });
    socket.on("join-room", (room) => {
      console.log("this is your rooms", room);
      socket.join(room);
    });
  });
}
