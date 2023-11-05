import { Router } from "express";
import {
  createChatRoom,
  getChatRoom,
  getMessage,
  sendMessage,
} from "../queries/messageModel.js";
const router = Router();

router.post("/", async (req, res) => {
  try {
    const room = await getChatRoom(req.body);
    const { uid1, uid2, content } = req.body;
    const obj = {
      uid1,
      uid2,
      content,
      roomid: !room?.id ? await createChatRoom(req.body) : room.id,
    };
    const result = await sendMessage(obj);
    result?.id
      ? res.json({
          status: true,
          message: "Message sent.",
          result,
        })
      : res.json({
          status: false,
          message: "Failed to send the message.",
        });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});

router.get("/:fromId/:toId", (req, res) => {
  try {
    const message = getMessage(req.params);
    res.json({
      status: true,
      message,
    });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});
export default router;
