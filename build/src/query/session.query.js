"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSession = exports.findSessionAndDelete = exports.createSession = void 0;
const script_1 = require("../../script");
async function createSession({ email, token, }) {
    return await (0, script_1.executeQuery)(script_1.prisma.session.create({
        data: {
            token,
            associate: {
                connect: { email: email },
            },
        },
    }));
}
exports.createSession = createSession;
async function findSessionAndDelete(token, email) {
    return (0, script_1.executeQuery)(script_1.prisma.session.delete({
        where: {
            userEmail_token: {
                userEmail: email,
                token,
            },
        },
    }));
}
exports.findSessionAndDelete = findSessionAndDelete;
async function getAllSession() {
    return (0, script_1.executeQuery)(script_1.prisma.session.findMany());
}
exports.getAllSession = getAllSession;
