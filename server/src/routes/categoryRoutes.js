import express from 'express';
import {
  getPublicCategories,
  getPublicCategoryBySlug,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = express.Router();

// Public routes
router.get('/', getPublicCategories);
router.get('/:slug', getPublicCategoryBySlug);

// Admin routes
router.get('/admin/all', authenticateAdmin, getAdminCategories);
router.post('/', authenticateAdmin, createCategory);
router.put('/:id', authenticateAdmin, updateCategory);
router.delete('/:id', authenticateAdmin, deleteCategory);

export default router;
