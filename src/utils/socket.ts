import { Server } from "socket.io";
import { server } from "../..";

export function connectSocket() {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("send_message", (message, id) => {
      console.log(message, id);
      if (!id) {
        console.log("room is required");
      } else {
        socket.to(id).emit("send_message_client", message);
      }
    });
    socket.on("join-room", (room) => {
      console.log(room);
      socket.join(room);
    });
  });
}
