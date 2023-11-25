import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function createSession({ uid, token }) {
  try {
    return await prisma.session.create({
      data: {
        token: token,
        associate: {
          connect: { id: uid },
        },
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getAllSession() {
  try {
    return await prisma.session.findMany();
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
