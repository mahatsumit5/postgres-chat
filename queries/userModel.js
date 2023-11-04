import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function postUser({ fName, lName, email }) {
  return await prisma.user.create({
    data: { fName, lName, email },
  });
}

export async function getUser() {
  return await prisma.user.findMany();
}

export async function getUSerByEmail({ email }) {
  return await prisma.user.findUnique({
    where: { email: email },
  });
}
