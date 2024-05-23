"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQuery = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
async function executeQuery(query) {
    try {
        return await query;
    }
    catch (error) {
        await exports.prisma.$disconnect();
    }
    finally {
        await exports.prisma.$disconnect();
    }
}
exports.executeQuery = executeQuery;
