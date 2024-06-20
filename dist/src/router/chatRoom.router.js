"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ChatRoom_query_1 = require("../query/ChatRoom.query");
const message_query_1 = require("../query/message.query");
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
            return res
                .status(200)
                .json({
                status: false,
                data: [],
                message: "Your do not have any chat room.",
            });
        }
        else {
            let lastMessage = [];
            let unSeenMessageCount = [];
            for (let i = 0; i < data.length; i++) {
                lastMessage.push(await (0, message_query_1.getLastMessageByRoomId)(data[i].id));
                unSeenMessageCount.push(await (0, message_query_1.numberOfUnSeenMessagesByUser)(data[i].user[0].id, data[i].id));
            }
            const rooms = data.map((item, index) => {
                return {
                    id: item.id,
                    userId: item.user[0].id,
                    fName: item.user[0].fName,
                    lName: item.user[0].lName,
                    email: item.user[0].email,
                    profile: item.user[0].profile,
                    isActive: item.user[0].isActive,
                    lastMessage: lastMessage[index]?.messages[0]?.content || "Start a conversation",
                    isLastMessageSeen: lastMessage[index].messages[0]?.isSeen || false,
                    lastmessageAuthor: lastMessage[index].messages[0]?.author || undefined,
                    unSeenMessageCount: unSeenMessageCount[index],
                };
            });
            return res.status(200).json({ status: true, data: rooms });
        }
    }
    catch (error) {
        next(error);
    }
});
router.delete("/", async (req, res, next) => {
    try {
        const { id } = req.query;
        if (!id)
            next(new Error("ID is required."));
        const result = await (0, ChatRoom_query_1.deleteChatRoom)(id);
        result
            ? res.json({
                status: true,
                result,
            })
            : next(new Error("Unable to delete chatRoom"));
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
