"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChatRoom = exports.getChatRoom = exports.createChatRoom = void 0;
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
    console.log("this is contains", contains);
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
            ],
            OR: [
                {
                    user: {
                        some: {
                            fName: {
                                contains: contains,
                            },
                        },
                    },
                },
                {
                    user: {
                        some: {
                            lName: {
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
        take: take,
        skip: (page - 1) * take,
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
