import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard-controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, dashboardController.index);
router.get('/settings', requireAuth, dashboardController.settings);

export default router;
