import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditLogController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../entities/User';

const router = Router();

router.get('/', authenticate, authorize(UserRole.ADMIN), getAuditLogs);

export default router;
