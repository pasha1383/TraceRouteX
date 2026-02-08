import { Router } from 'express';
import { getPublicServices, getPublicIncidents } from '../controllers/publicController';

const router = Router();

router.get('/services', getPublicServices);
router.get('/incidents', getPublicIncidents);

export default router;
