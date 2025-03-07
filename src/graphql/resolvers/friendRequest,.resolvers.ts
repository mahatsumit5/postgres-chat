import { Resolvers } from "../types/types";

export const friendRequestResolvers: Resolvers = {
  //   Query: {
  //     getFriendRequest() {},
  //     getSentFriendRequest() {},
  //   },
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
