import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function sendMessage({ content, from, to, roomid }) {
  return await prisma.message.create({
    data: {
      content: content,
      chat: {
        connect: { id: roomid },
      },
      to: {
        connect: { id: to },
      },
    },
  });
}

export async function getMessage({ roomId }) {
  return await prisma.chatRoom.findFirst({
    where: {
      id: roomId,
    },

    include: {
      messages: true,
    },
  });
}

export async function clearMessage() {
  await prisma.chatRoom.deleteMany();
}
// clearMessage();
export async function createChatRoom({ from, to }) {
  console.log(from, to, "create function");

  const room = await prisma.chatRoom.create({
    data: {
      user: {
        connect: [
          {
            id: from,
          },
          { id: to },
        ],
      },
    },
  });
  return room.id;
}

// get chat room if it exists between two users
export async function getChatRoom({ from, to }) {
  const room = await prisma.chatRoom.findFirst({
    where: {
      user: {
        some: {
          id: {
            in: [from, to],
          },
        },
      },
    },
  });
  return room;
}
