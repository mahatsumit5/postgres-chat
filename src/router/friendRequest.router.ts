import { Router } from "express";
import {
  acceptFriendReq,
  deleteSentRequest,
  getFriendRequestByUser,
  getYourSentRequest,
  sendFriendRequest,
} from "../query/friendRequest.query";
import { createChatRoom } from "../query/ChatRoom.query";
const router = Router();

router.post("/send-request", async (req, res, next) => {
  try {
    const user = req.userInfo;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await sendFriendRequest(user.id, req.body.userId);
    result
      ? res.status(201).json({ status: true, data: result })
      : next(new Error("Failed to create friend request"));
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const user = req.userInfo;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await getFriendRequestByUser(user.id);
    result?.length
      ? res.status(201).json({ status: true, data: result })
      : next(new Error("You do have any friend Request"));
  } catch (error) {
    next(error);
  }
});
router.get("/sent-request", async (req, res, next) => {
  try {
    const user = req.userInfo;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await getYourSentRequest(user.id);
    result?.length
      ? res.status(201).json({ status: true, data: result })
      : next(new Error("You have not sent any friend Request"));
  } catch (error) {
    next(error);
  }
});
router.delete("/:fromId/:toId", async (req, res, next) => {
  try {
    console.log(req.params);
    const fromId = req.params.fromId;
    const toId = req.params.toId;
    const result = await deleteSentRequest(fromId, toId);
    result
      ? res.status(200).json({ status: true, data: "Deleted Successfully" })
      : next(new Error("Unable to Delete the request"));
  } catch (error) {
    next(error);
  }
});

router.patch("/", async (req, res, next) => {
  try {
    const user = req.userInfo;

    if (!user?.id) {
      next(new Error("Unable to accept your friend request.Please try again"));
    }
    const { fromId, toId } = req.body;
    const result = await acceptFriendReq(fromId, user?.id || "");
    if (result) {
      const newRoom = await createChatRoom(fromId, user?.id || "");

      newRoom
        ? res.status(201).json({ status: true, data: newRoom })
        : next(new Error("Unable to create chat room"));
    } else {
      next(new Error("Unable to accept your friend request.Please try again"));
    }
  } catch (error) {
    next(error);
  }
});
export default router;
