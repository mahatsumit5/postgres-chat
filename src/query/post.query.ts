import { executeQuery, prisma } from "../../script";
import { CreatePostParams, UpdataPostParams } from "../types";

export const createPost = ({ id, ...rest }: CreatePostParams) => {
  return executeQuery(
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
export const getAllPost = (take = 10) => {
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
        likes: {
          select: {
            id: true,
            userId: true,
            postId: true,
          },
        },
        images: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                fName: true,
                lName: true,
                email: true,
                profile: true,
              },
            },
            likes: {
              select: {
                userId: true,
              },
            },
          },
        },
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: take,
    })
  );
};

export const deletePost = (id: string, authorId: string) => {
  return executeQuery(
    prisma.post.delete({
      where: {
        id,
        authorId,
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
