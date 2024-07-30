import { Router } from "express";
import { createPost, getAllPost } from "../query/post.query";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const result = await createPost(req.body);
    result?.id
      ? res.status(200).json({
          status: true,
          result,
        })
      : new Error("Unable to create a new post");
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const posts = await getAllPost();
    res.status(200).json({ status: true, posts });
  } catch (error) {
    next(error);
  }
});
export default router;
