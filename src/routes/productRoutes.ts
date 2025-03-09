import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import upload from '../middleware/s3Upload';
const router = express.Router();

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

router.post('/', authMiddleware, adminMiddleware,upload.array('images',5) ,createProduct);

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
router.get('/', authMiddleware,getAllProducts);

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
router.get('/:id', authMiddleware,getProductById);

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
router.put('/:id', authMiddleware, adminMiddleware, upload.array('images',5),updateProduct);

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
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
