import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createUser(obj) {
  return await prisma.user.create({
    data: obj,
  });
}

export async function getUser() {
  return await prisma.user.findMany();
}

export async function getUserByEmail({ email }) {
  const user = await prisma.user.findUnique({
    where: { email: email },
    // include: {
    //   chatRoom: {
    //     select: {
    //       user: true,
    //       id: true,
    //       messages: true,
    //     },
    //   },
    // },
  });
  return user;
}

export async function getAllUsers(email) {
  const users = await prisma.user.findMany({
    where: {
      NOT: { email: email },
    },
  });

  return users;
}

export async function deleteUser(id) {
  return await prisma.user.delete({
    where: {
      id: id,
    },
  });
}
