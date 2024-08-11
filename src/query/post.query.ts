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
          select: {
            id: true,
          },
        },
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
  );
};
export const getAllPost = (skip: number, take: number) => {
  const data = executeQuery(
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
          select: {
            id: true,
          },
        },
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: take,
      skip,
    })
  );
  const count = executeQuery(prisma.post.count());

  return { data, count };
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
