"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_query_1 = require("../query/user.query");
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const middleware_1 = require("../middleware");
const __1 = require("../..");
const router = (0, express_1.Router)();
router.get("/", middleware_1.loggedInUserAuth, async (req, res, next) => {
    try {
        console.log(req.auth);
        const user = req.userInfo;
        user?.id
            ? res.json({ status: true, data: user, req: req.auth })
            : res.status(404).json({ message: "No user found.", status: false });
    }
    catch (error) {
        next(error);
    }
});
router.get("/all-users", async (req, res, next) => {
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
router.post("/logout", async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const user = req.userInfo;
        delete __1.sessions[token];
        res.json({ status: true });
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
router.put("/reset-password", async (req, res, next) => {
    try {
        const user = req.userInfo;
        if (!user)
            throw new Error("Not authorized");
        req.body.password = (0, bcrypt_1.hashPass)(req.body.password);
        const result = await (0, user_query_1.changePassword)({
            email: user.email,
            newPassword: req.body.password,
        });
        result
            ? res.status(200).json({
                status: true,
                message: "Password Changed",
            })
            : next(new Error("Unable to change your password"));
    }
    catch (error) {
        next(error);
    }
});
router.put("/upload-profile", middleware_1.upload.single("profile"), async (req, res, next) => {
    try {
        const user = req.userInfo;
        if (!user)
            throw new Error("Not authorized");
        const file = req.file;
        const imagePath = file.location;
        const result = await (0, user_query_1.uploadProfileImage)(user.email, imagePath);
        result
            ? res.status(200).json({
                status: true,
                message: "Profile Image Uploaded",
                result,
            })
            : next(new Error("Unable to upload your profile image"));
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
