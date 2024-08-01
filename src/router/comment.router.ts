import { Router } from "express";
import { postComment } from "../query/comment.query";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const comment = await postComment(req.body);
    comment?.id
      ? res.json({ status: true, message: "New comment added", comment })
      : new Error("Unable to create a new comment");
  } catch (error) {
    next(error);
  }
});
export default router;
