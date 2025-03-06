import { executeQuery, prisma } from "../script";

export function likePost(userId: string, postId: string) {
  return executeQuery(
    prisma.postLike.create({
      data: {
        post: {
          connect: {
            id: postId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
  );
}
export async function removeLike({ likeId }: { likeId: string }) {
  const result = await executeQuery(
    prisma.postLike.delete({
      where: {
        id: likeId,
      },
    })
  );
  return result;
}
