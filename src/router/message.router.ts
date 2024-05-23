import { Router } from "express";
import {
  getMessageByUsers,
  messageSeenByRoom,
  sendMessage,
} from "../query/message.query";

const router = Router();
router.post("/", async (req, res, next) => {
  try {
    const result = await sendMessage(req.body);
    result?.id
      ? res.json({
          status: true,
          result,
        })
      : new Error("Unable to send message");
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const number = req.query;
    const messages = await getMessageByUsers(req.params.id, Number(number.num));
    !messages
      ? next(new Error("Unable to get messages"))
      : res.json({
          status: true,
          result: messages,
        });
  } catch (error) {
    next(error);
  }
});
router.put("/", async (req, res, next) => {
  try {
    const result = await messageSeenByRoom(req.body);
    !result
      ? next(new Error("Unable to mark message as seen"))
      : res.json({
          status: true,
          message: "Success",
          result,
        });
  } catch (error) {
    next(error);
  }
});
export default router;
