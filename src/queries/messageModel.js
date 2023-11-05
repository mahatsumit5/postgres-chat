import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function sendMessage({ content, uid1, uid2, roomid }) {
  return await prisma.message.create({
    data: {
      content: content,
      chat: {
        connect: { id: roomid },
      },
      author: {
        connect: [{ id: uid2 }, { id: uid1 }],
      },
    },
  });
}
// sendMessage();
export async function getMessage({ fromId, toId }) {
  return await prisma.user.findUnique({
    where: {
      fromId: fromId,
    },
  });
}
export async function clearMessage() {
  await prisma.user.deleteMany();
}

export async function createChatRoom({ uid1, uid2 }) {
  console.log(uid1, uid2, "create function");

  const room = await prisma.chatRoom.create({
    data: {
      user: {
        connect: [
          {
            id: uid1,
          },
          { id: uid2 },
        ],
      },
    },
  });
  return room.id;
}

// get chat room if it exists between two users
export async function getChatRoom({ uid1, uid2 }) {
  const room = await prisma.chatRoom.findFirst({
    where: {
      user: {
        some: {
          id: {
            in: [uid1, uid2],
          },
        },
      },
    },
  });
  return room;
}
