import { Router } from 'express';
import { getHabits, createHabit, toggleHabit, deleteHabit } from '../controllers/habits.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { habitSchema, habitToggleSchema } from '../validators/schemas';

const router = Router();
router.use(authenticate);

router.get('/', getHabits);
router.post('/', validateBody(habitSchema), createHabit);
router.post('/:id/toggle', validateBody(habitToggleSchema), toggleHabit);
router.delete('/:id', deleteHabit);

export default router;
