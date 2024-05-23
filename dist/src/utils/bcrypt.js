"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPass = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRouds = 10;
const hashPass = (plainPassword) => {
    return bcrypt_1.default.hashSync(plainPassword, saltRouds);
};
exports.hashPass = hashPass;
const comparePassword = (plainPassword, password) => {
    return bcrypt_1.default.compareSync(plainPassword, password);
};
exports.comparePassword = comparePassword;
