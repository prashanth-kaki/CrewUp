import express from 'express';
import { uploadResource, getResourcesByTeam } from '../controllers/resourceController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/').post(protect, upload.single('file'), uploadResource);
router.route('/team/:teamId').get(protect, getResourcesByTeam);

export default router;
