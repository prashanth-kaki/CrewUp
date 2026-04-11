import express from 'express';
import { createTeam, getTeams, getTeamById, exploreTeams, joinTeam } from '../controllers/teamController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/explore', protect, exploreTeams);
router.route('/').post(protect, createTeam).get(protect, getTeams);
router.route('/:id').get(protect, getTeamById);
router.post('/:id/join', protect, joinTeam);

export default router;
