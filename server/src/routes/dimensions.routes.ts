import { Router } from 'express';
import { DimensionsController } from '../controllers/dimensions.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import {
  healthSchema,
  fitnessSchema,
  nutritionSchema,
  mentalSchema,
  emotionalSchema,
  personalitySchema,
  socialSchema,
  educationSchema,
  careerSchema,
  financialSchema,
  sleepSchema,
} from '../validators/schemas';

const router = Router();
router.use(authenticate);

// 1. Physical Health
router.get('/health', DimensionsController.getHealth);
router.post('/health', validateBody(healthSchema), DimensionsController.logHealth);

// 2. Fitness
router.get('/fitness', DimensionsController.getFitness);
router.post('/fitness', validateBody(fitnessSchema), DimensionsController.logFitness);

// 3. Nutrition
router.get('/nutrition', DimensionsController.getNutrition);
router.post('/nutrition', validateBody(nutritionSchema), DimensionsController.logNutrition);

// 4. Mental Health
router.get('/mental', DimensionsController.getMental);
router.post('/mental', validateBody(mentalSchema), DimensionsController.logMental);

// 5. Emotional Health
router.get('/emotional', DimensionsController.getEmotional);
router.post('/emotional', validateBody(emotionalSchema), DimensionsController.logEmotional);

// 6. Personality
router.get('/personality', DimensionsController.getPersonality);
router.post('/personality', validateBody(personalitySchema), DimensionsController.logPersonality);

// 7. Social Relationships
router.get('/social', DimensionsController.getSocial);
router.post('/social', validateBody(socialSchema), DimensionsController.logSocial);

// 8. Education & Learning
router.get('/education', DimensionsController.getEducation);
router.post('/education', validateBody(educationSchema), DimensionsController.logEducation);

// 9. Career
router.get('/career', DimensionsController.getCareer);
router.post('/career', validateBody(careerSchema), DimensionsController.logCareer);

// 10. Financial
router.get('/financial', DimensionsController.getFinancial);
router.post('/financial', validateBody(financialSchema), DimensionsController.logFinancial);

// 11. Sleep
router.get('/sleep', DimensionsController.getSleep);
router.post('/sleep', validateBody(sleepSchema), DimensionsController.logSleep);

export default router;
