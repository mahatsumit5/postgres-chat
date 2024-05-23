"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageByUsers = exports.sendMessage = void 0;
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
    console.log("here is your message", result);
    return result;
};
exports.sendMessage = sendMessage;
const getMessageByUsers = async (id) => {
    const result = await (0, script_1.executeQuery)(script_1.prisma.chatRoom.findFirst({
        where: {
            id,
        },
        select: {
            messages: true,
        },
    }));
    return result;
};
exports.getMessageByUsers = getMessageByUsers;
