import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { validateEmail, validatePassword } from '../middleware/validation';
import { logAudit } from '../utils/auditLogger';

export const register = async (req: Request, res: Response): Promise<void> => {
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
    
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await hashPassword(password);
    
    const user = userRepository.create({
      email,
      password: hashedPassword,
      role: role || 'VIEWER'
    });

    await userRepository.save(user);
    
    await logAudit(user.id, 'USER_REGISTERED', 'User', user.id, { email });

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

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
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
