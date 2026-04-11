import express from 'express';
import { getMessagesByTeam, createMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/:teamId').get(protect, getMessagesByTeam).post(protect, createMessage);

export default router;
