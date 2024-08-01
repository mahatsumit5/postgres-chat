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
export async function removeLike({ likeId }: { likeId: string }) {
  console.log("this is id", likeId);
  const result = await executeQuery(
    prisma.postLike.delete({
      where: {
        id: likeId,
      },
    })
  );
  console.log("this is result", result);
  return result;
}
