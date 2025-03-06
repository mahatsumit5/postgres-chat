import { mergeResolvers } from "@graphql-tools/merge";
import { userResolvers } from "./user.resolvers";

export const resolvers = mergeResolvers([userResolvers]);
