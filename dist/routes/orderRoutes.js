"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create an order (Checkout)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderItems
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       description: ID of the product
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orderId:
 *                   type: integer
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/", auth_middleware_1.authMiddleware, orderController_1.createOrder);
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.get("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, orderController_1.getAllOrders);
/**
 * @swagger
 * /orders/user:
 *   get:
 *     summary: Get orders of the logged-in user
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: User's order list
 *       500:
 *         description: Internal server error
 */
router.get("/user", auth_middleware_1.authMiddleware, orderController_1.getUserOrders);
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", auth_middleware_1.authMiddleware, orderController_1.getOrderById);
/**
 * @swagger
 * /orders/{id}/cancel:
 *   put:
 *     summary: Cancel an order (Only before shipping)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *       400:
 *         description: Order cannot be canceled
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id/cancel", auth_middleware_1.authMiddleware, orderController_1.cancelOrder);
exports.default = router;
