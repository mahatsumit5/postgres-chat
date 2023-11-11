import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createChatRoom({ from, to }) {
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
export async function getChatRoom({ from }) {
  const room = await prisma.chatRoom.findFirst({
    where: {
      user: {
        some: {
          id: {
            in: [from],
          },
        },
      },
    },
    include: {
      user: true,
      messages: true,
    },
  });
  return room;
}
export async function getChatRoomById({ id }) {
  const room = await prisma.chatRoom.findFirst({
    where: {
      id: id,
    },
    include: {
      user: true,
      messages: true,
    },
  });

  return room;
}
