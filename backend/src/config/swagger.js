const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "API docs for Task Manager app"
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1"
      }
    ]
  },
  apis: ["./src/routes/v1/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
