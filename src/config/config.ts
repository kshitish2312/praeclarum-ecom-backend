import { Config } from "../interfaces/interface";
import dotenv from "dotenv";

dotenv.config();

const config: Config = {
  PORT: Number(process.env.PORT),
  NODE_ENV: String(process.env.NODE_ENV),
  DB_HOST: String(process.env.DB_HOST),
  DB_PORT: String(process.env.DB_PORT),
  DB_USERNAME: String(process.env.DB_USERNAME),
  DB_PASSWORD: String(process.env.DB_PASSWORD),
  DB_NAME: String(process.env.DB_NAME),
  JWT_SECRET: String(process.env.JWT_SECRET),
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: Number(process.env.REDIS_PORT),
  REDIS_TTL: Number(process.env.REDIS_TTL),
  AWS_ACCESS_KEY_ID: String(process.env.AWS_ACCESS_KEY_ID),
  AWS_SECRET_ACCESS_KEY: String(process.env.AWS_SECRET_ACCESS_KEY),
  AWS_REGION:String(process.env.AWS_REGION),
  AWS_S3_BUCKET_NAME: String(process.env.AWS_S3_BUCKET_NAME),
};

export { config };
