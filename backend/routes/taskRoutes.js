import express from 'express';
import { createTask, getTasksByTeam, updateTaskStatus } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, createTask);
router.route('/team/:teamId').get(protect, getTasksByTeam);
router.route('/:id').put(protect, updateTaskStatus);

export default router;
