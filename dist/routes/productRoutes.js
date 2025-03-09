"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const s3Upload_1 = __importDefault(require("../middleware/s3Upload"));
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *                 example: "Laptop"
 *               price:
 *                 type: number
 *                 description: Product price
 *                 example: 999.99
 *               stock:
 *                 type: integer
 *                 description: Available stock
 *                 example: 10
 *               description:
 *                 type: string
 *                 description: Product description
 *                 example: "A high-performance laptop"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product images (multiple files allowed)
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request data
 */
router.post('/', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, s3Upload_1.default.array('images', 5), productController_1.createProduct);
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get('/', auth_middleware_1.authMiddleware, productController_1.getAllProducts);
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:id', auth_middleware_1.authMiddleware, productController_1.getProductById);
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *                 example: "Updated Laptop"
 *               price:
 *                 type: number
 *                 description: Updated product price
 *                 example: 1199.99
 *               stock:
 *                 type: integer
 *                 description: Updated available stock
 *                 example: 5
 *               description:
 *                 type: string
 *                 description: Updated product description
 *                 example: "A high-performance laptop with more RAM"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Updated product images (optional)
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid request data
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
router.put('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, s3Upload_1.default.array('images', 5), productController_1.updateProduct);
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
router.delete('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, productController_1.deleteProduct);
exports.default = router;
