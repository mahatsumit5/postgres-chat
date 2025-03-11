import { executeQuery, prisma } from "../script";
import { CreateCommentParams, UpdateCommentParams } from "../types";

export function postComment({ content, postId, userId }: CreateCommentParams) {
  return executeQuery(
    prisma.comment.create({
      data: {
        content,
        author: {
          connect: {
            id: userId,
          },
        },

        post: {
          connect: {
            id: postId,
          },
        },
        replies: {},
      },
      include: {
        likes: true,
        author: {
          select: {
            id: true,
            bio: true,
            coverPicture: true,
            email: true,
            fName: true,
            lName: true,
            profile: true,
          },
        },
      },
    })
  );
}

export function updateComment({
  commentId,
  content,
  uid,
}: UpdateCommentParams) {
  return executeQuery(
    prisma.comment.update({
      where: {
        id: commentId,
        authorId: uid,
      },
      data: {
        content,
      },
    })
  );
}
export function deleteComment(uid: string, commentId: string) {
  return executeQuery(
    prisma.comment.delete({
      where: {
        authorId: uid,
        id: commentId,
      },
    })
  );
}
export function likeComment(commentId: string, uid: string) {
  return executeQuery(
    prisma.commentLikes.create({
      data: {
        comment: {
          connect: {
            id: commentId,
          },
        },
        user: {
          connect: {
            id: uid,
          },
        },
      },
      select: {
        userId: true,
      },
    })
  );
}

export function unlikeComment(commentId: string, userId: string) {
  return executeQuery(
    prisma.commentLikes.delete({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    })
  );
}

export function getCommentsByPostId(postId: string) {
  return executeQuery(
    prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            fName: true,
            bio: true,
            coverPicture: true,
            lName: true,
            profile: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    })
  );
}
