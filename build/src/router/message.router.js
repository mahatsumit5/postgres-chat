"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_query_1 = require("../query/message.query");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.post("/", middleware_1.upload.single("content"), async (req, res, next) => {
    try {
        const file = req.file;
        if (file) {
            req.body.content = file.location;
        }
        const result = await (0, message_query_1.sendMessage)(req.body);
        result?.id
            ? res.json({
                status: true,
                result,
            })
            : new Error("Unable to send message");
    }
    catch (error) {
        next(error);
    }
});
router.get("/", async (req, res, next) => {
    try {
        console.log(req.query);
        const { id, num } = req.query;
        const messages = await (0, message_query_1.getMessageByUsers)(id, Number(num));
        !messages
            ? next(new Error("Unable to get messages"))
            : res.json({
                status: true,
                result: messages,
            });
    }
    catch (error) {
        next(error);
    }
});
router.put("/", async (req, res, next) => {
    try {
        const result = await (0, message_query_1.messageSeenByRoom)(req.body);
        !result
            ? next(new Error("Unable to mark message as seen"))
            : res.json({
                status: true,
                message: "Success",
                result,
            });
    }
    catch (error) {
        next(error);
    }
});
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await (0, message_query_1.deleteMessage)(id);
        result
            ? res.json({
                status: true,
                message: "Success",
            })
            : next(new Error("Unable to delete message"));
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
