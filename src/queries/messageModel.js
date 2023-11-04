import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function sendMessage({ content, fromId, toId }) {
  return await prisma.message.create({
    data: {
      content: content,
      fromId: fromId,
      toId: toId,
    },
  });
}

export async function getMessage({ fromId, toId }) {
  return await prisma.user.findUnique({
    where: {
      fromId: fromId,
    },
  });
}
export async function clearMessage() {
  await prisma.message.deleteMany();
}
