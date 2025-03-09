"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
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
    AWS_REGION: String(process.env.AWS_REGION),
    AWS_S3_BUCKET_NAME: String(process.env.AWS_S3_BUCKET_NAME),
};
exports.config = config;
