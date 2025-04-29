import express from 'express';
import { protect } from '../middleware/protect';
import { addToCart, checkoutCart, removeFromCart } from '../controllers/CartController';

const router = express.Router();

router.post('/add', protect, addToCart);
router.post('/remove', protect, removeFromCart);
router.post('/checkout', protect, checkoutCart);

export default router;
