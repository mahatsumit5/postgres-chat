"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatRoomByEmail = exports.deleteChatRoom = exports.getChatRoom = exports.createChatRoom = void 0;
const script_1 = require("../../script");
async function createChatRoom(from, to) {
    const result = await (0, script_1.executeQuery)(script_1.prisma.chatRoom.create({
        data: {
            user: {
                connect: [
                    {
                        id: from,
                    },
                    { id: to },
                ],
            },
        },
    }));
    return result;
}
exports.createChatRoom = createChatRoom;
async function getChatRoom(userId, contains, take, page) {
    const rooms = await (0, script_1.executeQuery)(script_1.prisma.chatRoom.findMany({
        where: {
            AND: [
                {
                    user: {
                        some: {
                            id: userId,
                        },
                    },
                },
                {
                    user: {
                        some: {
                            email: {
                                contains: contains,
                            },
                        },
                    },
                },
            ],
        },
        include: {
            user: {
                select: {
                    id: true,
                    fName: true,
                    lName: true,
                    email: true,
                    profile: true,
                    isActive: true,
                },
                where: {
                    NOT: {
                        id: userId,
                    },
                },
            },
        },
        take: take ? take : undefined,
        skip: page && take ? (page - 1) * take : undefined,
    }));
    return rooms;
}
exports.getChatRoom = getChatRoom;
async function deleteChatRoom(roomId) {
    await (0, script_1.executeQuery)(script_1.prisma.message.deleteMany({
        where: {
            chatRoomId: roomId,
        },
    }));
    return await (0, script_1.executeQuery)(script_1.prisma.chatRoom.delete({
        where: {
            id: roomId,
        },
    }));
}
exports.deleteChatRoom = deleteChatRoom;
async function getChatRoomByEmail(email) {
    return await (0, script_1.executeQuery)(script_1.prisma.chatRoom.findMany({
        where: {
            AND: [
                {
                    user: {
                        some: {
                            email: email,
                        },
                    },
                },
            ],
        },
    }));
}
exports.getChatRoomByEmail = getChatRoomByEmail;
