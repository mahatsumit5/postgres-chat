"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_query_1 = require("../query/user.query");
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const middleware_1 = require("../middleware");
const session_query_1 = require("../query/session.query");
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
        const order = req.query.order;
        const page = Number(req.query.page);
        const take = Number(req.query.take);
        const search = req.query.search;
        const { users, totalUsers } = await (0, user_query_1.getAllUsers)(user?.email || "", take, page, order, search ? search.toString().toLowerCase() : "");
        users?.length
            ? res.status(200).json({ status: true, data: users, totalUsers })
            : res.status(400).json({ message: "No other user available" });
    }
    catch (error) {
        next(error);
    }
});
router.post("/sign-up", async (req, res, next) => {
    try {
        req.body.password = (0, bcrypt_1.hashPass)(req.body.password);
        const user = await (0, user_query_1.createUser)(req.body);
        user.password = undefined;
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
router.post("/sign-in", async (req, res, next) => {
    try {
        const user = await (0, user_query_1.getUserByEmail)(req.body.email);
        if (!user) {
            next(new Error("User not found"));
        }
        const isPasswordCorrect = (0, bcrypt_1.comparePassword)(req.body.password, user.password);
        if (!isPasswordCorrect) {
            next(new Error("Incorrect Password"));
        }
        return res.json({
            status: true,
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
router.post("/logout", middleware_1.auth, async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const user = req.userInfo;
        const result = await (0, session_query_1.findSessionAndDelete)(token, user?.email || "");
        result ? res.json({ status: true }) : next(new Error("Unable to logout"));
    }
    catch (error) {
        next(error);
    }
});
router.patch("/new-accessJWT", async (req, res, next) => {
    try {
        const result = (0, jwt_1.verifyRefreshJWT)(req.headers.refreshjwt);
        if (result?.email) {
            const token = await (0, jwt_1.createAccessJWT)(result.email);
            return res.json({
                status: true,
                data: token,
            });
        }
        else {
            return res.json({
                status: false,
                message: "Unexxpected error occured.",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
