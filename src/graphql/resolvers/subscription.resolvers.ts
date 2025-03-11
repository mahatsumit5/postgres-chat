import { PubSub } from "graphql-subscriptions";
import { Resolvers } from "../types/types";
const pubsub = new PubSub();
export const subscriptionsResolvers: Resolvers = {
  Subscription: {
    postCreated: {
      subscribe: () => pubsub.asyncIterableIterator(["POST_CREATED"]),
    },
  },
};
