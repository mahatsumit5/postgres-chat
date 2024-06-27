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
  console.log("this is last message", result);
  return result;
};

export const messageSeenByRoom = async ({
  roomid,
  author,
}: {
  roomid: string;
  author: string;
}) => {
  const result = await executeQuery(
    prisma.message.updateMany({
      data: {
        isSeen: true,
      },
      where: {
        chatRoomId: roomid,
        author: {
          not: author,
        },
      },
    })
  );
  return result;
};
export const numberOfUnSeenMessagesByUser = async (
  author: string,
  roomId: string
) => {
  const result = await executeQuery(
    prisma.message.count({
      where: {
        isSeen: false,
        author: author,
        chatRoomId: roomId,
      },
    })
  );
  console.log("the num of unseen message for this room is:", result);
  return result;
};
