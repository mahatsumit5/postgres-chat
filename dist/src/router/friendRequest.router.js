"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const friendRequest_query_1 = require("../query/friendRequest.query");
const router = (0, express_1.Router)();
router.post("/send-request", async (req, res, next) => {
    try {
        const user = req.userInfo;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = await (0, friendRequest_query_1.sendFriendRequest)(user.id, req.body.userId);
        result
            ? res.status(201).json({ status: true, result })
            : next(new Error("Failed to create friend request"));
    }
    catch (error) {
        next(error);
    }
});
router.get("/", async (req, res, next) => {
    try {
        const user = req.userInfo;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = await (0, friendRequest_query_1.getFriendRequestByUser)(user.id);
        result?.length
            ? res.status(201).json({ status: true, result })
            : next(new Error("You do have any friend Request"));
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
        const result = await (0, friendRequest_query_1.getYourSentRequest)(user.id);
        result?.length
            ? res.status(201).json({ status: true, result })
            : next(new Error("You have not sent any friend Request"));
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
            ? res.status(200).json({ status: true, data: "Deleted Successfully" })
            : next(new Error("Unable to Delete the request"));
    }
    catch (error) {
        next(error);
    }
});
router.patch("/", async (req, res, next) => {
    try {
        const { fromId, toId } = req.body;
        const result = await (0, friendRequest_query_1.acceptFriendReq)(fromId, toId);
        !result
            ? next(new Error("Something went wrong"))
            : res.status(201).json({ status: true, data: result });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
