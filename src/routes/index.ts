import { Router } from 'express';
import health from './health.route';

const router = Router();
router.use('/', health);

export default router;
