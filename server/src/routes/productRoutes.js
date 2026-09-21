import express from 'express';
import {
  getPublicProducts,
  getPublicProductBySlug,
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleStock,
  togglePublish,
} from '../controllers/productController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = express.Router();

// Public routes
router.get('/', getPublicProducts);
router.get('/:slug', getPublicProductBySlug);

// Admin routes
router.get('/admin/all', authenticateAdmin, getAdminProducts);
router.get('/admin/:id', authenticateAdmin, getAdminProductById);
router.post('/', authenticateAdmin, createProduct);
router.put('/:id', authenticateAdmin, updateProduct);
router.delete('/:id', authenticateAdmin, deleteProduct);
router.patch('/:id/stock', authenticateAdmin, toggleStock);
router.patch('/:id/publish', authenticateAdmin, togglePublish);

export default router;
