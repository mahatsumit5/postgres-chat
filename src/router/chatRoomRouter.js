import { Router } from "express";
import {
  createChatRoom,
  getChatRoom,
  getChatRoomById,
  getMultipleRoom,
} from "../queries/chatModel.js";
const router = Router();

router.get("/:userId", async (req, res) => {
  try {
    console.log(req.params);
    const rooms = await getMultipleRoom(req.params);
    rooms.length
      ? res.json({
          status: true,
          message: "success",
          data: rooms,
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
    console.log(req.body);
    const roomExist = await getChatRoom(req.body);
    if (roomExist?.id) {
      return res.json({
        status: false,
        message: "This Room  already exist in the database",
      });
    }
    const room = await createChatRoom(req.body);
    room.id
      ? res.json({
          status: true,
          message: "Chat room created",
          data: room,
        })
      : res.json({
          status: false,
          message: "unsucessfull",
          data: null,
        });
  } catch (error) {
    res.json({
      status: false,
      error: error.message,
    });
  }
});

export default router;
