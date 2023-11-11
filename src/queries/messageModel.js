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
