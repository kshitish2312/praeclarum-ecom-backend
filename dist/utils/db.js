"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("../Logger/logger");
const config_1 = require("../config/config");
const User_1 = require("../entities/User");
const Product_1 = require("../entities/Product");
const Order_1 = require("../entities/Order");
const OrderItem_1 = require("../entities/OrderItem");
const CartItem_1 = require("../entities/CartItem");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: String(config_1.config.DB_HOST),
    port: Number(config_1.config.DB_PORT),
    username: String(config_1.config.DB_USERNAME),
    password: String(config_1.config.DB_PASSWORD),
    database: String(config_1.config.DB_NAME),
    synchronize: false,
    logging: false,
    entities: [User_1.User, Order_1.Order, OrderItem_1.OrderItem, CartItem_1.CartItem, Product_1.Product],
    migrations: ['src/migrations/*.ts'],
    subscribers: [],
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.AppDataSource.initialize();
        (0, logger_1.logInfo)('Database connected successfully');
    }
    catch (error) {
        (0, logger_1.logError)(`Database connection failed${error}`);
    }
});
exports.connectDB = connectDB;
exports.default = exports.AppDataSource;
