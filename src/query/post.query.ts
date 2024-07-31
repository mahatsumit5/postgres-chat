import { executeQuery, prisma } from "../../script";
import { CreatePostParams, UpdataPostParams } from "../types";

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
  return executeQuery(
    prisma.post.findMany({
      select: {
        author: {
          select: {
            email: true,
            fName: true,
            lName: true,
            id: true,
            profile: true,
          },
        },
        id: true,
        likes: true,
        images: true,
        comment: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  );
};

export const deletePost = async (id: string) => {
  return executeQuery(
    prisma.post.delete({
      where: {
        id,
      },
    })
  );
};
export const updatePost = ({ id, ...rest }: UpdataPostParams) => {
  return executeQuery(
    prisma.post.update({
      where: {
        id,
      },
      data: { ...rest },
    })
  );
};
