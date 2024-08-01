import { executeQuery, prisma } from "../../script";
import { CreateCommentParams } from "../types";

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
      },
    })
  );
}
