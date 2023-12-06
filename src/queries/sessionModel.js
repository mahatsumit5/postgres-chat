import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function createSession({ email, token }) {
  try {
    return await prisma.session.create({
      data: {
        token,
        associate: {
          connect: { email: email },
        },
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
export async function findSessionAndDel(token, email) {
  try {
    const result = await prisma.session.delete({
      where: {
        userEmail_token: {
          userEmail: email,
          token,
        },
      },
    });

    return result;
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
