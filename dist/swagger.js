"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const environment = process.env.NODE_ENV || "development";
const port = process.env.PORT || "5000";
const serverUrl = environment === "production"
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
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }], // Make sure this matches exactly
    },
    apis: [path_1.default.join(__dirname, "routes", "*.ts"), path_1.default.join(__dirname, "routes", "*.js")],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
exports.default = swaggerDocs;
