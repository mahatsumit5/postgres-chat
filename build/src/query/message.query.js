"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberOfUnSeenMessagesByUser = exports.messageSeenByRoom = exports.getLastMessageByRoomId = exports.getMessageByUsers = exports.sendMessage = void 0;
const script_1 = require("../../script");
const sendMessage = async ({ content, roomId, author, }) => {
    const result = await (0, script_1.executeQuery)(script_1.prisma.message.create({
        data: {
            content,
            chat: {
                connect: {
                    id: roomId,
                },
            },
            creatorId: {
                connect: {
                    id: author,
                },
            },
        },
    }));
    return result;
};
exports.sendMessage = sendMessage;
const getMessageByUsers = async (id, numberOfMessages) => {
    const result = await (0, script_1.executeQuery)(script_1.prisma.chatRoom.findFirst({
        where: {
            id,
        },
        select: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
                take: -numberOfMessages,
            },
            _count: {
                select: {
                    messages: true,
                },
            },
        },
    }));
    return result;
};
exports.getMessageByUsers = getMessageByUsers;
const getLastMessageByRoomId = async (roomid) => {
    const result = await (0, script_1.executeQuery)(script_1.prisma.chatRoom.findFirst({
        where: {
            id: roomid,
        },
        select: {
            messages: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            },
        },
    }));
    console.log("this is last message", result);
    return result;
};
exports.getLastMessageByRoomId = getLastMessageByRoomId;
const messageSeenByRoom = async ({ roomid, author, }) => {
    const result = await (0, script_1.executeQuery)(script_1.prisma.message.updateMany({
        data: {
            isSeen: true,
        },
        where: {
            chatRoomId: roomid,
            author: {
                not: author,
            },
        },
    }));
    return result;
};
exports.messageSeenByRoom = messageSeenByRoom;
const numberOfUnSeenMessagesByUser = async (author, roomId) => {
    const result = await (0, script_1.executeQuery)(script_1.prisma.message.count({
        where: {
            isSeen: false,
            author: author,
            chatRoomId: roomId,
        },
    }));
    console.log("the num of unseen message for this room is:", result);
    return result;
};
exports.numberOfUnSeenMessagesByUser = numberOfUnSeenMessagesByUser;
