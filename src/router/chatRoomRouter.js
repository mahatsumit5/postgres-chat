import { Router } from "express";
import { createChatRoom, getChatRoom } from "../queries/messageModel.js";
const router = Router();

router.get("/:from/:to", async (req, res) => {
  try {
    const room = await getChatRoom(req.params);
    room.id
      ? res.json({
          status: true,
          message: "success",
          data: room,
        })
      : res.json({
          status: false,

          data: null,
        });
  } catch (error) {
    req.json({
      status: false,
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const room = await createChatRoom(req.body);
    room.id
      ? res.json({
          status: true,
          message: "Chat room created",
          data: room,
        })
      : res.json({
          status: false,
          data: null,
        });
  } catch (error) {
    req.json({
      status: false,
      error: error.message,
    });
  }
});

export default router;
