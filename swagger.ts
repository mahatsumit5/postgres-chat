import { object } from "joi";
import { dirname } from "path";
import swaggerJSDoc from "swagger-jsdoc";
console.log(__dirname);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "My Chat Application API", // API title
      version: "1.0.0", // API version
      description: "API description", // API description
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
    paths: {
      "/api/v1/user": {
        get: {
          summary: "Retrive logged in user",
          responses: {
            200: {
              description: "On success, returns User objects",
              content: {
                "application/json": {
                  schema: {
                    type: object,
                  },
                },
              },
            },
            401: {
              description: "Unauthorized",
            },
          },
        },
      },
      "api/v1/user/all-users": {
        get: {
          summary: "Returns list of users",
          responses: {
            200: {
              description: "Returns list of users on success",
            },
            400: {
              description: "No users available",
            },
            500: {
              description: "Unexpected error occured",
            },
          },
        },
      },
      "api/v1/user/logout": {
        post: {
          summary: "Logoout user",
          requestBody: {
            // required: true,
            content: {
              "application/json": {
                schema: {
                  type: object,
                  properties: {
                    name: {
                      type: "string",
                      example: "Sumit",
                    },
                  },
                  // required: ["name"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "On success, logout user",
            },
          },
        },
      },
    },
  },
  apis: ["./src/router/*.ts"], // Path to your API docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
