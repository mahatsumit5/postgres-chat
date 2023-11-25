import { Router } from "express";
import {
  createChatRoom,
  deleteChatRoom,
  getChatRoom,
  getChatRoomById,
  getMultipleRoom,
} from "../queries/chatModel.js";
import { deleteMessages } from "../queries/messageModel.js";
import { removeChatRoomFromUser } from "../queries/userModel.js";
const router = Router();

router.get("/:userId", async (req, res) => {
  try {
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
router.delete("/:id", async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, ...rest } = req.body;
    const { id } = req.params;
    const isUpdate = await removeChatRoomFromUser(email, rest);
    // if user table is upadete delete the messages then delete the chat room
    if (isUpdate) {
      const isDeleted = await deleteMessages(id);
      if (isDeleted) {
        const result = await deleteChatRoom(id);
        result?.id
          ? res.json({
              status: "success",
              message: "Your chat has been deleted successfully.",
            })
          : res.json({
              status: "error",
              message: "Unable to delete chat at the moment.",
            });
        return;
      }
    }

    res.json({
      status: "error",
      message: "Unable to delete",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
