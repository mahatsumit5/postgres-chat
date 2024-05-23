import { executeQuery, prisma } from "../../script";

export const sendMessage = async ({
  content,
  roomId,
  author,
}: {
  content: string;
  author: string;
  roomId: string;
}) => {
  const result = await executeQuery(
    prisma.message.create({
      data: {
        content,

        chat: {
          connect: {
            id: roomId,
          },
        },
        creatorId: {
          connect: {
            id: author,
          },
        },
      },
    })
  );
  return result;
};

export const getMessageByUsers = async (
  id: string,
  numberOfMessages: number
) => {
  const result = await executeQuery(
    prisma.chatRoom.findFirst({
      where: {
        id,
      },
      select: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          take: -numberOfMessages,
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    })
  );
  return result;
};

export const getLastMessageByRoomId = async (roomid: string) => {
  const result = await executeQuery(
    prisma.chatRoom.findFirst({
      where: {
        id: roomid,
      },
      select: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    })
  );
  console.log(result);
  return result;
};

// getLastMessageByRoomId("36706157-afbe-458b-ba78-48e7a6afe76f");
