import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../utils/auditLogger';

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      select: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' }
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;

    if (!role) {
      res.status(400).json({ error: 'Role is required' });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const oldRole = user.role;
    user.role = role;

    await userRepository.save(user);
    
    await logAudit(req.user?.userId || null, 'USER_ROLE_UPDATED', 'User', user.id, { oldRole, newRole: role });

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    // Prevent self-deletion
    if (id === req.user?.userId) {
      res.status(400).json({ error: 'Cannot delete your own account' });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await userRepository.remove(user);
    
    await logAudit(req.user?.userId || null, 'USER_DELETED', 'User', id, { email: user.email });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
