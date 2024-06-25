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

export async function getChatRoom(
  userId: string,
  contains: string,
  take: number,
  page: number
) {
  console.log("this is contains", contains);
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
        OR: [
          {
            user: {
              some: {
                fName: {
                  contains: contains,
                },
              },
            },
          },
          {
            user: {
              some: {
                lName: {
                  contains: contains,
                },
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

      take: take,
      skip: (page - 1) * take,
    })
  );

  return rooms;
}

export async function deleteChatRoom(roomId: string) {
  await executeQuery(
    prisma.message.deleteMany({
      where: {
        chatRoomId: roomId,
      },
    })
  );
  return await executeQuery(
    prisma.chatRoom.delete({
      where: {
        id: roomId,
      },
    })
  );
}
