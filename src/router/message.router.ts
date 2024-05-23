import { Router } from "express";
import { getMessageByUsers, sendMessage } from "../query/message.query";

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

export default router;
