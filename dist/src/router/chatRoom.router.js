"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ChatRoom_query_1 = require("../query/ChatRoom.query");
const router = (0, express_1.Router)();
router.post("/", async (req, res, next) => {
    try {
        const { from, to } = req.body;
        if (!from || !to)
            throw new Error("From and To are required");
        const newRoom = await (0, ChatRoom_query_1.createChatRoom)(from, to);
        !newRoom
            ? next(new Error("Failed to create chat room"))
            : res.status(201).json({ status: true, data: newRoom });
    }
    catch (error) {
        next(error);
    }
});
router.get("/", async (req, res, next) => {
    try {
        const userId = req.userInfo?.id;
        if (!userId)
            throw new Error("User is not logged in.");
        const data = await (0, ChatRoom_query_1.getChatRoom)(userId);
        if (!data.length) {
            next(new Error("Server error while getting chatrooms."));
        }
        else {
            const rooms = data.map((item) => {
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
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
