import { Router } from "express";
import { getMessage, sendMessage } from "../queries/messageModel.js";
import { createChatRoom, getChatRoom } from "../queries/chatModel.js";
const router = Router();

router.post("/", async (req, res) => {
  try {
    const room = await getChatRoom(req.body);
    const { from, to, content } = req.body;
    const obj = {
      from,
      to,
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

router.get("/:roomId", async (req, res) => {
  try {
    console.log(req.params);
    const message = await getMessage(req.params);
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
