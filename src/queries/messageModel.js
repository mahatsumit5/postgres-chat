import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function sendMessage({ content, email }) {
  return await prisma.message.create({
    data: {
      content: content,
      fromUser: email,
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
  await prisma.user.deleteMany();
}
