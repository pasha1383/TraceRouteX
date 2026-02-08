import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { AuditLog } from '../entities/AuditLog';
import { AuthRequest } from '../middleware/auth';

export const getAuditLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { entityType, entityId, limit = '100' } = req.query;
    
    const auditLogRepository = AppDataSource.getRepository(AuditLog);
    const queryBuilder = auditLogRepository.createQueryBuilder('auditLog');

    if (entityType) {
      queryBuilder.andWhere('auditLog.entityType = :entityType', { entityType });
    }

    if (entityId) {
      queryBuilder.andWhere('auditLog.entityId = :entityId', { entityId });
    }

    const logs = await queryBuilder
      .orderBy('auditLog.createdAt', 'DESC')
      .limit(parseInt(limit as string))
      .getMany();

    res.json(logs);
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Failed to get audit logs' });
  }
};
