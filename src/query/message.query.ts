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
  console.log("here is your message", result);
  return result;
};

export const getMessageByUsers = async (id: string) => {
  const result = await executeQuery(
    prisma.chatRoom.findFirst({
      where: {
        id,
      },
      select: {
        messages: true,
      },
    })
  );
  return result;
};
