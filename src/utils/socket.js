import { httpServer } from "../../index.js";
import { Server } from "socket.io";
export function connectSocket() {
  const io = new Server(httpServer, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? ["https://vite-chat-app-lake.vercel.app"]
          : ["http://localhost:5173"],
    },
  });

  io.on("connection", (socket) => {
    // message
    socket.on("send_message", (data, roomId) => {
      socket.broadcast.emit("receive_message", data, roomId);
    });

    socket.on("send_friendReq", (data) => {
      console.log(data);
      socket.broadcast.emit("receive_friendRequest", data);
    });

    socket.on("delete_request", (data) => {
      socket.broadcast.emit("deleted_req", data);
    });
    socket.on("disconnect", () => {});
  });
}
