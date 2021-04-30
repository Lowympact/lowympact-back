const express = require("express");
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");

// Initialize Swagger
const swaggerInit = () => {
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
            host: "api.lowympact.fr",
            basePath: "/api/v1",
        },
        apis: ["server.js", "./routes/*.js"],
    };

    const swaggerDocs = swaggerJsDoc(swaggerOptions);

    return swaggerDocs;
};

module.exports = swaggerInit;
