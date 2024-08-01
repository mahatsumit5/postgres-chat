import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPost,
  updatePost,
} from "../query/post.query";
import { validatePost } from "../utils/data.validation";
import { upload } from "../middleware";
import { likePost, removeLike } from "../query/postLike.query";

const router = Router();

router.post("/", upload.array("images"), async (req, res, next) => {
  try {
    const file = req.files as Express.MulterS3.File[];
    if (file.length) {
      req.body.images = file.map((item) => item.location);
    }
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

    posts?.length
      ? res.status(200).json({ status: true, posts })
      : res.status(400).json({ message: "No posts available." });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const post = await deletePost(req.params.id);
    post?.id
      ? res.json({
          status: true,
          message: "Post deleted successfully",
          post,
        })
      : new Error("Unable to delete post");
  } catch (error) {
    next(error);
  }
});
router.put("/", async (req, res, next) => {
  try {
    const updatedPost = await updatePost(req.body);
    updatedPost?.id
      ? res.json({
          status: true,
          message: "Post updated successfully",
          updatedPost,
        })
      : new Error("unable to update post");
  } catch (error) {
    next(error);
  }
});
router.put("/like", async (req, res, next) => {
  try {
    const user = req.userInfo;
    const likedPost = await likePost(user?.id!, req.body.postId);
    likedPost?.id
      ? res.json({
          status: true,
          message: "Post liked successfully",
          likedPost,
        })
      : new Error("Unable to like post");
  } catch (error) {
    next(error);
  }
});
router.delete("/remove-like/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedLike = await removeLike(id);
    deletedLike?.id
      ? res.json({
          status: true,
          message: "Like removed successfully",
        })
      : new Error("Unable to remove like");
  } catch (error) {
    next(error);
  }
});
export default router;
