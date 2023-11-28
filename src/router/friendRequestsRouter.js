import { Router } from "express";
import {
  deleteFriendRequest,
  getMyFriendRequests,
  getMySentFriendRequests,
  sendfriendRequests,
  updateRequestsStatus,
} from "../queries/friendRequests.js";
const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const result = await sendfriendRequests(from, to);
    result?.status
      ? res.json({
          status: "success",
          message: "Friend request sent",
        })
      : res.json({
          status: "error",
          message: "Friend request failed",
        });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const friendRequests = await getMyFriendRequests(req.params.id);
    friendRequests?.length
      ? res.json({
          status: "success",
          message: `You have ${friendRequests.length} new requests pendings. `,
          friendRequests,
        })
      : res.json({
          status: "error",
          message: "No friend requests found",
          friendRequests: [],
        });
  } catch (error) {
    next(error);
  }
});
router.get("/sent/:id", async (req, res, next) => {
  try {
    const friendRequests = await getMySentFriendRequests(req.params.id);
    friendRequests.length
      ? res.json({
          status: "success",
          message: `You have sent ${friendRequests.length} requests. `,
          friendRequests,
        })
      : res.json({
          status: "error",
          message: "No friend requets sent",
          friendRequests: [],
        });
  } catch (error) {
    next(error);
  }
});
router.put("/", async (req, res, next) => {
  try {
    const result = await updateRequestsStatus(req.body);
    result.status
      ? res.json({
          status: "success",
          message: `Your ${result.status} this requests.`,
          result,
        })
      : res.json({
          status: "error",
          message: "Unable to update",
        });
  } catch (error) {
    next(error);
  }
});
router.delete("/", async (req, res, next) => {
  try {
    const result = await deleteFriendRequest(req.body);

    result?.status
      ? res.json({
          status: "success",
          message: `Request deleted.`,
        })
      : res.json({
          status: "error",
          message: "Unable to update",
        });
  } catch (error) {
    next(error);
  }
});
export default router;
