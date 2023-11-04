import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createUser({ fName, lName, email }) {
  return await prisma.user.create({
    data: { fName, lName, email },
  });
}

export async function getUser() {
  return await prisma.user.findMany();
}

export async function getUserByEmail({ email }) {
  console.log(email);
  return await prisma.user.findUnique({
    where: { email: email },
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany();
}

export async function deleteUser(id) {
  return await prisma.user.delete({
    where: {
      id: id,
    },
  });
}
