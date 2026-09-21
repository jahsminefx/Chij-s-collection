import express from 'express';
import { handleUpload } from '../controllers/uploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = express.Router();

router.post('/', authenticateAdmin, upload.array('images', 10), handleUpload);

export default router;
