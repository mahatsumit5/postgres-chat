import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function sendMessage({ content, from, to, roomid }) {
  try {
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
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getMessage({ roomId }) {
  try {
    return await prisma.chatRoom.findFirst({
      where: {
        id: roomId,
      },

      include: {
        messages: true,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteMessages(id) {
  try {
    return await prisma.user.deleteMany({
      where: {
        chatRoom: id,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
