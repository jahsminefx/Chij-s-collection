import express from 'express';
import {
  getPublicStoreSettings,
  getAdminStoreSettings,
  updateStoreSettings,
} from '../controllers/storeController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = express.Router();

// Public routes
router.get('/', getPublicStoreSettings);

// Admin routes
router.get('/admin', authenticateAdmin, getAdminStoreSettings);
router.put('/', authenticateAdmin, updateStoreSettings);

export default router;
