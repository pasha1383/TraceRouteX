import { Router } from 'express';
import { 
  getAllServices, 
  getServiceById, 
  createService, 
  updateService, 
  deleteService 
} from '../controllers/serviceController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../entities/User';

const router = Router();

router.get('/', authenticate, getAllServices);
router.get('/:id', authenticate, getServiceById);
router.post('/', authenticate, authorize(UserRole.ENGINEER, UserRole.ADMIN), createService);
router.put('/:id', authenticate, authorize(UserRole.ENGINEER, UserRole.ADMIN), updateService);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteService);

export default router;
