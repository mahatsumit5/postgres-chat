"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getAllUsers = exports.getUserByEmail = exports.getUserByEmailAndUpdate = exports.uploadProfileImage = exports.changePassword = exports.createUser = void 0;
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
    return (0, script_1.executeQuery)(script_1.prisma.user.findUnique({
        where: { email: email },
    }));
}
exports.getUserByEmail = getUserByEmail;
async function getAllUsers(email) {
    return (0, script_1.executeQuery)(script_1.prisma.user.findMany({
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
        },
        select: {
            fName: true,
            lName: true,
            email: true,
            profile: true,
            id: true,
        },
    }));
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
