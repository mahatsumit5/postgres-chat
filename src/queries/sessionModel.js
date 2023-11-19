import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function createChatRoom({ uid }) {
  return prisma.session.create({
    data: {
      associate: {
        connect: { id: uid },
      },
    },
  });
}
