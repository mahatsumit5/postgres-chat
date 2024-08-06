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
        comments: true,
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
  console.log("thi is id coming from frontend", id);
  const deletedPost = await executeQuery(
    prisma.post.delete({
      where: {
        id: id,
      },
    })
  );
  console.log(deletedPost);
  return deletedPost;
};
deletePost("a667bc41-cc22-48fc-b1b8-24b779e7f40f");
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
