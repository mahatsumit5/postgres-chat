import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function executeQuery(query: any) {
  try {
    return await query;
  } catch (error) {
    await prisma.$disconnect();
  } finally {
    await prisma.$disconnect();
  }
}
