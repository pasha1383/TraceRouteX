import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { Incident, IncidentStatus, IncidentSeverity } from '../entities/Incident';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../utils/auditLogger';

export const getAllIncidents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const incidentRepository = AppDataSource.getRepository(Incident);
    
    // If user is not authenticated or is a VIEWER, only show public incidents
    const whereCondition = req.user?.role === 'VIEWER' || !req.user 
      ? { isPublic: true }
      : {};

    const incidents = await incidentRepository.find({
      where: whereCondition,
      relations: ['updates', 'updates.user'],
      order: { createdAt: 'DESC' }
    });

    res.json(incidents);
  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({ error: 'Failed to get incidents' });
  }
};

export const getIncidentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const incidentRepository = AppDataSource.getRepository(Incident);
    
    const incident = await incidentRepository.findOne({
      where: { id },
      relations: ['updates', 'updates.user']
    });

    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }

    // Check if user can view this incident
    if (!incident.isPublic && (!req.user || req.user.role === 'VIEWER')) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(incident);
  } catch (error) {
    console.error('Get incident error:', error);
    res.status(500).json({ error: 'Failed to get incident' });
  }
};

export const createIncident = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, severity, status, isPublic } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: 'Title and description are required' });
      return;
    }

    const incidentRepository = AppDataSource.getRepository(Incident);
    const incident = incidentRepository.create({
      title,
      description,
      severity: severity || IncidentSeverity.MEDIUM,
      status: status || IncidentStatus.OPEN,
      isPublic: isPublic !== undefined ? isPublic : false
    });

    await incidentRepository.save(incident);
    
    await logAudit(req.user?.userId || null, 'INCIDENT_CREATED', 'Incident', incident.id, { title, severity });

    res.status(201).json(incident);
  } catch (error) {
    console.error('Create incident error:', error);
    res.status(500).json({ error: 'Failed to create incident' });
  }
};

export const updateIncident = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, description, severity, status, isPublic } = req.body;

    const incidentRepository = AppDataSource.getRepository(Incident);
    const incident = await incidentRepository.findOne({ where: { id } });

    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }

    if (title !== undefined) incident.title = title;
    if (description !== undefined) incident.description = description;
    if (severity !== undefined) incident.severity = severity;
    if (isPublic !== undefined) incident.isPublic = isPublic;
    
    if (status !== undefined) {
      incident.status = status;
      // Set resolvedAt when incident is resolved or closed
      if ((status === IncidentStatus.RESOLVED || status === IncidentStatus.CLOSED) && !incident.resolvedAt) {
        incident.resolvedAt = new Date();
      }
    }

    await incidentRepository.save(incident);
    
    await logAudit(req.user?.userId || null, 'INCIDENT_UPDATED', 'Incident', incident.id, { title, status });

    res.json(incident);
  } catch (error) {
    console.error('Update incident error:', error);
    res.status(500).json({ error: 'Failed to update incident' });
  }
};

export const resolveIncident = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const incidentRepository = AppDataSource.getRepository(Incident);
    const incident = await incidentRepository.findOne({ where: { id } });

    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }

    incident.status = IncidentStatus.RESOLVED;
    incident.resolvedAt = new Date();

    await incidentRepository.save(incident);
    
    await logAudit(req.user?.userId || null, 'INCIDENT_RESOLVED', 'Incident', incident.id, { title: incident.title });

    res.json(incident);
  } catch (error) {
    console.error('Resolve incident error:', error);
    res.status(500).json({ error: 'Failed to resolve incident' });
  }
};

export const publishIncident = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { isPublic } = req.body;

    const incidentRepository = AppDataSource.getRepository(Incident);
    const incident = await incidentRepository.findOne({ where: { id } });

    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }

    incident.isPublic = isPublic !== undefined ? isPublic : !incident.isPublic;

    await incidentRepository.save(incident);
    
    await logAudit(req.user?.userId || null, 'INCIDENT_PUBLISH_TOGGLED', 'Incident', incident.id, { isPublic: incident.isPublic });

    res.json(incident);
  } catch (error) {
    console.error('Publish incident error:', error);
    res.status(500).json({ error: 'Failed to publish incident' });
  }
};

export const addIncidentUpdate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    const incidentRepository = AppDataSource.getRepository(Incident);
    const incident = await incidentRepository.findOne({ where: { id } });

    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }

    const { Update } = await import('../entities/Update');
    const updateRepository = AppDataSource.getRepository(Update);
    const update = updateRepository.create({
      content,
      incidentId: id,
      userId: req.user?.userId
    });

    await updateRepository.save(update);
    
    const savedUpdate = await updateRepository.findOne({
      where: { id: update.id },
      relations: ['user']
    });
    
    await logAudit(req.user?.userId || null, 'INCIDENT_UPDATE_ADDED', 'Incident', id, { updateId: update.id });

    res.status(201).json(savedUpdate);
  } catch (error) {
    console.error('Add incident update error:', error);
    res.status(500).json({ error: 'Failed to add incident update' });
  }
};

export const getIncidentUpdates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const { Update } = await import('../entities/Update');
    const updateRepository = AppDataSource.getRepository(Update);
    const updates = await updateRepository.find({
      where: { incidentId: id },
      relations: ['user'],
      order: { createdAt: 'ASC' }
    });

    res.json(updates);
  } catch (error) {
    console.error('Get incident updates error:', error);
    res.status(500).json({ error: 'Failed to get incident updates' });
  }
};

export const deleteIncident = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const incidentRepository = AppDataSource.getRepository(Incident);
    const incident = await incidentRepository.findOne({ where: { id } });

    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }

    await incidentRepository.remove(incident);
    
    await logAudit(req.user?.userId || null, 'INCIDENT_DELETED', 'Incident', id, { title: incident.title });

    res.json({ message: 'Incident deleted successfully' });
  } catch (error) {
    console.error('Delete incident error:', error);
    res.status(500).json({ error: 'Failed to delete incident' });
  }
};
