import { Router } from 'express';
import { getOverview, getAnalyticsTrends } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/overview', getOverview);
router.get('/trends', getAnalyticsTrends);

export default router;
