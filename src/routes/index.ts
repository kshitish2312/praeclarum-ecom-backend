import { Router } from 'express';
import { logInfo, logError } from '.././Logger/logger';
import authRoutes from '../routes/authRoutes'
import productRoutes from './productRoutes'
import cardRoutes from './cardRoutes'
import orderRoutes from './orderRoutes'
const router = Router();

router.get('/', (req, res) => {
  logInfo('API health check');
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
  logInfo('About route accessed');
  res.send('This is the About route');
});


router.use('/auth',authRoutes)
router.use('/products',productRoutes)
router.use('/cart',cardRoutes)
router.use('/orders',orderRoutes)

export default router;
