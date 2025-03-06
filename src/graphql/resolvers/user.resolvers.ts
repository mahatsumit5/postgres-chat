import { Resolvers, SignInUser, SignUpUser } from "../types/types";

export const userResolvers: Resolvers = {
  Mutation: {
    signUp: (parent, { input }, { dataSources }) => {
      return dataSources.userAPI.signUp(input as SignUpUser);
    },
    signIn: (parent, { input }, { dataSources }) => {
      return dataSources.userAPI.signIn(input as SignInUser);
    },
  },
  Query: {
    users: (__, args, { dataSources }) => {
      return [];
    },
    allUsers: (__, args, { dataSources }) => {
      return dataSources.userAPI.allUsers();
    },
    loggedInUser: (__, args, { dataSources }) => {
      return dataSources.userAPI.loggedInUser();
    },
  },
};
