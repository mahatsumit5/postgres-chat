import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "../graphql/resolvers/index";
import { UserAPI } from "./datasource/user.api";
import { typeDefs } from "./typedefs/index";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { DataSourceContext } from "./types/context";
import { FriendRequestAPI } from "./datasource/friendRequest.api";
import { PostAPI } from "./datasource/post.api";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
export async function startApolloServer() {
  const server = new ApolloServer<DataSourceContext>({ schema });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }): Promise<DataSourceContext> => {
      const token = req.headers.authorization as string;
      const { cache } = server;
      return {
        dataSources: {
          userAPI: new UserAPI({ cache }, token),
          friendReqAPI: new FriendRequestAPI({ cache }, token),
          postAPI: new PostAPI({ cache }, token),
        },
      };
    },
  });
  console.log(` 🚀  Server is running! 📭  Query at ${url} `);
}
