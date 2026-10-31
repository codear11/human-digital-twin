import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';
import { ScoringService } from '../services/scoring.service';

export const getOverview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const today = new Date().toISOString().split('T')[0];

    // Fetch latest record for all dimensions in parallel
    const [
      user,
      profile,
      health,
      fitness,
      nutrition,
      mental,
      emotional,
      personality,
      social,
      education,
      career,
      financial,
      sleep,
      habits,
      habitLogsToday,
      goals,
    ] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
      prisma.profile.findUnique({ where: { userId } }),
      prisma.healthRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.fitnessRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.nutritionRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.mentalHealthRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.emotionalRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.personalityRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.socialRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.educationRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.careerRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.financialRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.sleepRecord.findFirst({ where: { userId }, orderBy: { recordedAt: 'desc' } }),
      prisma.habit.findMany({ where: { userId, active: true } }),
      prisma.habitLog.findMany({ where: { userId, date: today } }),
      prisma.goal.findMany({ where: { userId, status: 'IN_PROGRESS' }, take: 4 }),
    ]);

    // Calculate individual dimension scores
    const healthScore = ScoringService.calculateHealthScore(health, profile);
    const fitnessScore = ScoringService.calculateFitnessScore(fitness);
    const sleepScore = ScoringService.calculateSleepScore(sleep);
    const nutritionScore = ScoringService.calculateNutritionScore(nutrition);
    const mentalScore = ScoringService.calculateMentalScore(mental);
    const emotionalScore = ScoringService.calculateEmotionalScore(emotional);
    const personalityScore = ScoringService.calculatePersonalityScore(personality);
    const socialScore = ScoringService.calculateSocialScore(social);
    const learningScore = ScoringService.calculateLearningScore(education);
    const careerScore = ScoringService.calculateCareerScore(career);
    const financialScore = ScoringService.calculateFinancialScore(financial);
    const habitScore = ScoringService.calculateHabitScore(habits, habitLogsToday);

    const dimensionScores = {
      health: healthScore,
      fitness: fitnessScore,
      sleep: sleepScore,
      nutrition: nutritionScore,
      mental: mentalScore,
      emotional: emotionalScore,
      personality: personalityScore,
      social: socialScore,
      learning: learningScore,
      career: careerScore,
      financial: financialScore,
      habits: habitScore,
    };

    const twinComputation = ScoringService.computeHolisticTwin(dimensionScores);

    // Dynamic alerts based on biometric and wellness thresholds
    const alerts: { type: 'info' | 'warning' | 'success'; message: string; dimension: string }[] = [];

    if (health?.bloodPressureSys && health.bloodPressureSys >= 135) {
      alerts.push({ type: 'warning', dimension: 'Health', message: `Systolic BP elevated (${health.bloodPressureSys} mmHg). Hydrate and monitor.` });
    }
    if (sleep?.sleepDurationHours !== null && sleep?.sleepDurationHours !== undefined && sleep.sleepDurationHours < 6) {
      alerts.push({ type: 'warning', dimension: 'Sleep', message: `Sleep deficit logged (${sleep.sleepDurationHours} hrs). Target 7+ hours tonight.` });
    }
    if (fitness?.steps && fitness.steps >= 10000) {
      alerts.push({ type: 'success', dimension: 'Fitness', message: `Daily movement goal crushed (${fitness.steps.toLocaleString()} steps)!` });
    }
    if (mental?.stressLevel && mental.stressLevel > 65) {
      alerts.push({ type: 'warning', dimension: 'Mental', message: `Elevated stress indicators (${mental.stressLevel}%). Schedule a 10m pause.` });
    }
    if (financial?.monthlySavings && financial.monthlyIncome && (financial.monthlySavings / financial.monthlyIncome >= 0.20)) {
      alerts.push({ type: 'success', dimension: 'Financial', message: `Healthy 20%+ savings allocation recorded.` });
    }

    // Quick Stats highlights
    const quickStats = {
      restingHeartRate: health?.restingHeartRate ?? health?.heartRate ?? null,
      steps: fitness?.steps ?? null,
      sleepHours: sleep?.sleepDurationHours ?? null,
      stress: mental?.stressLevel ?? null,
      savingsRate: (financial?.monthlyIncome && financial.monthlySavings)
        ? Math.round((financial.monthlySavings / financial.monthlyIncome) * 100)
        : null,
      activeHabitsCount: habits.length,
      completedHabitsToday: habitLogsToday.filter(l => l.completed).length,
    };

    // Compile recent activity
    const recentActivity = [
      health && { type: 'Health', text: `Vitals recorded: HR ${health.heartRate || health.restingHeartRate || '--'} bpm, BP ${health.bloodPressureSys || '--'}/${health.bloodPressureDia || '--'}`, time: health.recordedAt },
      fitness && { type: 'Fitness', text: `Movement logged: ${fitness.steps?.toLocaleString() || 0} steps, ${fitness.activeCalories || 0} kcal`, time: fitness.recordedAt },
      sleep && { type: 'Sleep', text: `Sleep session: ${sleep.sleepDurationHours || '--'} hrs (Quality ${sleep.sleepQuality || '--'}%)`, time: sleep.recordedAt },
      mental && { type: 'Mental', text: `Wellness check: Stress ${mental.stressLevel ?? '--'}%, Mindfulness ${mental.mindfulnessLevel ?? '--'}%`, time: mental.recordedAt },
      emotional && { type: 'Emotional', text: `Mood logged: ${emotional.dominantMood || 'Balanced'} (Happiness ${emotional.happiness ?? '--'}%)`, time: emotional.recordedAt },
    ].filter(Boolean).sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

    res.json({
      success: true,
      data: {
        user: { name: user?.name, email: user?.email },
        profile,
        twinScore: twinComputation.overallScore,
        completenessPercentage: twinComputation.completenessPercentage,
        dataSufficient: twinComputation.dataSufficient,
        limitations: twinComputation.limitations,
        dimensionScores,
        quickStats,
        alerts,
        recentActivity,
        goals,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAnalyticsTrends = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const days = req.query.range === '30d' ? 30 : req.query.range === '90d' ? 90 : 7;

    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const [healthList, fitnessList, sleepList, mentalList, emotionalList] = await Promise.all([
      prisma.healthRecord.findMany({ where: { userId, recordedAt: { gte: sinceDate } }, orderBy: { recordedAt: 'asc' } }),
      prisma.fitnessRecord.findMany({ where: { userId, recordedAt: { gte: sinceDate } }, orderBy: { recordedAt: 'asc' } }),
      prisma.sleepRecord.findMany({ where: { userId, recordedAt: { gte: sinceDate } }, orderBy: { recordedAt: 'asc' } }),
      prisma.mentalHealthRecord.findMany({ where: { userId, recordedAt: { gte: sinceDate } }, orderBy: { recordedAt: 'asc' } }),
      prisma.emotionalRecord.findMany({ where: { userId, recordedAt: { gte: sinceDate } }, orderBy: { recordedAt: 'asc' } }),
    ]);

    // Build timeline mapped by day (YYYY-MM-DD)
    const timelineMap: Record<string, any> = {};

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      timelineMap[dateStr] = {
        date: dateStr,
        display: displayStr,
        steps: 0,
        heartRate: null,
        sleepHours: null,
        stress: null,
        happiness: null,
      };
    }

    fitnessList.forEach((r) => {
      const d = r.recordedAt.toISOString().split('T')[0];
      if (timelineMap[d] && r.steps) timelineMap[d].steps = r.steps;
    });

    healthList.forEach((r) => {
      const d = r.recordedAt.toISOString().split('T')[0];
      const hr = r.restingHeartRate ?? r.heartRate;
      if (timelineMap[d] && hr) timelineMap[d].heartRate = hr;
    });

    sleepList.forEach((r) => {
      const d = r.recordedAt.toISOString().split('T')[0];
      if (timelineMap[d] && r.sleepDurationHours) timelineMap[d].sleepHours = r.sleepDurationHours;
    });

    mentalList.forEach((r) => {
      const d = r.recordedAt.toISOString().split('T')[0];
      if (timelineMap[d] && r.stressLevel !== null) timelineMap[d].stress = r.stressLevel;
    });

    emotionalList.forEach((r) => {
      const d = r.recordedAt.toISOString().split('T')[0];
      if (timelineMap[d] && r.happiness !== null) timelineMap[d].happiness = r.happiness;
    });

    const timeSeries = Object.values(timelineMap);

    res.json({
      success: true,
      data: {
        range: `${days}d`,
        timeSeries,
      },
    });
  } catch (err) {
    next(err);
  }
};
