import { Router } from "express";
import {
  deleteSentRequest,
  getFriendRequestByUser,
  getNumberOfFriendReq,
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
    console.log(req.body);
    const result = await sendFriendRequest(user.id, req.body.to);
    result
      ? res.status(201).json({ status: true, data: result })
      : next(new Error("Failed to create friend request"));
  } catch (error) {
    next(error);
  }
});

router.get("/friend-request", async (req, res, next) => {
  try {
    const user = req.userInfo;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await getFriendRequestByUser(user.id);
    const friendReqCount = await getNumberOfFriendReq(user.email);
    result?.length
      ? res.status(201).json({ status: true, data: { result, friendReqCount } })
      : res
          .status(201)
          .json({ status: true, data: { result, friendReqCount } });
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

    const page = Number(req.query.page) || 0;
    const take = Number(req.query.take) || 0;
    const search = req.query.search || "";
    const { count, result } = getYourSentRequest(
      user.id,
      page,
      take,

      search ? search.toString() : ""
    );
    const sentReq = await result;

    sentReq?.length
      ? res.status(201).json({ status: true, data: result, count })
      : res.status(200).json({
          status: true,
          data: [],
          message: "You have not sent any request",
        });
  } catch (error) {
    next(error);
  }
});

router.delete("/:fromId/:toId", async (req, res, next) => {
  try {
    const fromId = req.params.fromId;
    const toId = req.params.toId;
    const result = await deleteSentRequest(fromId, toId);
    result
      ? res.status(200).json({
          status: true,
          data: result,
          message: "Friend request deleted",
        })
      : next(new Error("Unable to Delete the request"));
  } catch (error) {
    next(error);
  }
});

router.patch("/", async (req, res, next) => {
  try {
    const user = req.userInfo;

    const { fromId, toId } = req.body;
    const result = await deleteSentRequest(fromId, user?.id as string);
    if (result) {
      const newRoom = await createChatRoom(fromId, user?.id || "");

      newRoom
        ? res
            .status(201)
            .json({ status: true, data: newRoom, friendRequest: result })
        : next(new Error("Unable to create chat room"));
    } else {
      next(new Error("Unable to accept your friend request.Please try again"));
    }
  } catch (error) {
    next(error);
  }
});
export default router;
