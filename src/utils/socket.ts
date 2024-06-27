import { Server } from "socket.io";
import { server } from "../..";
import { getChatRoomByEmail } from "../query/ChatRoom.query";
import { getUserByEmail } from "../query/user.query";

export async function connectSocket() {
  const io = new Server(server, {});

  const onLineUsers: Record<string, string> = {};
  io.on("connection", async (socket) => {
    const email = socket.handshake.query.email;
    console.log("new user connected", email);

    // changes these two
    const user = await getUserByEmail(email as string);
    const rooms = await getChatRoomByEmail(email as string);
    console.log("these are my rooms", rooms);

    rooms.forEach((room: { id: string }) => socket.join(room.id));
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

      delete onLineUsers[email as string];
    });

    console.log(socket.rooms);
  });
}
