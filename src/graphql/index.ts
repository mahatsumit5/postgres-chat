import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "../graphql/resolvers/index";
import { UserAPI } from "./datasource/user.api";
import { typeDefs } from "./typedefs/index";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { DataSourceContext } from "./types/context";
import { FriendRequestAPI } from "./datasource/friendRequest.api";
import { PostAPI } from "./datasource/post.api";
import { WebSocketServer } from "ws";
import { app, httpServer } from "..";
import { useServer } from "graphql-ws/dist/use/ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
export async function startApolloServer() {
  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: "/subscriptions",
  });
  wsServer.on("listening", () => {});
  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        // Proper shutdown for the WebSocket server.
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server)
  );
  // const { url } = await startStandaloneServer(server, {
  //   context: async ({ req, res }): Promise<DataSourceContext> => {
  //     const token = req.headers.authorization as string;
  //     const { cache } = server;
  //     return {
  //       dataSources: {
  //         userAPI: new UserAPI({ cache }, token),
  //         friendReqAPI: new FriendRequestAPI({ cache }, token),
  //         postAPI: new PostAPI({ cache }, token),
  //       },
  //     };
  //   },
  // });
  // console.log(` 🚀  Server is running! 📭  Query at ${url} `);
  const PORT = 4000;
  // Now that our HTTP server is fully set up, we can listen to it.
  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
  });
}
