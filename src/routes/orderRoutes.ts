import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController";

const router = express.Router();

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
router.post("/", authMiddleware, createOrder);

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
router.get("/", authMiddleware, adminMiddleware, getAllOrders);

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
router.get("/user", authMiddleware, getUserOrders);

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
router.get("/:id", authMiddleware, getOrderById);

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
router.put("/:id/cancel", authMiddleware, cancelOrder);

export default router;
