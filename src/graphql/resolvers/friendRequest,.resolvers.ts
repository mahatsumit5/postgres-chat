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
    // deleteFriendRequest() {},

    // acceptFriendRequest() {},
  },
};
