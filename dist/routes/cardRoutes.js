"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cardItemsController_1 = require("../controllers/cardItemsController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
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
router.post("/", auth_middleware_1.authMiddleware, cardItemsController_1.addToCart);
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
router.get("/", auth_middleware_1.authMiddleware, cardItemsController_1.getCart);
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
router.put("/:id", auth_middleware_1.authMiddleware, cardItemsController_1.updateCartItem);
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
router.delete("/:id", auth_middleware_1.authMiddleware, cardItemsController_1.removeCartItem);
exports.default = router;
