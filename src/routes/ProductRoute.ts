import express from 'express';
import { getAllProducts } from '../controllers/ProductController';
import { protect } from '../middleware/protect';

const router = express.Router();

router.get('/', protect, getAllProducts);

export default router;
