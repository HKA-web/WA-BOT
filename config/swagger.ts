import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Application Programming Interface",
      version: "1.0.0",
    },
  },
  apis: ["api-docs/**/*.ts"], // path relatif terhadap root
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(botServer: express.Express) {
  botServer.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
