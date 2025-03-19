import { executeQuery, prisma } from "../script";
import { CreatePostParams, UpdataPostParams } from "../types";
const SELECT_USER_PROFILE = {
  email: true,
  fName: true,
  lName: true,
  id: true,
  profile: true,
};

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
          select: SELECT_USER_PROFILE,
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

export const getAllPost = async (
  page: number,
  take: number,
  userId: string
) => {
  const skip = (page - 1) * take;
  const data = await executeQuery(
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        images: true,

        author: {
          select: SELECT_USER_PROFILE,
        },
        // likes: {
        //   select: {
        //     id: true,
        //     user: {
        //       select: SELECT_USER_PROFILE,
        //     },
        //   },
        // },
        // comments: {
        //   select: {
        //     id: true,
        //     content: true,
        //     author: {
        //       select: SELECT_USER_PROFILE,
        //     },
        //     createdAt: true,
        //     likes: true,
        //   },
        // },

        _count: {
          select: {
            comments: true,
            likes: true,
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
  const count = await executeQuery(prisma.post.count());

  // Check if the logged-in user has liked each post
  const postIds = data.map((post: { id: string }) => post.id); // Extracting the post ids
  // Query the PostLike table to see if the user has liked any posts
  const userLikes = await prisma.postLike.findMany({
    where: {
      userId: userId,
      postId: {
        in: postIds, // Filter by the posts that were fetched
      },
    },
    select: {
      postId: true,
    },
  });

  // Convert userLikes to a set of postIds for easier lookup
  const likedPostIds = new Set(userLikes.map((like) => like.postId));

  // Add hasLiked field to the posts
  const postsWithHasLiked = data.map((post: { id: string }) => ({
    ...post,
    hasLiked: likedPostIds.has(post.id), // Check if the post is in the likedPostIds set
  }));
  return { postsWithHasLiked, count };
};

export const getPostByUser = (authorId: string) => {
  return executeQuery(
    prisma.post.findMany({
      where: {
        authorId,
      },
      select: {
        author: {
          select: SELECT_USER_PROFILE,
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
