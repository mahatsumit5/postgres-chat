import { Server } from "socket.io";
import { server } from "..";
import { getChatRoomByEmail } from "../query/ChatRoom.query";
import { getUserByEmail } from "../query/user.query";

export async function connectSocket() {
  const io = new Server(server, {
    cors: {
      origin: [
        process.env.WEB_DOMAIN as string,
        "http://localhost:5173",
        "https://daisy-ui-chat-app.vercel.app/",
        "http://localhost:8080",
      ],
      methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      preflightContinue: true,
    },
  });

  const onLineUsers: Record<string, string> = {};
  io.on("connection", async (socket) => {
    const email = socket.handshake.query.email;
    // console.log("new user connected", email);

    // changes these two
    const user = await getUserByEmail(email as string);
    const rooms = await getChatRoomByEmail(email as string);

    rooms.forEach((room: { id: string }) => socket.join(room.id));
    if (user) {
      socket.join(user?.id);
    }
    if (email != undefined && typeof email === "string")
      onLineUsers[email] = socket.id;
    console.log("onlineUsers", onLineUsers);

    io.emit("getOnlineUsers", Object.keys(onLineUsers));

    socket.on("send_message", (message, id) => {
      console.log("New message received from", id, message);
      socket.to(id).emit("send_message_client", message);
    });

    socket.on("typing", (id, email) => {
      console.log("typing");
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

    socket.on("send_like_notification", (data) => {
      console.log("Coming from server ", data);
      socket.to(data.to).emit("getLikedNotification", data);
    });
    socket.on("newComment", (data) => {
      console.log("newComment ", data);
      socket.to(data.to).emit("getNewCommentNotification", data);
    });

    socket.on("disconnect", (socket) => {
      console.log("user disconnected");

      delete onLineUsers[email as string];
    });

    // console.log(socket.rooms);
  });
}
