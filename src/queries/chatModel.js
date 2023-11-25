import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createChatRoom({ from, to }) {
  try {
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
    return room;
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

// get chat room if it exists between two users
export async function getChatRoom({ from, to }) {
  try {
    const room = await prisma.chatRoom.findFirst({
      where: {
        user: {
          every: {
            id: {
              in: [from, to],
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
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
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

export async function getMultipleRoom({ userId }) {
  try {
    const rooms = await prisma.chatRoom.findMany({
      where: {
        user: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        user: true,
        messages: true,
      },
    });

    return rooms;
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteChatRoom(id) {
  try {
    return await prisma.chatRoom.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
