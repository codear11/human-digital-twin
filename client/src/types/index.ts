export interface User {
  id: string;
  email: string;
  name: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  age?: number | null;
  gender?: string | null;
  height?: number | null; // cm
  weight?: number | null; // kg
  bloodGroup?: string | null;
  dob?: string | null;
  occupation?: string | null;
  education?: string | null;
  emergencyContact?: string | null;
  bio?: string | null;
}

export interface DimensionScore {
  dimension: string;
  score: number | null;
  status: 'complete' | 'partial' | 'insufficient_data';
  calculationBasis: string;
  metricsEvaluated: string[];
}

export interface DashboardOverview {
  user: { name: string; email: string };
  profile: Profile | null;
  twinScore: number | null;
  completenessPercentage: number;
  dataSufficient: boolean;
  limitations: string;
  dimensionScores: {
    health: DimensionScore;
    fitness: DimensionScore;
    sleep: DimensionScore;
    nutrition: DimensionScore;
    mental: DimensionScore;
    emotional: DimensionScore;
    personality: DimensionScore;
    social: DimensionScore;
    learning: DimensionScore;
    career: DimensionScore;
    financial: DimensionScore;
    habits: DimensionScore;
  };
  quickStats: {
    restingHeartRate: number | null;
    steps: number | null;
    sleepHours: number | null;
    stress: number | null;
    savingsRate: number | null;
    activeHabitsCount: number;
    completedHabitsToday: number;
  };
  alerts: Array<{
    type: 'info' | 'warning' | 'success';
    dimension: string;
    message: string;
  }>;
  recentActivity: Array<{
    type: string;
    text: string;
    time: string;
  }>;
  goals: Goal[];
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  category: string;
  targetFrequency: string;
  targetTime?: string | null;
  active: boolean;
  currentStreak: number;
  longestStreak: number;
  completedToday?: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  category: string;
  title: string;
  description?: string | null;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string | null;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  progressPercentage?: number;
}

export interface AIReport {
  id?: string;
  reportType: 'HOLISTIC_TWIN' | 'WEEKLY_SUMMARY' | 'MONTHLY_SUMMARY' | 'PREDICTIVE_INSIGHT';
  title: string;
  summary: string;
  observations: string[];
  recommendations: string[];
  predictions: string[];
  compositeScore: number | null;
  source: 'OPENAI_GPT' | 'LOCAL_HEURISTIC';
  disclaimer: string;
  generatedAt?: string;
}
