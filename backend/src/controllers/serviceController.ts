import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { Service, ServiceStatus } from '../entities/Service';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../utils/auditLogger';

export const getAllServices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const serviceRepository = AppDataSource.getRepository(Service);
    const services = await serviceRepository.find({
      order: { createdAt: 'DESC' }
    });

    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
};

export const getServiceById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const serviceRepository = AppDataSource.getRepository(Service);
    const service = await serviceRepository.findOne({ where: { id } });

    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to get service' });
  }
};

export const createService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, status } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Service name is required' });
      return;
    }

    const serviceRepository = AppDataSource.getRepository(Service);
    const service = serviceRepository.create({
      name,
      description,
      status: status || ServiceStatus.OPERATIONAL
    });

    await serviceRepository.save(service);
    
    await logAudit(req.user?.userId || null, 'SERVICE_CREATED', 'Service', service.id, { name });

    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
};

export const updateService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const serviceRepository = AppDataSource.getRepository(Service);
    const service = await serviceRepository.findOne({ where: { id } });

    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    if (name !== undefined) service.name = name;
    if (description !== undefined) service.description = description;
    if (status !== undefined) service.status = status;

    await serviceRepository.save(service);
    
    await logAudit(req.user?.userId || null, 'SERVICE_UPDATED', 'Service', service.id, { name, status });

    res.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

export const deleteService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const serviceRepository = AppDataSource.getRepository(Service);
    const service = await serviceRepository.findOne({ where: { id } });

    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    await serviceRepository.remove(service);
    
    await logAudit(req.user?.userId || null, 'SERVICE_DELETED', 'Service', id, { name: service.name });

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
};
