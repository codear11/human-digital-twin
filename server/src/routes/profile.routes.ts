import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { profileSchema } from '../validators/schemas';

const router = Router();

router.use(authenticate);

router.get('/', getProfile);
router.put('/', validateBody(profileSchema), updateProfile);

export default router;
