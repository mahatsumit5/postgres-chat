import { Router } from "express";
import { createChatRoom, getChatRoom } from "../query/ChatRoom.query";
import { IRoom } from "../types";
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
    const data = await getChatRoom(userId);
    if (!data.length) {
      next(new Error("Server error while getting chatrooms."));
    } else {
      const rooms = data.map((item: IRoom) => {
        return {
          id: item.id,
          fName: item.user[0].fName,
          lName: item.user[0].lName,
          email: item.user[0].email,
          profile: item.user[0].profile,
          isActive: item.user[0].isActive,
        };
      });
      return res.status(200).json({ status: true, data: rooms });
    }
  } catch (error) {
    next(error);
  }
});
export default router;
