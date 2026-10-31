import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { ScoringService } from '../services/scoring.service';

export class DimensionsController {
  // ==========================================
  // 1. PHYSICAL HEALTH
  // ==========================================
  static async getHealth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const records = await prisma.healthRecord.findMany({
        where: { userId },
        orderBy: { recordedAt: 'desc' },
        take: 30,
      });

      const profile = await prisma.profile.findUnique({ where: { userId } });
      const latest = records[0] || null;
      const score = ScoringService.calculateHealthScore(latest, profile);

      res.json({ success: true, data: { latest, history: records, score } });
    } catch (err) { next(err); }
  }

  static async logHealth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;
      const profile = await prisma.profile.findUnique({ where: { userId } });

      let bmi = data.bmi;
      if (!bmi && profile?.height && profile?.weight) {
        const hM = profile.height / 100;
        bmi = parseFloat((profile.weight / (hM * hM)).toFixed(1));
      }

      const tempRecord = { ...data, bmi };
      const scoreResult = ScoringService.calculateHealthScore(tempRecord, profile);

      const record = await prisma.healthRecord.create({
        data: {
          userId,
          ...data,
          bmi,
          healthScore: scoreResult.score,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Physical health record logged successfully',
        data: { record, scoreResult },
      });
    } catch (err) { next(err); }
  }

  // ==========================================
  // 2. FITNESS & LIFESTYLE
  // ==========================================
  static async getFitness(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const records = await prisma.fitnessRecord.findMany({
        where: { userId },
        orderBy: { recordedAt: 'desc' },
        take: 30,
      });
      const latest = records[0] || null;
      const score = ScoringService.calculateFitnessScore(latest);

      res.json({ success: true, data: { latest, history: records, score } });
    } catch (err) { next(err); }
  }

  static async logFitness(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;
      const scoreResult = ScoringService.calculateFitnessScore(data);

      const record = await prisma.fitnessRecord.create({
        data: {
          userId,
          ...data,
          fitnessScore: scoreResult.score,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Fitness activity logged successfully',
        data: { record, scoreResult },
      });
    } catch (err) { next(err); }
  }

  // ==========================================
  // 3. NUTRITION
  // ==========================================
  static async getNutrition(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const records = await prisma.nutritionRecord.findMany({
        where: { userId },
        orderBy: { recordedAt: 'desc' },
        take: 30,
      });
      const latest = records[0] || null;
      const score = ScoringService.calculateNutritionScore(latest);

      res.json({ success: true, data: { latest, history: records, score } });
    } catch (err) { next(err); }
  }

  static async logNutrition(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;
      const scoreResult = ScoringService.calculateNutritionScore(data);

      const record = await prisma.nutritionRecord.create({
        data: {
          userId,
          ...data,
          dietaryScore: scoreResult.score,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Nutrition entry recorded successfully',
        data: { record, scoreResult },
      });
    } catch (err) { next(err); }
  }

  // ==========================================
  // 4. MENTAL HEALTH
  // ==========================================
  static async getMental(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const records = await prisma.mentalHealthRecord.findMany({
        where: { userId },
        orderBy: { recordedAt: 'desc' },
        take: 30,
      });
      const latest = records[0] || null;
      const score = ScoringService.calculateMentalScore(latest);

      res.json({ success: true, data: { latest, history: records, score } });
    } catch (err) { next(err); }
  }

  static async logMental(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;
      const scoreResult = ScoringService.calculateMentalScore(data);

      const record = await prisma.mentalHealthRecord.create({
        data: {
          userId,
          ...data,
          mentalScore: scoreResult.score,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Mental wellness check logged successfully',
        data: { record, scoreResult },
      });
    } catch (err) { next(err); }
  }

  // ==========================================
  // 5. EMOTIONAL HEALTH
  // ==========================================
  static async getEmotional(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const records = await prisma.emotionalRecord.findMany({
        where: { userId },
        orderBy: { recordedAt: 'desc' },
        take: 30,
      });
      const latest = records[0] || null;
      const score = ScoringService.calculateEmotionalScore(latest);

      res.json({ success: true, data: { latest, history: records, score } });
    } catch (err) { next(err); }
  }

  static async logEmotional(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;
      const scoreResult = ScoringService.calculateEmotionalScore(data);

      const record = await prisma.emotionalRecord.create({
        data: {
          userId,
          ...data,
          emotionalScore: scoreResult.score,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Emotional mood entry saved successfully',
        data: { record, scoreResult },
      });
    } catch (err) { next(err); }
  }

  // ==========================================
  // 6. PERSONALITY
  // ==========================================
  static async getPersonality(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const records = await prisma.personalityRecord.findMany({
        where: { userId },
        orderBy: { recordedAt: 'desc' },
        take: 10,
      });
      const latest = records[0] || null;

      res.json({ success: true, data: { latest, history: records } });
    } catch (err) { next(err); }
  }

  static async logPersonality(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;

      const record = await prisma.personalityRecord.create({
        data: {
          userId,
          ...data,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Personality attributes saved successfully',
        data: record,
      });
    } catch (err) { next(err); }
  }

  // ==========================================
  // 7. SOCIAL RELATIONSHIPS
  // ==========================================
  static async getSocial(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const records = await prisma.socialRecord.findMany({
        where: { userId },
        orderBy: { recordedAt: 'desc' },
        take: 30,
      });
      const latest = records[0] || null;
      const score = ScoringService.calculateSocialScore(latest);

      res.json({ success: true, data: { latest, history: records, score } });
    } catch (err) { next(err); }
  }

  static async logSocial(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;
      const scoreResult = ScoringService.calculateSocialScore(data);

      const record = await prisma.socialRecord.create({
        data: {
          userId,
          ...data,
          socialScore: scoreResult.score,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Social connection metrics updated',
        data: { record, scoreResult },
      });
    } catch (err) { next(err); }
  }

  // ==========================================
  // 8. EDUCATION & LEARNING
  // ==========================================
  static async getEducation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const records = await prisma.educationRecord.findMany({
        where: { userId },
        orderBy: { recordedAt: 'desc' },
        take: 30,
      });
      const latest = records[0] || null;
      const score = ScoringService.calculateLearningScore(latest);

      res.json({ success: true, data: { latest, history: records, score } });
    } catch (err) { next(err); }
  }

  static async logEducation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;
      const scoreResult = ScoringService.calculateLearningScore(data);

      const record = await prisma.educationRecord.create({
        data: {
          userId,
          ...data,
          learningScore: scoreResult.score,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Learning progress recorded',
        data: { record, scoreResult },
      });
    } catch (err) { next(err); }
  }

  // ==========================================
  // 9. CAREER
  // ==========================================
  static async getCareer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const records = await prisma.careerRecord.findMany({
        where: { userId },
        orderBy: { recordedAt: 'desc' },
        take: 10,
      });
      const latest = records[0] || null;
      const score = ScoringService.calculateCareerScore(latest);

      res.json({ success: true, data: { latest, history: records, score } });
    } catch (err) { next(err); }
  }

  static async logCareer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;
      const scoreResult = ScoringService.calculateCareerScore(data);

      const record = await prisma.careerRecord.create({
        data: {
          userId,
          ...data,
          careerReadinessScore: scoreResult.score,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Career portfolio entry saved',
        data: { record, scoreResult },
      });
    } catch (err) { next(err); }
  }

  // ==========================================
  // 10. FINANCIAL HEALTH
  // ==========================================
  static async getFinancial(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const records = await prisma.financialRecord.findMany({
        where: { userId },
        orderBy: { recordedAt: 'desc' },
        take: 24,
      });
      const latest = records[0] || null;
      const score = ScoringService.calculateFinancialScore(latest);

      res.json({ success: true, data: { latest, history: records, score } });
    } catch (err) { next(err); }
  }

  static async logFinancial(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;
      const scoreResult = ScoringService.calculateFinancialScore(data);

      const record = await prisma.financialRecord.create({
        data: {
          userId,
          ...data,
          financialScore: scoreResult.score,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Financial summary logged successfully',
        data: { record, scoreResult },
      });
    } catch (err) { next(err); }
  }

  // ==========================================
  // 11. SLEEP TRACKING
  // ==========================================
  static async getSleep(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const records = await prisma.sleepRecord.findMany({
        where: { userId },
        orderBy: { recordedAt: 'desc' },
        take: 30,
      });
      const latest = records[0] || null;
      const score = ScoringService.calculateSleepScore(latest);

      res.json({ success: true, data: { latest, history: records, score } });
    } catch (err) { next(err); }
  }

  static async logSleep(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;
      const scoreResult = ScoringService.calculateSleepScore(data);

      const record = await prisma.sleepRecord.create({
        data: {
          userId,
          ...data,
          sleepScore: scoreResult.score,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Sleep record logged successfully',
        data: { record, scoreResult },
      });
    } catch (err) { next(err); }
  }
}
