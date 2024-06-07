"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptFriendReq = exports.deleteSentRequest = exports.getYourSentRequest = exports.getFriendRequestByUser = exports.sendFriendRequest = void 0;
const script_1 = require("../../script");
async function sendFriendRequest(from, to) {
    const result = await (0, script_1.executeQuery)(script_1.prisma.friendRequests.create({
        data: {
            from: {
                connect: { id: from },
            },
            to: {
                connect: { id: to },
            },
        },
    }));
    console.log(result);
    return result;
}
exports.sendFriendRequest = sendFriendRequest;
async function getFriendRequestByUser(id) {
    // Get friend requests sent by the user with this ID
    const result = await (0, script_1.executeQuery)(script_1.prisma.friendRequests.findMany({
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
        },
    }));
    return result;
}
exports.getFriendRequestByUser = getFriendRequestByUser;
async function getYourSentRequest(id) {
    // Get friend requests sent by the user with this ID
    const result = await (0, script_1.executeQuery)(script_1.prisma.friendRequests.findMany({
        where: {
            fromId: id,
            status: "PENDING",
        },
        select: {
            to: {
                select: { fName: true, lName: true, email: true, profile: true },
            },
            status: true,
        },
    }));
    return result;
}
exports.getYourSentRequest = getYourSentRequest;
async function deleteSentRequest(fromId, toId) {
    const result = await (0, script_1.executeQuery)(script_1.prisma.friendRequests.delete({
        where: {
            fromId_toId: {
                fromId: fromId,
                toId: toId,
            },
        },
    }));
    return result;
}
exports.deleteSentRequest = deleteSentRequest;
async function acceptFriendReq(fromId, toId) {
    const result = await (0, script_1.executeQuery)(script_1.prisma.friendRequests.update({
        where: {
            fromId_toId: {
                fromId: fromId,
                toId: toId,
            },
        },
        data: {
            status: "ACCEPTED",
        },
    }));
    return result;
}
exports.acceptFriendReq = acceptFriendReq;
