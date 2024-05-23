"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_query_1 = require("../query/user.query");
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.get("/", middleware_1.auth, async (req, res, next) => {
    try {
        const user = req.userInfo;
        user?.id
            ? res.json({ status: true, data: user })
            : res.status(404).json({ message: "No user found.", status: false });
    }
    catch (error) {
        next(error);
    }
});
router.get("/all-users", middleware_1.auth, async (req, res, next) => {
    try {
        const user = req.userInfo;
        const users = await (0, user_query_1.getAllUsers)(user?.email || "");
        users.length
            ? res.status(200).json({ status: true, data: users })
            : res.status(401).json({ message: "Unauthorized" });
    }
    catch (error) {
        next(error);
    }
});
router.post("/sign-up", async (req, res, next) => {
    try {
        console.log(req.body);
        req.body.password = (0, bcrypt_1.hashPass)(req.body.password);
        const user = await (0, user_query_1.createUser)(req.body);
        user?.id
            ? res.json({ status: true, message: "User Created", data: user })
            : res.status(400).json({
                status: false,
                message: "Bad Request",
            });
    }
    catch (error) {
        next(error);
    }
});
router.post("/", async (req, res, next) => {
    try {
        const user = await (0, user_query_1.getUserByEmail)(req.body.email);
        if (!user) {
            return res.json({
                status: "error",
                message: "User not Found with that email",
            });
        }
        const isPasswordCorrect = (0, bcrypt_1.comparePassword)(req.body.password, user.password);
        console.log(isPasswordCorrect);
        if (!isPasswordCorrect) {
            return res.json({
                status: "error",
                message: "Incorrect Password",
            });
        }
        return res.json({
            status: "success",
            message: "Logged In Successfully!",
            token: {
                accessJWT: await (0, jwt_1.createAccessJWT)(req.body.email),
                refreshJWT: await (0, jwt_1.createRefreshJWT)(req.body.email),
            },
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.default = router;
