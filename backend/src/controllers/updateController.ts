import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { Update } from '../entities/Update';
import { Incident } from '../entities/Incident';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../utils/auditLogger';

export const getUpdatesByIncident = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const incidentId = req.params.incidentId as string;
    
    const updateRepository = AppDataSource.getRepository(Update);
    const updates = await updateRepository.find({
      where: { incidentId },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });

    res.json(updates);
  } catch (error) {
    console.error('Get updates error:', error);
    res.status(500).json({ error: 'Failed to get updates' });
  }
};

export const createUpdate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { incidentId, content } = req.body;

    if (!incidentId || !content) {
      res.status(400).json({ error: 'Incident ID and content are required' });
      return;
    }

    // Verify incident exists
    const incidentRepository = AppDataSource.getRepository(Incident);
    const incident = await incidentRepository.findOne({ where: { id: incidentId } });

    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }

    const updateRepository = AppDataSource.getRepository(Update);
    const update = updateRepository.create({
      content,
      incidentId,
      userId: req.user?.userId
    });

    await updateRepository.save(update);
    
    // Load the update with user relation
    const savedUpdate = await updateRepository.findOne({
      where: { id: update.id },
      relations: ['user']
    });
    
    await logAudit(req.user?.userId || null, 'UPDATE_CREATED', 'Update', update.id, { incidentId });

    res.status(201).json(savedUpdate);
  } catch (error) {
    console.error('Create update error:', error);
    res.status(500).json({ error: 'Failed to create update' });
  }
};

export const deleteUpdate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const updateRepository = AppDataSource.getRepository(Update);
    const update = await updateRepository.findOne({ where: { id } });

    if (!update) {
      res.status(404).json({ error: 'Update not found' });
      return;
    }

    // Only allow user to delete their own updates or admins
    if (update.userId !== req.user?.userId && req.user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await updateRepository.remove(update);
    
    await logAudit(req.user?.userId || null, 'UPDATE_DELETED', 'Update', id, { incidentId: update.incidentId });

    res.json({ message: 'Update deleted successfully' });
  } catch (error) {
    console.error('Delete update error:', error);
    res.status(500).json({ error: 'Failed to delete update' });
  }
};
