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
import { GraphQLError } from "graphql";
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
export async function startApolloServer() {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const wsServerCleanup = useServer(
    {
      schema,
      context: async (ctx, msg, args) => {
        console.log(ctx.connectionParams, "ctx.connectionParams");
        // if (!ctx.connectionParams?.authorization) {
        //   throw new GraphQLError("Authorization header is required", {
        //     extensions: {
        //       code: "UNAUTHENTICATED",
        //     },
        //   });
        // }
        return {
          dataSources: {
            userAPI: new UserAPI({ cache: server.cache }, ""),
            friendReqAPI: new FriendRequestAPI({ cache: server.cache }, ""),
            postAPI: new PostAPI({ cache: server.cache }, ""),
          },
        };
      },
    },
    wsServer
  );
  const server = new ApolloServer({
    schema,

    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await wsServerCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: [
        process.env.WEB_DOMAIN as string,
        "http://192.168.20.8:5173",
        "http://localhost:5173",
      ],
      methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
      allowedHeaders: ["Authorization", "refreshjwt", "Content-Type"],
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
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
    })
  );

  const PORT = 8080;
  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
  });
}
