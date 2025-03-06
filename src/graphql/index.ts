import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import { gql } from "graphql-tag";
import { join, resolve } from "path";
import { userResolvers } from "../graphql/resolvers/user.resolvers";
import { UserAPI } from "./datasource/user.api";

const typeDefs = gql(
  readFileSync(resolve(join(__dirname, "..", ".."), "./schema.graphql"), {
    encoding: "utf-8",
  })
);

export async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers: [userResolvers] });

  const context = async () => {
    const { cache } = server;
    return {
      dataSources: {
        userAPI: new UserAPI({ cache }),
      },
    };
  };

  const { url } = await startStandaloneServer(server, {
    context,
  });
  console.log(` 🚀  Server is running! 📭  Query at ${url} `);
}
