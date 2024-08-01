import { executeQuery, prisma } from "../../script";

export function likePost(userId: string, postId: string) {
  try {
    return executeQuery(
      prisma.postLike.create({
        data: {
          user: {
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
  } catch (error) {
    console.log(error);
  }
}
export function removeLike(id: string) {
  return executeQuery(
    prisma.postLike.delete({
      where: {
        id,
      },
    })
  );
}
