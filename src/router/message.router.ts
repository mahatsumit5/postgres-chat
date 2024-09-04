import { Router } from "express";
import {
  deleteMessage,
  getMessageByUsers,
  messageSeenByRoom,
  sendMessage,
} from "../query/message.query";
import { upload } from "../middleware";

const router = Router();
router.post("/", upload.single("content"), async (req, res, next) => {
  try {
    const file = req.file as Express.MulterS3.File;
    if (file) {
      req.body.content = file.location;
    }
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

router.get("/", async (req, res, next) => {
  try {
    const { id, take, platform } = req.query;
    const messages = await getMessageByUsers(id as string, Number(take));
    console.log("this req is coming from", platform);
    !messages
      ? next(new Error("Unable to get messages"))
      : res.json({
          status: true,
          result:
            platform === "mobile"
              ? {
                  messages: messages.messages.reverse(),
                  _count: messages._count,
                }
              : messages,
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

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await deleteMessage(id);
    result
      ? res.json({
          status: true,
          message: "Success",
        })
      : next(new Error("Unable to delete message"));
  } catch (error) {
    next(error);
  }
});
export default router;
