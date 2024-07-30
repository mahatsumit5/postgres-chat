import { executeQuery, prisma } from "../../script";
import { CreatePostParams } from "../types";

export const createPost = async ({ id, ...rest }: CreatePostParams) => {
  return await executeQuery(
    prisma.post.create({
      data: {
        ...rest,
        author: {
          connect: {
            id,
          },
        },
      },
    })
  );
};
export const getAllPost = async () => {
  return executeQuery(prisma.post.findMany());
};
