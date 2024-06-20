"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const friendRequest_query_1 = require("../query/friendRequest.query");
const ChatRoom_query_1 = require("../query/ChatRoom.query");
const router = (0, express_1.Router)();
router.post("/send-request", async (req, res, next) => {
    try {
        const user = req.userInfo;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log(req.body);
        const result = await (0, friendRequest_query_1.sendFriendRequest)(user.id, req.body.to);
        result
            ? res.status(201).json({ status: true, data: result })
            : next(new Error("Failed to create friend request"));
    }
    catch (error) {
        next(error);
    }
});
router.get("/friend-request", async (req, res, next) => {
    try {
        const user = req.userInfo;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = await (0, friendRequest_query_1.getFriendRequestByUser)(user.id);
        const friendReqCount = await (0, friendRequest_query_1.getNumberOfFriendReq)(user.email);
        result?.length
            ? res.status(201).json({ status: true, data: { result, friendReqCount } })
            : res
                .status(201)
                .json({ status: true, data: { result, friendReqCount } });
    }
    catch (error) {
        next(error);
    }
});
router.get("/sent-request", async (req, res, next) => {
    try {
        const user = req.userInfo;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const skip = Number(req.query.skip) || 0;
        const search = req.query.search || "";
        const { count, result } = await (0, friendRequest_query_1.getYourSentRequest)(user.id, skip, search ? search.toString() : "");
        result.length
            ? res.status(201).json({ status: true, data: result, count })
            : res.status(200).json({
                status: true,
                data: [],
                message: "You have not sent any request",
            });
    }
    catch (error) {
        next(error);
    }
});
router.delete("/:fromId/:toId", async (req, res, next) => {
    try {
        const fromId = req.params.fromId;
        const toId = req.params.toId;
        const result = await (0, friendRequest_query_1.deleteSentRequest)(fromId, toId);
        result
            ? res.status(200).json({
                status: true,
                data: result,
                message: "Friend request deleted",
            })
            : next(new Error("Unable to Delete the request"));
    }
    catch (error) {
        next(error);
    }
});
router.patch("/", async (req, res, next) => {
    try {
        const user = req.userInfo;
        const { fromId, toId } = req.body;
        const result = await (0, friendRequest_query_1.deleteSentRequest)(fromId, user?.id);
        if (result) {
            const newRoom = await (0, ChatRoom_query_1.createChatRoom)(fromId, user?.id || "");
            newRoom
                ? res
                    .status(201)
                    .json({ status: true, data: newRoom, friendRequest: result })
                : next(new Error("Unable to create chat room"));
        }
        else {
            next(new Error("Unable to accept your friend request.Please try again"));
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
