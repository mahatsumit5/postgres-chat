"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_query_1 = require("../query/message.query");
const router = (0, express_1.Router)();
router.post("/", async (req, res, next) => {
    try {
        console.log(req.body);
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
router.get("/:id", async (req, res, next) => {
    try {
        console.log(req.params.id);
        const messages = await (0, message_query_1.getMessageByUsers)(req.params.id);
        console.log(messages);
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
exports.default = router;
