import { Router } from "express";
import {
  deleteComment,
  getCommentsByPostId,
  likeComment,
  postComment,
  unlikeComment,
  updateComment,
} from "../query/comment.query";

const router = Router();

router.get("/:id", async (req, res, next) => {
  try {
    const comments = await getCommentsByPostId(req.params.id);
    comments.length
      ? res.json({ status: true, message: "Comments data", comments })
      : res.json({ comments: [] });
  } catch (error) {
    next(error);
  }
});
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

router.delete("/delete-comment/:commentId", async (req, res, next) => {
  try {
    const deletedComment = await deleteComment(
      req.userInfo?.id!,
      req.params.commentId
    );
    deletedComment?.id
      ? res.json({
          status: true,
          message: "Comment deleted",
          data: deletedComment,
        })
      : new Error("Unable to delete a comment");
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const updatedComment = await updateComment(req.body);
    updatedComment?.id
      ? res.json({ status: true, message: "Comment updated", updatedComment })
      : new Error("Unable to update a comment");
  } catch (error) {
    next(error);
  }
});

// commment likes
router.post("/like-comment", async (req, res, next) => {
  try {
    const likedComment = await likeComment(
      req.body.commentId,
      req.userInfo?.id!
    );
    likedComment
      ? res.json({ status: true, message: "Comment liked", likedComment })
      : new Error("Unable to like a comment");
  } catch (error) {
    next(error);
  }
});
router.delete("/unlike-comment/:likeid", async (req, res, next) => {
  try {
    const unlikedComment = await unlikeComment(
      req.params.likeid,
      req.userInfo?.id!
    );

    unlikedComment
      ? res.json({ status: true, message: "Comment liked", unlikedComment })
      : new Error("Unable to like a comment");
  } catch (error) {
    next(error);
  }
});
export default router;
