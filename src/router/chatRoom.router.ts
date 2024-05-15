import { Router } from "express";
import { createChatRoom, getChatRoom } from "../query/ChatRoom.query";
const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) throw new Error("From and To are required");
    const newRoom = await createChatRoom(from, to);
    !newRoom
      ? next(new Error("Failed to create chat room"))
      : res.status(201).json({ status: true, data: newRoom });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const userId = req.userInfo?.id;
    if (!userId) throw new Error("User is not logged in.");
    const rooms = await getChatRoom(userId);
    !rooms
      ? next(new Error("Server error while getting chatrooms."))
      : res.status(200).json({ status: true, data: rooms });
  } catch (error) {
    next(error);
  }
});
export default router;
