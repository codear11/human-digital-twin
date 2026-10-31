import { Router } from 'express';
import { getGoals, createGoal, updateGoalProgress, deleteGoal } from '../controllers/goals.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { goalSchema, goalProgressSchema } from '../validators/schemas';

const router = Router();
router.use(authenticate);

router.get('/', getGoals);
router.post('/', validateBody(goalSchema), createGoal);
router.put('/:id/progress', validateBody(goalProgressSchema), updateGoalProgress);
router.delete('/:id', deleteGoal);

export default router;
