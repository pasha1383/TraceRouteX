import { Router } from 'express';
import { 
  getAllServices, 
  getServiceById, 
  createService, 
  updateService,
  updateServiceStatus, 
  deleteService 
} from '../controllers/serviceController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../entities/User';

const router = Router();

router.get('/', authenticate, getAllServices);
router.get('/:id', authenticate, getServiceById);
router.post('/', authenticate, authorize(UserRole.ADMIN), createService);
router.patch('/:id', authenticate, authorize(UserRole.ADMIN), updateService);
router.patch('/:id/status', authenticate, authorize(UserRole.ENGINEER, UserRole.ADMIN), updateServiceStatus);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteService);

export default router;
