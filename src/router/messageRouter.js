import { Router } from "express";
import { getMessage, sendMessage } from "../queries/messageModel.js";
const router = Router();

router.post("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { content } = req.body;
    console.log(req.params, req.body);
    const result = await sendMessage({ content, email });
    result.id
      ? res.json({
          status: true,
          message: "Message sent.",
        })
      : res.json({
          status: false,
          message: "Failed to send the message.",
        });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});

router.get("/:fromId/:toId", (req, res) => {
  try {
    const message = getMessage(req.params);
    res.json({
      status: true,
      message,
    });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});
export default router;
