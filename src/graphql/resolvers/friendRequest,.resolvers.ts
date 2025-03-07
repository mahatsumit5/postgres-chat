import { Resolvers } from "../types/types";

export const friendRequestResolvers: Resolvers = {
  Query: {
    getFriendRequest(_, args, { dataSources }) {
      return dataSources.friendReqAPI.getFriendRequest();
    },
    getSentFriendRequest(_, { queryParams }, { dataSources }) {
      return dataSources.friendReqAPI.getSentFriendRequest(queryParams!);
    },
  },
  Mutation: {
    sendRequest(_, { toID }, { dataSources }) {
      return dataSources.friendReqAPI.sendRequest(toID);
    },
    deleteFriendRequest(_, { params }, { dataSources }) {
      return dataSources.friendReqAPI.deleteFriendRequest(params!);
    },

    acceptFriendRequest(_, { body }, { dataSources }) {
      return dataSources.friendReqAPI.acceptFriendRequest(body!);
    },
  },
};
