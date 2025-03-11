import { mergeResolvers } from "@graphql-tools/merge";
import { userResolvers } from "./user.resolvers";
import { postResolvers } from "./post.resolvers";
import { friendRequestResolvers } from "./friendRequest.resolvers";
import { subscriptionsResolvers } from "./subscription.resolvers";

export const resolvers = mergeResolvers([
  userResolvers,
  postResolvers,
  friendRequestResolvers,
  subscriptionsResolvers,
]);
