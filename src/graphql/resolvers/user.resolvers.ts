import { Resolvers } from "../types/types";

export const userResolvers: Resolvers = {
  Query: {
    allUsers: (parent, args, { dataSources }) => {
      dataSources.userAPI;
      return [];
    },
  },
  User: {},
};
