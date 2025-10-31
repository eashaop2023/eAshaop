const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EashaOP API Documentation",
      version: "1.0.0",
      description: "API documentation for EashaOP backend (Doctors, Patients, Appointments, etc.)",
    },
    servers: [
      {
        url: "http://localhost:5000", // change to your production URL later
      },
    ],
    components: {          // <-- Move components here inside definition
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token in the format: Bearer <your_token>",
        },
      },
    },
  },
  apis: [
    "./routes/*.js",
    "./routes/**/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📘 Swagger Docs available at: http://localhost:5000/api-docs`);
}

module.exports = swaggerDocs;
