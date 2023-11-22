import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function createSession({ uid, token }) {
  return await prisma.session.create({
    data: {
      token: token,
      associate: {
        connect: { id: uid },
      },
    },
  });
}

export async function getAllSession() {
  const session = await prisma.session.findMany();
  console.log(session);
}
