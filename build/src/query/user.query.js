"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserByEmail = exports.deleteUser = exports.getAllUsers = exports.getUserById = exports.getUserByEmail = exports.getUserByEmailAndUpdate = exports.uploadProfileImage = exports.changePassword = exports.createUser = void 0;
const script_1 = require("../../script");
async function createUser(obj) {
    return await (0, script_1.executeQuery)(script_1.prisma.user.create({
        data: obj,
    }));
}
exports.createUser = createUser;
async function changePassword({ email, newPassword, }) {
    return (0, script_1.executeQuery)(script_1.prisma.user.update({
        where: {
            email: email,
        },
        data: {
            password: newPassword,
        },
    }));
}
exports.changePassword = changePassword;
async function uploadProfileImage(email, path) {
    return (0, script_1.executeQuery)(script_1.prisma.user.update({
        where: {
            email: email,
        },
        data: {
            profile: path,
        },
    }));
}
exports.uploadProfileImage = uploadProfileImage;
async function getUserByEmailAndUpdate(email, dataToUpdate) {
    return (0, script_1.executeQuery)(script_1.prisma.user.update({
        where: {
            email: email,
        },
        data: dataToUpdate,
    }));
}
exports.getUserByEmailAndUpdate = getUserByEmailAndUpdate;
async function getUserByEmail(email) {
    return await (0, script_1.executeQuery)(script_1.prisma.user.findUnique({
        where: { email: email },
    }));
}
exports.getUserByEmail = getUserByEmail;
async function getUserById(id) {
    return (0, script_1.executeQuery)(script_1.prisma.user.findUnique({
        where: { id: id },
        select: {
            id: true,
        },
    }));
}
exports.getUserById = getUserById;
async function getAllUsers(email, take, page, order, contains) {
    const skipAmount = (page - 1) * take;
    const users = await (0, script_1.executeQuery)(script_1.prisma.user.findMany({
        where: {
            NOT: {
                OR: [
                    {
                        chatRoom: {
                            some: {
                                user: {
                                    some: {
                                        email: email,
                                    },
                                },
                            },
                        },
                    },
                    {
                        friendRequests: {
                            some: { from: { email: email } },
                        },
                    },
                    {
                        email: email,
                    },
                ],
            },
            email: {
                contains: contains.toLowerCase(),
            },
        },
        select: {
            fName: true,
            lName: true,
            email: true,
            profile: true,
            id: true,
        },
        take: take,
        orderBy: { fName: order },
        skip: skipAmount,
    }));
    const totalUsers = await (0, script_1.executeQuery)(script_1.prisma.user.count({
        where: {
            NOT: {
                chatRoom: {
                    some: {
                        user: {
                            some: {
                                email: email,
                            },
                        },
                    },
                },
            },
            email: {
                contains: contains || "",
            },
        },
    }));
    return { users, totalUsers };
}
exports.getAllUsers = getAllUsers;
async function deleteUser(id) {
    return (0, script_1.executeQuery)(script_1.prisma.user.delete({
        where: {
            id: id,
        },
    }));
}
exports.deleteUser = deleteUser;
async function deleteUserByEmail(email) {
    console.log(email);
    const data = await (0, script_1.executeQuery)(script_1.prisma.user.delete({
        where: {
            email: email,
        },
    }));
    console.log(data);
    return data;
}
exports.deleteUserByEmail = deleteUserByEmail;
