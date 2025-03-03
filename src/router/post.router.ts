import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPost,
  getPostByUser,
  updatePost,
} from "../query/post.query";
import { upload } from "../middleware";
import { likePost, removeLike } from "../query/postLike.query";

const router = Router();

router.post("/", upload.array("images"), async (req, res, next) => {
  try {
    // const file = req.files as Express.MulterS3.File[];
    // if (file.length) {
    //   req.body.images = file.map((item) => item.location);
    // }
    console.log("this is req.body", req.body);
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
    const { page, take } = req.query;
    const { count, data } = getAllPost(Number(page), Number(take));
    console.log(req.query);
    const [posts, totalNumberOfPosts] = await Promise.all([data, count]);
    console.log(totalNumberOfPosts);
    posts?.length
      ? res.status(200).json({
          status: true,
          posts,
          totalNumberOfPosts,
          message: "Available posts",
        })
      : res.status(200).json({ message: "No posts available.", posts: [] });
  } catch (error) {
    next(error);
  }
});
router.get("/user/:userId", async (req, res, next) => {
  try {
    const posts = await getPostByUser(req.params.userId);

    posts?.length
      ? res.status(200).json({
          status: true,
          posts,
          message: "Avialbe posts",
        })
      : res.status(400).json({ message: "No posts available." });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const user = req.userInfo;

    if (!user) throw new Error("Logged in user id is required");

    const post = await deletePost(req.params.id, user?.id!);
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
    if (!user?.id) throw new Error("Userid is required");
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
router.put("/remove-like", async (req, res, next) => {
  try {
    const deletedLike = await removeLike(req.body);
    deletedLike?.id
      ? res.json({
          status: true,
          message: "Like removed successfully",
          deletedLike,
        })
      : new Error("Unable to remove like");
  } catch (error) {
    next(error);
  }
});
export default router;
