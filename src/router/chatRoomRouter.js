import { Router } from "express";
import {
  createChatRoom,
  getChatRoom,
  getChatRoomById,
} from "../queries/chatModel.js";
const router = Router();

router.get("/:from", async (req, res) => {
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
    res.json({
      status: false,
      error: error.message,
    });
  }
});
router.get("/chat/:id", async (req, res) => {
  try {
    const room = await getChatRoomById(req.params);
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
    res.json({
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
