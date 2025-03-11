import fs from "fs";
import path from "path";
import { mergeTypeDefs } from "@graphql-tools/merge";

const chatRoomSchema = fs.readFileSync(
  path.join(__dirname, "..", "..", "..", "./schema/chatRoom.graphql"),
  { encoding: "utf-8" }
);

const commentSchema = fs.readFileSync(
  path.join(__dirname, "..", "..", "..", "./schema/comment.graphql"),
  { encoding: "utf-8" }
);
const messageSchema = fs.readFileSync(
  path.join(__dirname, "..", "..", "..", "./schema/message.graphql"),
  { encoding: "utf-8" }
);

const postSchema = fs.readFileSync(
  path.join(__dirname, "..", "..", "..", "./schema/post.graphql"),
  { encoding: "utf-8" }
);

const requestSchema = fs.readFileSync(
  path.join(__dirname, "..", "..", "..", "./schema/request.graphql"),
  { encoding: "utf-8" }
);
const responseSchema = fs.readFileSync(
  path.join(__dirname, "..", "..", "..", "./schema/response.graphql"),
  { encoding: "utf-8" }
);
const userSchema = fs.readFileSync(
  path.join(__dirname, "..", "..", "..", "./schema/user.graphql"),
  { encoding: "utf-8" }
);
const subscriptionSchema = fs.readFileSync(
  path.join(__dirname, "..", "..", "..", "./schema/subscription.graphql"),
  { encoding: "utf-8" }
);

// Merge schemas
export const typeDefs = mergeTypeDefs([
  userSchema,
  postSchema,
  commentSchema,
  responseSchema,
  messageSchema,
  chatRoomSchema,
  requestSchema,
  subscriptionSchema,
]);
