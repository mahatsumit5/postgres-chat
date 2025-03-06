import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "../graphql/resolvers/index";
import { UserAPI } from "./datasource/user.api";
import { typeDefs } from "./typedefs/index";
import { makeExecutableSchema } from "@graphql-tools/schema";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
export async function startApolloServer() {
  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => {
      const { cache } = server;
      return {
        dataSources: {
          userAPI: new UserAPI({
            token: req.headers.authorization as string,
            cache,
          }),
        },
      };
    },
  });
  console.log(` 🚀  Server is running! 📭  Query at ${url} `);
}
