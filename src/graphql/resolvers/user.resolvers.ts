import { Resolvers, SignInUser, SignUpUser } from "../types/types";

export const userResolvers: Resolvers = {
  Mutation: {
    signUp: (parent, { input }, { dataSources }) => {
      return dataSources.userAPI.signUp(input as SignUpUser);
    },
    signIn: (parent, { input }, { dataSources }) => {
      return dataSources.userAPI.signIn(input as SignInUser);
    },
    logout: (_, __, { dataSources }) => {
      return dataSources.userAPI.logout();
    },
    resetPassword: (_, { newPassword }, { dataSources }) => {
      return dataSources.userAPI.resetPassword(newPassword);
    },
    newJwt: (_, __, { dataSources }) => {
      return dataSources.userAPI.newJwt();
    },
    updateUser: (_, __, { dataSources }) => {
      return dataSources.userAPI.updateUser();
    },
    uploadProfile: () => {
      return {
        status: true,
        message: "Todo complete this functino",
      };
    },
  },
  Query: {
    allUsers: (__, { params }, { dataSources }) => {
      return dataSources.userAPI.allUsers(params!);
    },
    loggedInUser: (__, args, { dataSources }) => {
      return dataSources.userAPI.loggedInUser();
    },
  },
};
