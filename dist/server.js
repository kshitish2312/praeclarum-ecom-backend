"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("./Logger/logger");
const config_1 = require("./config/config");
const routes_1 = __importDefault(require("./routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
const db_1 = require("./utils/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = config_1.config.PORT;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
(0, db_1.connectDB)();
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.use(routes_1.default);
const server = app.listen(PORT, () => {
    logger_1.logger.info(`Server running on http://localhost:${PORT}`);
});
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        logger_1.logger.error(`Port ${PORT} is already in use`);
    }
    else {
        logger_1.logger.error(`Server error: ${error.message}`);
    }
    process.exit(1);
});
