import { Router } from 'express';
import { 
  getAllIncidents, 
  getIncidentById, 
  createIncident, 
  updateIncident, 
  deleteIncident 
} from '../controllers/incidentController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../entities/User';

const router = Router();

router.get('/', getAllIncidents);
router.get('/:id', getIncidentById);
router.post('/', authenticate, authorize(UserRole.ENGINEER, UserRole.ADMIN), createIncident);
router.put('/:id', authenticate, authorize(UserRole.ENGINEER, UserRole.ADMIN), updateIncident);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteIncident);

export default router;
