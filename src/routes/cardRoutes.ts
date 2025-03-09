import express from "express";
import { addToCart, getCart, updateCartItem, removeCartItem } from "../controllers/cardItemsController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 101
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       404:
 *         description: User or product not found
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware,addToCart);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: List cart items
 */
router.get("/",authMiddleware,getCart);

/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authMiddleware, updateCartItem);


/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Cart item removed successfully
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id",authMiddleware,removeCartItem);

export default router;
