import { Router } from 'express';
import { getAllUsers, updateUserRole, deleteUser } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../entities/User';

const router = Router();

router.get('/', authenticate, authorize(UserRole.ADMIN), getAllUsers);
router.patch('/:id/role', authenticate, authorize(UserRole.ADMIN), updateUserRole);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteUser);

export default router;
