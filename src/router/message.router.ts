import { Router } from "express";
import { getMessageByUsers, sendMessage } from "../query/message.query";
import { error } from "console";

const router = Router();
router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
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
    console.log(req.params.id);
    const messages = await getMessageByUsers(req.params.id);
    console.log(messages);
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
