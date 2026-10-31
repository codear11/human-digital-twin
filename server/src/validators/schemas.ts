import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const profileSchema = z.object({
  age: z.coerce.number().int().min(1).max(130).optional().nullable(),
  gender: z.string().optional().nullable(),
  height: z.coerce.number().min(30).max(300).optional().nullable(), // cm
  weight: z.coerce.number().min(2).max(500).optional().nullable(),  // kg
  bloodGroup: z.string().optional().nullable(),
  dob: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  education: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});

export const healthSchema = z.object({
  heartRate: z.coerce.number().int().min(30).max(250).optional().nullable(),
  restingHeartRate: z.coerce.number().int().min(30).max(200).optional().nullable(),
  bloodPressureSys: z.coerce.number().int().min(60).max(250).optional().nullable(),
  bloodPressureDia: z.coerce.number().int().min(40).max(160).optional().nullable(),
  oxygenLevel: z.coerce.number().min(70).max(100).optional().nullable(),
  bloodSugar: z.coerce.number().min(40).max(600).optional().nullable(),
  cholesterol: z.coerce.number().min(80).max(600).optional().nullable(),
  muscleMass: z.coerce.number().min(5).max(100).optional().nullable(),
  boneDensity: z.coerce.number().min(-5).max(5).optional().nullable(),
  skinHealth: z.coerce.number().int().min(0).max(100).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const fitnessSchema = z.object({
  steps: z.coerce.number().int().min(0).max(100000).optional().nullable(),
  walkingDistance: z.coerce.number().min(0).max(150).optional().nullable(),
  activeCalories: z.coerce.number().min(0).max(15000).optional().nullable(),
  inactiveTime: z.coerce.number().min(0).max(24).optional().nullable(),
  waterIntake: z.coerce.number().min(0).max(20).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const nutritionSchema = z.object({
  mealType: z.string().optional().nullable(),
  mealDescription: z.string().optional().nullable(),
  calories: z.coerce.number().min(0).max(10000).optional().nullable(),
  protein: z.coerce.number().min(0).max(500).optional().nullable(),
  carbs: z.coerce.number().min(0).max(1000).optional().nullable(),
  fat: z.coerce.number().min(0).max(500).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const mentalSchema = z.object({
  stressLevel: z.coerce.number().int().min(0).max(100).optional().nullable(),
  anxietyLevel: z.coerce.number().int().min(0).max(100).optional().nullable(),
  burnoutLevel: z.coerce.number().int().min(0).max(100).optional().nullable(),
  depressionScreeningScore: z.coerce.number().int().min(0).max(27).optional().nullable(),
  relaxationLevel: z.coerce.number().int().min(0).max(100).optional().nullable(),
  mindfulnessLevel: z.coerce.number().int().min(0).max(100).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const emotionalSchema = z.object({
  happiness: z.coerce.number().int().min(0).max(100).optional().nullable(),
  sadness: z.coerce.number().int().min(0).max(100).optional().nullable(),
  anger: z.coerce.number().int().min(0).max(100).optional().nullable(),
  fear: z.coerce.number().int().min(0).max(100).optional().nullable(),
  confidence: z.coerce.number().int().min(0).max(100).optional().nullable(),
  motivation: z.coerce.number().int().min(0).max(100).optional().nullable(),
  excitement: z.coerce.number().int().min(0).max(100).optional().nullable(),
  dominantMood: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const personalitySchema = z.object({
  personalityType: z.string().optional().nullable(),
  openness: z.coerce.number().int().min(0).max(100).optional().nullable(),
  emotionalStability: z.coerce.number().int().min(0).max(100).optional().nullable(),
  communication: z.coerce.number().int().min(0).max(100).optional().nullable(),
  leadership: z.coerce.number().int().min(0).max(100).optional().nullable(),
  teamwork: z.coerce.number().int().min(0).max(100).optional().nullable(),
  adaptability: z.coerce.number().int().min(0).max(100).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const socialSchema = z.object({
  familyBond: z.coerce.number().int().min(0).max(100).optional().nullable(),
  friendshipScore: z.coerce.number().int().min(0).max(100).optional().nullable(),
  socialEngagement: z.coerce.number().int().min(0).max(100).optional().nullable(),
  interactionsCount: z.coerce.number().int().min(0).max(100).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const educationSchema = z.object({
  learningProgress: z.coerce.number().int().min(0).max(100).optional().nullable(),
  skillDevelopment: z.coerce.number().int().min(0).max(100).optional().nullable(),
  studyTimeHours: z.coerce.number().min(0).max(24).optional().nullable(),
  technicalSkills: z.string().optional().nullable(),
  softSkills: z.string().optional().nullable(),
  codingSkills: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const careerSchema = z.object({
  resumeStrengths: z.string().optional().nullable(),
  projectExperience: z.string().optional().nullable(),
  certificationsCount: z.coerce.number().int().min(0).max(100).optional().nullable(),
  targetRole: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const financialSchema = z.object({
  monthlyIncome: z.coerce.number().min(0).optional().nullable(),
  monthlyExpenses: z.coerce.number().min(0).optional().nullable(),
  monthlySavings: z.coerce.number().min(0).optional().nullable(),
  monthlyBudget: z.coerce.number().min(0).optional().nullable(),
  investments: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const sleepSchema = z.object({
  sleepDurationHours: z.coerce.number().min(0).max(24).optional().nullable(),
  bedtime: z.string().optional().nullable(),
  wakeTime: z.string().optional().nullable(),
  sleepQuality: z.coerce.number().int().min(0).max(100).optional().nullable(),
  deepSleepPercent: z.coerce.number().int().min(0).max(100).optional().nullable(),
  remSleepPercent: z.coerce.number().int().min(0).max(100).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const habitSchema = z.object({
  name: z.string().min(2, 'Habit name is required'),
  category: z.string().min(2, 'Category is required'),
  targetFrequency: z.string().default('daily'),
  targetTime: z.string().optional().nullable(),
});

export const habitToggleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  completed: z.boolean().default(true),
});

export const goalSchema = z.object({
  category: z.string().min(2, 'Category is required'),
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional().nullable(),
  targetValue: z.coerce.number(),
  currentValue: z.coerce.number().default(0),
  unit: z.string().min(1, 'Unit is required'),
  deadline: z.string().optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
});

export const goalProgressSchema = z.object({
  currentValue: z.coerce.number(),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'ABANDONED']).optional(),
});

export const aiReportSchema = z.object({
  reportType: z.enum(['HOLISTIC_TWIN', 'WEEKLY_SUMMARY', 'MONTHLY_SUMMARY', 'PREDICTIVE_INSIGHT']),
});
