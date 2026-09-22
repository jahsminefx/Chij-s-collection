import express from 'express';
import {
  getPublicHeroSlides,
  getAdminHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
} from '../controllers/heroSlideController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = express.Router();

// Public route for storefront homepage
router.get('/', getPublicHeroSlides);

// Admin protected routes
router.get('/admin', authenticateAdmin, getAdminHeroSlides);
router.post('/admin', authenticateAdmin, createHeroSlide);
router.put('/admin/reorder', authenticateAdmin, reorderHeroSlides);
router.put('/admin/:id', authenticateAdmin, updateHeroSlide);
router.delete('/admin/:id', authenticateAdmin, deleteHeroSlide);

export default router;
