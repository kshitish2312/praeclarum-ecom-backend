"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = require(".././Logger/logger");
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./productRoutes"));
const cardRoutes_1 = __importDefault(require("./cardRoutes"));
const orderRoutes_1 = __importDefault(require("./orderRoutes"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    (0, logger_1.logInfo)('API health check');
    res.send('Welcome to the Home route');
});
/**
 * @swagger
 * /about:
 *   get:
 *     description: About route
 *     responses:
 *       200:
 *         description: About message
 */
router.get('/about', (req, res) => {
    (0, logger_1.logInfo)('About route accessed');
    res.send('This is the About route');
});
router.use('/auth', authRoutes_1.default);
router.use('/products', productRoutes_1.default);
router.use('/cart', cardRoutes_1.default);
router.use('/orders', orderRoutes_1.default);
exports.default = router;
