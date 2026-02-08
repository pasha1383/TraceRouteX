import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { validateEmail, validatePassword } from '../middleware/validation';
import { logAudit } from '../utils/auditLogger';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      res.status(400).json({ error: passwordValidation.message });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);

    // Check if this is the first user (allow creating ADMIN)
    const userCount = await userRepository.count();
    const isFirstUser = userCount === 0;

    // If not the first user, only ADMIN can assign roles
    let assignedRole = UserRole.VIEWER;
    if (isFirstUser) {
      // First user is always ADMIN
      assignedRole = UserRole.ADMIN;
    } else if (role && role !== UserRole.VIEWER) {
      // Only authenticated ADMINs can assign non-VIEWER roles
      if (!req.user || req.user.role !== UserRole.ADMIN) {
        res.status(403).json({ error: 'Only admins can assign roles' });
        return;
      }
      assignedRole = role;
    }

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = userRepository.create({
      email,
      password: hashedPassword,
      role: assignedRole
    });

    await userRepository.save(user);

    await logAudit(req.user?.userId || user.id, 'USER_REGISTERED', 'User', user.id, { email, role: assignedRole });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    await logAudit(user.id, 'USER_LOGIN', 'User', user.id, { email });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: req.user.userId } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};
