import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import dimensionsRoutes from './dimensions.routes';
import habitsRoutes from './habits.routes';
import goalsRoutes from './goals.routes';
import dashboardRoutes from './dashboard.routes';
import aiRoutes from './ai.routes';

const router = Router();

// Public health check endpoint
router.get('/health-check', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Human Digital Twin API',
    version: '1.0.0',
  });
});

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/', dimensionsRoutes);
router.use('/habits', habitsRoutes);
router.use('/goals', goalsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/ai', aiRoutes);

export default router;
