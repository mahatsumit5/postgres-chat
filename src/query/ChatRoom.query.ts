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
  console.log(result);
  return result;
}

export async function getChatRoom(userId: string) {
  const rooms = await executeQuery(
    prisma.chatRoom.findMany({
      where: {
        user: {
          some: {
            id: userId,
          },
        },
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
        },
      },
    })
  );
  console.log(rooms);
  return rooms;
}

getChatRoom("19b1cb63-1d59-4805-92c5-4bfd0cbe42fd");
