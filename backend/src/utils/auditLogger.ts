import { AppDataSource } from '../data-source';
import { AuditLog } from '../entities/AuditLog';

export const logAudit = async (
  actorId: string | null,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: Record<string, any>
): Promise<void> => {
  try {
    const auditLogRepository = AppDataSource.getRepository(AuditLog);
    const log = auditLogRepository.create({
      actorId: actorId || 'system',
      action,
      entityType,
      entityId,
      metadata: metadata || {}
    });
    await auditLogRepository.save(log);
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};
