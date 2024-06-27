"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumberOfFriendReq = exports.deleteSentRequest = exports.getYourSentRequest = exports.getFriendRequestByUser = exports.sendFriendRequest = void 0;
const script_1 = require("../../script");
async function sendFriendRequest(from, to) {
    console.log(from, to);
    const result = await (0, script_1.executeQuery)(script_1.prisma.friendRequests.create({
        data: {
            from: {
                connect: { id: from },
            },
            to: {
                connect: { id: to },
            },
        },
        select: {
            to: {
                select: {
                    id: true,
                    fName: true,
                    lName: true,
                    email: true,
                    profile: true,
                },
            },
            from: {
                select: {
                    id: true,
                    fName: true,
                    lName: true,
                    email: true,
                    profile: true,
                },
            },
            status: true,
        },
    }));
    console.log("this is new fr req", result);
    return result;
}
exports.sendFriendRequest = sendFriendRequest;
async function getFriendRequestByUser(id) {
    // Get friend requests sent by the user with this ID
    return await (0, script_1.executeQuery)(script_1.prisma.friendRequests.findMany({
        where: {
            toId: id,
            status: "PENDING",
        },
        select: {
            from: {
                select: {
                    fName: true,
                    lName: true,
                    email: true,
                    profile: true,
                    id: true,
                },
            },
            status: true,
            to: {
                select: {
                    fName: true,
                    lName: true,
                    email: true,
                    profile: true,
                    id: true,
                },
            },
        },
    }));
}
exports.getFriendRequestByUser = getFriendRequestByUser;
async function getYourSentRequest(id, page, take, search) {
    console.log(page, take);
    // Get friend requests sent by the user with this ID
    const result = await (0, script_1.executeQuery)(script_1.prisma.friendRequests.findMany({
        where: {
            fromId: id,
            status: "PENDING",
            to: {
                email: {
                    contains: search,
                },
            },
        },
        select: {
            to: {
                select: {
                    id: true,
                    fName: true,
                    lName: true,
                    email: true,
                    profile: true,
                },
            },
            from: {
                select: {
                    id: true,
                    fName: true,
                    lName: true,
                    email: true,
                    profile: true,
                },
            },
            status: true,
        },
        skip: (page - 1) * 7,
        take: take,
    }));
    const count = await (0, script_1.executeQuery)(script_1.prisma.friendRequests.count({
        where: {
            fromId: id,
            status: "PENDING",
            to: {
                email: {
                    contains: search,
                },
            },
        },
    }));
    return { result, count };
}
exports.getYourSentRequest = getYourSentRequest;
async function deleteSentRequest(fromId, toId) {
    return await (0, script_1.executeQuery)(script_1.prisma.friendRequests.delete({
        where: {
            fromId_toId: {
                fromId: fromId,
                toId: toId,
            },
        },
        select: {
            to: {
                select: {
                    id: true,
                    fName: true,
                    lName: true,
                    email: true,
                    profile: true,
                },
            },
            from: {
                select: {
                    fName: true,
                    lName: true,
                    email: true,
                    profile: true,
                    id: true,
                },
            },
            status: true,
        },
    }));
}
exports.deleteSentRequest = deleteSentRequest;
async function getNumberOfFriendReq(email) {
    return await (0, script_1.executeQuery)(script_1.prisma.friendRequests.count({
        where: {
            to: {
                email,
            },
        },
    }));
}
exports.getNumberOfFriendReq = getNumberOfFriendReq;
