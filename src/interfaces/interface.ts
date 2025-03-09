interface Config {
  PORT: number;
  NODE_ENV: String;
  DB_HOST: String | Number;
  DB_PORT: String;
  DB_USERNAME: String;
  DB_PASSWORD: String;
  DB_NAME: String;
  JWT_SECRET: String;
  REDIS_HOST: any;
  REDIS_PORT: Number;
  REDIS_TTL: Number;
  AWS_ACCESS_KEY_ID: String;
  AWS_SECRET_ACCESS_KEY: String;
  AWS_REGION: String;
  AWS_S3_BUCKET_NAME: String;
}

import { Request } from "express";

interface AuthRequest extends Request {
  user?: any; // Replace 'any' with your actual user type (e.g., User interface)
}

export { Config, AuthRequest };
