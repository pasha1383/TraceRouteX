import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Service } from '../entities/Service';
import { Incident } from '../entities/Incident';

export const getPublicServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const serviceRepository = AppDataSource.getRepository(Service);
    const services = await serviceRepository.find({
      order: { createdAt: 'DESC' }
    });

    res.json(services);
  } catch (error) {
    console.error('Get public services error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
};

export const getPublicIncidents = async (req: Request, res: Response): Promise<void> => {
  try {
    const incidentRepository = AppDataSource.getRepository(Incident);
    const incidents = await incidentRepository.find({
      where: { isPublic: true },
      relations: ['updates', 'updates.user'],
      order: { createdAt: 'DESC' }
    });

    res.json(incidents);
  } catch (error) {
    console.error('Get public incidents error:', error);
    res.status(500).json({ error: 'Failed to get incidents' });
  }
};
