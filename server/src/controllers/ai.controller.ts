import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { AIService } from '../services/ai.service';
import { ScoringService } from '../services/scoring.service';

export const generateReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { reportType } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Gather latest records for holistic context
    const [
      user,
      profile,
      health,
      fitness,
      sleep,
      mental,
      emotional,
      financial,
      education,
      habits,
      habitLogsToday,
    ] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
      prisma.profile.findUnique({ where: { userId } }),
      prisma.healthRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.fitnessRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.sleepRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.mentalHealthRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.emotionalRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.financialRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.educationRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.habit.findMany({ where: { userId, active: true } }),
      prisma.habitLog.findMany({ where: { userId, date: today } }),
    ]);

    // Calculate scores
    const dimensionScores = {
      health: ScoringService.calculateHealthScore(health, profile),
      fitness: ScoringService.calculateFitnessScore(fitness),
      sleep: ScoringService.calculateSleepScore(sleep),
      nutrition: ScoringService.calculateNutritionScore(null),
      mental: ScoringService.calculateMentalScore(mental),
      emotional: ScoringService.calculateEmotionalScore(emotional),
      social: ScoringService.calculateSocialScore(null),
      learning: ScoringService.calculateLearningScore(education),
      career: ScoringService.calculateCareerScore(null),
      financial: ScoringService.calculateFinancialScore(financial),
      habits: ScoringService.calculateHabitScore(habits, habitLogsToday),
    };

    const twinScore = ScoringService.computeHolisticTwin(dimensionScores);

    const report = await AIService.generateReport({
      reportType,
      twinData: {
        user: { name: user?.name || 'User', email: user?.email || '' },
        profile,
        scores: twinScore,
        recentHealth: health,
        recentFitness: fitness,
        recentSleep: sleep,
        recentMental: mental,
        recentEmotional: emotional,
        recentFinancial: financial,
        recentEducation: education,
        habits,
      },
    });

    // Save report to database for history
    const saved = await prisma.aIReport.create({
      data: {
        userId,
        reportType,
        title: report.title,
        summary: report.summary,
        observations: JSON.stringify(report.observations),
        recommendations: JSON.stringify(report.recommendations),
        predictions: JSON.stringify(report.predictions),
        compositeScore: report.compositeScore,
        source: report.source,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...report,
        id: saved.id,
        generatedAt: saved.generatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getReports = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const reports = await prisma.aIReport.findMany({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
      take: 20,
    });

    const parsed = reports.map((r) => ({
      ...r,
      observations: JSON.parse(r.observations || '[]'),
      recommendations: JSON.parse(r.recommendations || '[]'),
      predictions: JSON.parse(r.predictions || '[]'),
    }));

    res.json({ success: true, data: parsed });
  } catch (err) {
    next(err);
  }
};
