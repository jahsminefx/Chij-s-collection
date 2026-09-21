import express from 'express';
import { login, logout, getMe } from '../controllers/authController.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateAdmin, getMe);

export default router;
