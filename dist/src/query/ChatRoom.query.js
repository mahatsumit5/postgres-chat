"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatRoom = exports.createChatRoom = void 0;
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
async function getChatRoom(userId) {
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
    }));
    console.log(rooms[0].user);
    return rooms;
}
exports.getChatRoom = getChatRoom;
