import { Router } from 'express';
import {
  getAllIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  resolveIncident,
  publishIncident,
  addIncidentUpdate,
  getIncidentUpdates,
  deleteIncident
} from '../controllers/incidentController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../entities/User';

const router = Router();

// All incident routes require authentication
router.get('/', authenticate, getAllIncidents);
router.get('/:id', authenticate, getIncidentById);
router.post('/', authenticate, authorize(UserRole.ENGINEER, UserRole.ADMIN), createIncident);
router.patch('/:id', authenticate, authorize(UserRole.ENGINEER, UserRole.ADMIN), updateIncident);
router.patch('/:id/resolve', authenticate, authorize(UserRole.ENGINEER, UserRole.ADMIN), resolveIncident);
router.patch('/:id/publish', authenticate, authorize(UserRole.ENGINEER, UserRole.ADMIN), publishIncident);
router.post('/:id/updates', authenticate, authorize(UserRole.ENGINEER, UserRole.ADMIN), addIncidentUpdate);
router.get('/:id/updates', authenticate, getIncidentUpdates);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteIncident);

export default router;
