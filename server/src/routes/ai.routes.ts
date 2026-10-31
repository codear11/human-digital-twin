import { Router } from 'express';
import { generateReport, getReports } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { aiReportSchema } from '../validators/schemas';

const router = Router();
router.use(authenticate);

router.post('/generate', validateBody(aiReportSchema), generateReport);
router.get('/reports', getReports);

export default router;
