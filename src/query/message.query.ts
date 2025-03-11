import { executeQuery, prisma } from "../script";

export const sendMessage = ({
  content,
  roomId,
  author,
}: {
  content: string;
  author: string;
  roomId: string;
}) => {
  const result = executeQuery(
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

export const getllMessages = async () => {
  const result = await executeQuery(
    prisma.chatRoom.findFirst({
      where: {
        id: "dc52050b-59c2-404c-9cd9-bc5a5e4108f6",
      },
      select: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
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
// getllMessages();

export const getMessageByUsers = (id: string, take: number, skip: number) => {
  const result = executeQuery(
    prisma.chatRoom.findFirst({
      where: {
        id,
      },
      select: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take,
          skip,
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
export const getLastMessageByRoomId = (roomid: string) => {
  const result = executeQuery(
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
  return result;
};

export const messageSeenByRoom = ({
  roomid,
  author,
}: {
  roomid: string;
  author: string;
}) => {
  const result = executeQuery(
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
export const numberOfUnSeenMessagesByUser = (
  author: string,
  roomId: string
) => {
  const result = executeQuery(
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

export const deleteMessage = (messageId: string) => {
  const result = executeQuery(
    prisma.message.deleteMany({ where: { id: messageId } })
  );
  return result;
};

export const updateMessage = (messageId: string, content: string) => {
  const result = executeQuery(
    prisma.message.update({
      where: { id: messageId },
      data: {
        content: content,
      },
    })
  );
  console.log(result);

  return result;
};
