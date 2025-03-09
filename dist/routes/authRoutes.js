"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_validators_1 = __importDefault(require("../validators/auth.validators"));
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/signup', (0, auth_validators_1.default)('signup'), auth_controller_1.signup);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', (0, auth_validators_1.default)('login'), auth_controller_1.login);
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Refresh token to generate a new access token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Bad request (Invalid or missing refresh token)
 *       401:
 *         description: Unauthorized
 */
router.post('/refresh', auth_controller_1.refreshToken);
/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get logged-in user details
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 */
router.get('/profile', auth_middleware_1.authMiddleware, auth_controller_1.getProfile);
exports.default = router;
