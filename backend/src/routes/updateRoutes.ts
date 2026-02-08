import { Router } from 'express';
import { getUpdatesByIncident, createUpdate, deleteUpdate } from '../controllers/updateController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../entities/User';

const router = Router();

router.get('/incident/:incidentId', getUpdatesByIncident);
router.post('/', authenticate, authorize(UserRole.ENGINEER, UserRole.ADMIN), createUpdate);
router.delete('/:id', authenticate, deleteUpdate);

export default router;
