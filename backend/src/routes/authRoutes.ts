import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Register - optionally authenticated (first user doesn't need auth, role assignment needs ADMIN)
router.post('/register', (req, res, next) => {
  // Try to authenticate but don't fail if no token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
}, register);

router.post('/login', login);
router.get('/me', authenticate, getMe);

export default router;
