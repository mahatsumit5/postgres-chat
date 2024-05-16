import { executeQuery, prisma } from "../../script";

export async function createChatRoom(from: string, to: string) {
  const result = await executeQuery(
    prisma.chatRoom.create({
      data: {
        user: {
          connect: [
            {
              id: from,
            },
            { id: to },
          ],
        },
      },
    })
  );
  return result;
}

export async function getChatRoom(userId: string) {
  const rooms = await executeQuery(
    prisma.chatRoom.findMany({
      where: {
        AND: [
          {
            user: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            fName: true,
            lName: true,
            email: true,
            profile: true,
            isActive: true,
          },
          where: {
            NOT: {
              id: userId,
            },
          },
        },
      },
    })
  );
  return rooms;
}
