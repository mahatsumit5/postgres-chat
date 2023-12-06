import { Router } from "express";
import {
  createChatRoom,
  deleteChatRoom,
  getChatRoom,
  getChatRoomById,
  getMultipleRoom,
} from "../queries/chatModel.js";
import { deleteMessages } from "../queries/messageModel.js";
const router = Router();

/**
 * Get chat rooms by userId
 * @route GET /api/chat/:userId
 * @group Chat - Operations about chat rooms
 * @param {string} userId.path.required - User ID
 * @returns {object} 200 - An array of chat rooms
 * @returns {Error} default - Unexpected error
 */
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

/**
 * Get chat room by id
 * @route GET /api/chat/chat/:id
 * @group Chat - Operations about chat rooms
 * @param {string} id.path.required - Chat room ID
 * @returns {object} 200 - Chat room object
 * @returns {Error} default - Unexpected error
 */
router.get("/chat/:id", async (req, res) => {
  try {
    const room = await getChatRoomById(req.params);
    room?.id
      ? res.json({
          status: "success",
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

/**
 * Create a new chat room
 * @route POST /api/chat/
 * @group Chat - Operations about chat rooms
 * @param {string} userId.body.required - User ID
 * @param {string} chatRoomName.body.required - Chat room name
 * @returns {object} 200 - Chat room object
 * @returns {Error} default - Unexpected error
 */
router.post("/", async (req, res) => {
  try {
    const roomExist = await getChatRoom(req.body);
    if (roomExist?.id) {
      return res.json({
        status: false,
        message: "This Room already exist in the database",
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

/**
 * Delete a chat room by id
 * @route DELETE /api/chat/:id
 * @group Chat - Operations about chat rooms
 * @param {string} id.path.required - Chat room ID
 * @returns {object} 200 - Success message
 * @returns {Error} default - Unexpected error
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { count } = await deleteMessages(id);
    if (count) {
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

    res.json({
      status: "error",
      message: "Unable to delete",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
//
//This code has been updated with proper commenting. Comments have been added to provide clear and concise explanations for each route..</s>
