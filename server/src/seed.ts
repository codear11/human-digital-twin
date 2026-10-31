import { prisma } from './config/prisma';
import { hashPassword } from './utils/password';
import { ScoringService } from './services/scoring.service';

async function seed() {
  console.log('🌱 Seeding Human Digital Twin demo profile...');

  const email = 'demo@digitaltwin.ai';
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log('Demo user already exists, clearing old demo data...');
    await prisma.user.delete({ where: { email } });
  }

  const passwordHash = await hashPassword('DigitalTwin2026!');

  const user = await prisma.user.create({
    data: {
      email,
      name: 'Ada Lovelace',
      passwordHash,
      profile: {
        create: {
          age: 29,
          gender: 'Female',
          height: 172,
          weight: 64,
          bloodGroup: 'O+',
          dob: new Date('1997-12-10'),
          occupation: 'Principal Systems Architect',
          education: 'M.Sc Artificial Intelligence',
          emergencyContact: '+1 555-019-8234',
          bio: 'Synthesizing human behavioral data, cognitive endurance, and physiological vitals into a predictive digital twin replica.',
        },
      },
    },
  });

  const userId = user.id;
  const now = new Date();

  // Seed 7 days of historical health, fitness, sleep, mental, and emotional logs
  for (let i = 6; i >= 0; i--) {
    const logDate = new Date(now);
    logDate.setDate(logDate.getDate() - i);
    const dateStr = logDate.toISOString().split('T')[0];

    // Health
    const heartRate = 68 + Math.floor(Math.random() * 8);
    const restingHeartRate = 60 + Math.floor(Math.random() * 6);
    const sys = 118 + Math.floor(Math.random() * 6);
    const dia = 76 + Math.floor(Math.random() * 4);
    const healthScoreResult = ScoringService.calculateHealthScore(
      { restingHeartRate, bloodPressureSys: sys, bloodPressureDia: dia, oxygenLevel: 98.8, bloodSugar: 88, bmi: 21.6 },
      { height: 172, weight: 64 }
    );

    await prisma.healthRecord.create({
      data: {
        userId,
        recordedAt: logDate,
        heartRate,
        restingHeartRate,
        bloodPressureSys: sys,
        bloodPressureDia: dia,
        oxygenLevel: 98.8,
        bloodSugar: 88,
        cholesterol: 175,
        bmi: 21.6,
        muscleMass: 28.5,
        boneDensity: 1.2,
        skinHealth: 88,
        healthScore: healthScoreResult.score,
        notes: `Day -${i} vitals check: Basal rhythm consistent.`,
      },
    });

    // Fitness
    const steps = 8000 + Math.floor(Math.random() * 4500);
    const fitScoreResult = ScoringService.calculateFitnessScore({
      steps,
      activeCalories: 450 + Math.floor(Math.random() * 200),
      waterIntake: 2.8,
      inactiveTime: 6.5,
    });

    await prisma.fitnessRecord.create({
      data: {
        userId,
        recordedAt: logDate,
        steps,
        walkingDistance: parseFloat((steps * 0.00075).toFixed(2)),
        activeCalories: 500,
        waterIntake: 2.8,
        inactiveTime: 6.5,
        fitnessScore: fitScoreResult.score,
        notes: `Movement log: aerobic target met.`,
      },
    });

    // Sleep
    const sleepDurationHours = parseFloat((7.2 + (Math.random() * 1.2 - 0.5)).toFixed(1));
    const sleepScoreResult = ScoringService.calculateSleepScore({
      sleepDurationHours,
      sleepQuality: 88,
      deepSleepPercent: 22,
    });

    await prisma.sleepRecord.create({
      data: {
        userId,
        recordedAt: logDate,
        sleepDurationHours,
        bedtime: '23:15',
        wakeTime: '06:45',
        sleepQuality: 88,
        deepSleepPercent: 22,
        remSleepPercent: 24,
        sleepScore: sleepScoreResult.score,
      },
    });

    // Mental
    const stress = 25 + Math.floor(Math.random() * 20);
    const mentalScoreResult = ScoringService.calculateMentalScore({
      stressLevel: stress,
      anxietyLevel: 15,
      burnoutLevel: 10,
      mindfulnessLevel: 80,
    });

    await prisma.mentalHealthRecord.create({
      data: {
        userId,
        recordedAt: logDate,
        stressLevel: stress,
        anxietyLevel: 15,
        burnoutLevel: 10,
        mindfulnessLevel: 80,
        mentalScore: mentalScoreResult.score,
      },
    });

    // Emotional
    const happy = 80 + Math.floor(Math.random() * 15);
    const emoScoreResult = ScoringService.calculateEmotionalScore({
      happiness: happy,
      confidence: 88,
      motivation: 85,
      excitement: 80,
      sadness: 10,
      anger: 5,
      fear: 10,
    });

    await prisma.emotionalRecord.create({
      data: {
        userId,
        recordedAt: logDate,
        happiness: happy,
        confidence: 88,
        motivation: 85,
        excitement: 80,
        sadness: 10,
        anger: 5,
        fear: 10,
        dominantMood: 'Joyful & Focused',
        emotionalScore: emoScoreResult.score,
      },
    });
  }

  // Nutrition
  await prisma.nutritionRecord.create({
    data: {
      userId,
      mealType: 'Lunch',
      mealDescription: 'Quinoa bowl with grilled salmon, avocado, spinach, olive oil, and walnuts',
      calories: 2150,
      protein: 110,
      carbs: 220,
      fat: 65,
      dietaryScore: 92,
      notes: 'Balanced whole-food Mediterranean profile.',
    },
  });

  // Personality
  await prisma.personalityRecord.create({
    data: {
      userId,
      personalityType: 'Ambivert / Analytical Strategist',
      communication: 90,
      leadership: 88,
      teamwork: 92,
      adaptability: 95,
      openness: 90,
      emotionalStability: 85,
      personalityScore: 90,
    },
  });

  // Social
  await prisma.socialRecord.create({
    data: {
      userId,
      familyBond: 90,
      friendshipScore: 85,
      socialEngagement: 80,
      interactionsCount: 12,
      socialScore: 85,
    },
  });

  // Education
  await prisma.educationRecord.create({
    data: {
      userId,
      learningProgress: 88,
      skillDevelopment: 92,
      studyTimeHours: 3.5,
      technicalSkills: 'Distributed Systems, TypeScript, PyTorch, Relational DBs',
      softSkills: 'Cross-functional architecture, strategic problem solving',
      codingSkills: 'TypeScript, Python, Rust, SQL',
      learningScore: 90,
    },
  });

  // Career
  await prisma.careerRecord.create({
    data: {
      userId,
      resumeStrengths: 'Deep full-stack engineering, high throughput systems design',
      projectExperience: 'Autonomous digital replica engine, real-time telemetry streaming',
      certificationsCount: 4,
      targetRole: 'Chief AI Architect',
      industry: 'Human Augmented Intelligence',
      careerReadinessScore: 94,
    },
  });

  // Financial
  await prisma.financialRecord.create({
    data: {
      userId,
      monthlyIncome: 12500,
      monthlyExpenses: 4800,
      monthlySavings: 4500,
      monthlyBudget: 5000,
      investments: 'Global index ETFs, technology ventures, physical assets',
      financialScore: 95,
    },
  });

  // Habits
  const habit1 = await prisma.habit.create({
    data: {
      userId,
      name: '2.5L Hydration Target',
      category: 'Health',
      targetFrequency: 'daily',
      targetTime: 'Anytime',
      currentStreak: 18,
      longestStreak: 24,
    },
  });

  const habit2 = await prisma.habit.create({
    data: {
      userId,
      name: '10,000 Step Locomotion',
      category: 'Fitness',
      targetFrequency: 'daily',
      targetTime: 'Evening',
      currentStreak: 9,
      longestStreak: 14,
    },
  });

  const habit3 = await prisma.habit.create({
    data: {
      userId,
      name: '15 Minutes Mindfulness & Stillness',
      category: 'Mindfulness',
      targetFrequency: 'daily',
      targetTime: 'Morning',
      currentStreak: 12,
      longestStreak: 21,
    },
  });

  const habit4 = await prisma.habit.create({
    data: {
      userId,
      name: 'Read 20 Pages Technical Architecture',
      category: 'Productivity',
      targetFrequency: 'daily',
      targetTime: 'Evening',
      currentStreak: 7,
      longestStreak: 15,
    },
  });

  const todayStr = now.toISOString().split('T')[0];
  await prisma.habitLog.create({ data: { habitId: habit1.id, userId, date: todayStr, completed: true, streakAtLog: 18 } });
  await prisma.habitLog.create({ data: { habitId: habit2.id, userId, date: todayStr, completed: true, streakAtLog: 9 } });
  await prisma.habitLog.create({ data: { habitId: habit3.id, userId, date: todayStr, completed: true, streakAtLog: 12 } });

  // Goals
  await prisma.goal.create({
    data: {
      userId,
      category: 'Fitness',
      title: 'Run 100km Cumulative This Month',
      targetValue: 100,
      currentValue: 64.5,
      unit: 'km',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
    },
  });

  await prisma.goal.create({
    data: {
      userId,
      category: 'Financial',
      title: 'Establish $50,000 Liquid Reserve',
      targetValue: 50000,
      currentValue: 42000,
      unit: '$',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
    },
  });

  await prisma.goal.create({
    data: {
      userId,
      category: 'Career',
      title: 'Publish Distributed System Whitepaper',
      targetValue: 1,
      currentValue: 0.8,
      unit: 'draft',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
    },
  });

  console.log('✅ Demo profile seeded successfully!');
  console.log(`👤 Email: ${email}`);
  console.log(`🔑 Password: DigitalTwin2026!`);
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
