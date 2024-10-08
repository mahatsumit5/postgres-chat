import { Router } from "express";
import {
  createChatRoom,
  deleteChatRoom,
  getChatRoom,
} from "../query/ChatRoom.query";
import { IRoom, message } from "../types";
import {
  getLastMessageByRoomId,
  numberOfUnSeenMessagesByUser,
} from "../query/message.query";
import { loggedInUserAuth } from "../middleware";
const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) throw new Error("From and To are required");
    const newRoom = await createChatRoom(from, to);
    !newRoom
      ? next(new Error("Failed to create chat room"))
      : res.status(201).json({ status: true, data: newRoom });
  } catch (error) {
    next(error);
  }
});

router.get("/", loggedInUserAuth, async (req, res, next) => {
  try {
    const userId = req.userInfo?.id;
    const serachQuery = req.query.search;
    const page = Number(req.query.page);
    const take = Number(req.query.take);
    if (!userId) throw new Error("User is not logged in.");
    const data = await getChatRoom(userId, serachQuery as string, take, page);
    if (!data?.length) {
      return res.status(400).json({
        status: false,
        data: [],
        message: "Your do not have any chat room.",
      });
    } else {
      let lastMessage: { messages: message[] }[] = [];
      let unSeenMessageCount: number[] = [];
      for (let i = 0; i < data.length; i++) {
        lastMessage.push(await getLastMessageByRoomId(data[i].id));
        unSeenMessageCount.push(
          await numberOfUnSeenMessagesByUser(data[i].user[0].id, data[i].id)
        );
      }
      const rooms = data.map((item: IRoom, index: number) => {
        return {
          id: item.id,
          userId: item.user[0].id,
          fName: item.user[0].fName,
          lName: item.user[0].lName,
          email: item.user[0].email,
          profile: item.user[0].profile,
          isActive: item.user[0].isActive,
          lastMessage:
            lastMessage[index]?.messages[0]?.content || "Start a conversation",
          isLastMessageSeen: lastMessage[index].messages[0]?.isSeen || false,
          lastmessageAuthor:
            lastMessage[index].messages[0]?.author || undefined,
          unSeenMessageCount: unSeenMessageCount[index],
        };
      });
      return res.status(200).json({ status: true, data: rooms });
    }
  } catch (error) {
    next(error);
  }
});
router.delete("/", async (req, res, next) => {
  try {
    const { id } = req.query;
    if (!id) next(new Error("ID is required."));
    const result = await deleteChatRoom(id as string);
    result
      ? res.json({
          status: true,
          result,
        })
      : next(new Error("Unable to delete chatRoom"));
  } catch (error) {
    next(error);
  }
});
export default router;
