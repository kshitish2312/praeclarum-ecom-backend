import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { logger, logInfo } from "./Logger/logger";
import { config } from "./config/config";
import routes from "./routes";
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger';
import { connectDB } from "./utils/db";

dotenv.config();

const app = express();
const PORT = config.PORT;

app.use(express.json());
app.use(cors());

connectDB()
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));




app.use(routes);

const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if ((error as any).code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use`);
  } else {
    logger.error(`Server error: ${error.message}`);
  }
  process.exit(1);
});