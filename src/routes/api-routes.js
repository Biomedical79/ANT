import { Router } from 'express';
import { apiController } from '../controllers/api-controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/health', apiController.health);
router.get('/notifications', requireAuth, apiController.notifications);

export default router;
