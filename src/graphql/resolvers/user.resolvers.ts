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
      console.log(dataSources.token);
      return dataSources.userAPI.newJwt(dataSources.token);
    },
    updateUser: (_, __, { dataSources }) => {
      return dataSources.userAPI.updateUser();
    },
  },
  Query: {
    allUsers: (__, args, { dataSources }) => {
      return dataSources.userAPI.allUsers(dataSources.token);
    },
    loggedInUser: (__, args, { dataSources }) => {
      return dataSources.userAPI.loggedInUser(dataSources.token);
    },
  },
};
