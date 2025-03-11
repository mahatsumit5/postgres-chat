import { Resolvers } from "../types/types";

export const postResolvers: Resolvers = {
  Query: {
    getPosts: (parent, args, { dataSources }) => {
      return dataSources.postAPI.getAllPost();
    },
  },
};
