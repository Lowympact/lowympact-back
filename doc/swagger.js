const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Initialize Swagger
exports.swagger = () => {
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "Lowympact API",
        description:
          "A HexaOne's project made at INSA Lyon - Lowympact is a food traceability application on top of Ethereum's blockchain",
        contact: {
          name: "HexaOne",
        },
        servers: ["https://api.lowympact.fr/"],
      },
    },
    apis: ["server.js", "./routes/*.js"],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
