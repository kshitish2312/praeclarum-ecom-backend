import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const environment = process.env.NODE_ENV || "development";
const port = process.env.PORT || "5000";

const serverUrl =
  environment === "production"
    ? "https://your-production-domain.com" // Replace with your production URL
    : `http://localhost:${port}`;

    const swaggerOptions = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "Node TypeScript API",
          version: "1.0.0",
          description: "A simple Express API with Swagger and TypeScript",
        },
        servers: [{ url: serverUrl }],
        components: {
          securitySchemes: {
            bearerAuth: {  // Ensure this matches the `security` section
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [{ bearerAuth: [] }], // Make sure this matches exactly
      },
      apis: [path.join(__dirname, "routes", "*.ts"), path.join(__dirname, "routes", "*.js")],
    };
    

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
