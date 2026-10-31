/**
 * Transparent Scoring Engine for Human Digital Twin
 * 
 * Every dimension produces a normalized score (0–100), accompanied by:
 * 1. score (number | null)
 * 2. status: "complete" | "partial" | "insufficient_data"
 * 3. calculationBasis: transparent mathematical explanation
 * 4. metricsEvaluated: list of contributing variables
 */

export interface DimensionScoreResult {
  dimension: string;
  score: number | null;
  status: 'complete' | 'partial' | 'insufficient_data';
  calculationBasis: string;
  metricsEvaluated: string[];
}

export interface HolisticTwinScore {
  overallScore: number | null;
  completenessPercentage: number;
  dataSufficient: boolean;
  limitations: string;
  dimensionScores: Record<string, DimensionScoreResult>;
}

export class ScoringService {
  /**
   * 1. Physical Health Score Calculation
   * Evaluates: Resting HR (optimum 55-75), BP (optimum 110-125 / 70-80), SpO2 (optimum >=97%), Blood Sugar (optimum 70-99 fasting), BMI (optimum 18.5-24.9)
   */
  static calculateHealthScore(record: any, profile?: any): DimensionScoreResult {
    if (!record && !profile) {
      return {
        dimension: 'Physical Health',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'No physical health biometric records found.',
        metricsEvaluated: [],
      };
    }

    let subScores: { metric: string; score: number; weight: number }[] = [];

    // Resting Heart Rate (Weight 20%)
    const rhr = record?.restingHeartRate ?? record?.heartRate;
    if (rhr !== undefined && rhr !== null) {
      let hrScore = 100;
      if (rhr < 50) hrScore = 80;
      else if (rhr <= 70) hrScore = 100;
      else if (rhr <= 85) hrScore = 85;
      else if (rhr <= 100) hrScore = 65;
      else hrScore = 40;
      subScores.push({ metric: 'Resting Heart Rate', score: hrScore, weight: 0.20 });
    }

    // Blood Pressure (Weight 25%)
    if (record?.bloodPressureSys && record?.bloodPressureDia) {
      const sys = record.bloodPressureSys;
      const dia = record.bloodPressureDia;
      let bpScore = 100;
      if (sys < 120 && dia < 80) bpScore = 100; // Normal
      else if (sys <= 129 && dia < 80) bpScore = 85; // Elevated
      else if (sys <= 139 || dia <= 89) bpScore = 70; // Stage 1
      else bpScore = 50; // Stage 2
      subScores.push({ metric: 'Blood Pressure', score: bpScore, weight: 0.25 });
    }

    // Oxygen Level (SpO2) (Weight 20%)
    if (record?.oxygenLevel !== undefined && record?.oxygenLevel !== null) {
      const spo2 = record.oxygenLevel;
      let oxScore = 100;
      if (spo2 >= 98) oxScore = 100;
      else if (spo2 >= 95) oxScore = 90;
      else if (spo2 >= 92) oxScore = 70;
      else oxScore = 40;
      subScores.push({ metric: 'Oxygen Saturation (SpO2)', score: oxScore, weight: 0.20 });
    }

    // Blood Glucose (Weight 15%)
    if (record?.bloodSugar !== undefined && record?.bloodSugar !== null) {
      const bs = record.bloodSugar;
      let bsScore = 100;
      if (bs >= 70 && bs <= 99) bsScore = 100;
      else if (bs < 70) bsScore = 75;
      else if (bs <= 125) bsScore = 75;
      else bsScore = 50;
      subScores.push({ metric: 'Fasting Blood Glucose', score: bsScore, weight: 0.15 });
    }

    // BMI (Weight 20%)
    let bmi = record?.bmi;
    if (!bmi && profile?.height && profile?.weight) {
      const hM = profile.height / 100;
      bmi = parseFloat((profile.weight / (hM * hM)).toFixed(1));
    }
    if (bmi !== undefined && bmi !== null) {
      let bmiScore = 100;
      if (bmi >= 18.5 && bmi <= 24.9) bmiScore = 100;
      else if (bmi >= 25 && bmi <= 29.9) bmiScore = 80;
      else if (bmi >= 30) bmiScore = 60;
      else bmiScore = 70;
      subScores.push({ metric: `BMI (${bmi})`, score: bmiScore, weight: 0.20 });
    }

    if (subScores.length === 0) {
      return {
        dimension: 'Physical Health',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'Vitals not yet recorded. Log heart rate, BP, or BMI to initiate score.',
        metricsEvaluated: [],
      };
    }

    const totalWeight = subScores.reduce((acc, curr) => acc + curr.weight, 0);
    const weightedSum = subScores.reduce((acc, curr) => acc + curr.score * curr.weight, 0);
    const finalScore = Math.round(weightedSum / totalWeight);

    return {
      dimension: 'Physical Health',
      score: finalScore,
      status: subScores.length >= 3 ? 'complete' : 'partial',
      calculationBasis: `Weighted average across ${subScores.length} biometrics: ${subScores.map(s => `${s.metric} (${s.score}pts)`).join(', ')}.`,
      metricsEvaluated: subScores.map(s => s.metric),
    };
  }

  /**
   * 2. Fitness Score Calculation
   * Evaluates: Steps (benchmark 10,000 steps = 100), Active Calories, Water Intake (benchmark 2.5L-3.5L), Inactive Time (<8 hrs)
   */
  static calculateFitnessScore(record: any): DimensionScoreResult {
    if (!record) {
      return {
        dimension: 'Fitness',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'No fitness activity logged.',
        metricsEvaluated: [],
      };
    }

    let subScores: { metric: string; score: number; weight: number }[] = [];

    // Steps (Weight 40%)
    if (record.steps !== undefined && record.steps !== null) {
      const stepScore = Math.min(100, Math.round((record.steps / 10000) * 100));
      subScores.push({ metric: `Steps (${record.steps}/10k)`, score: stepScore, weight: 0.40 });
    }

    // Active Calories (Weight 25%)
    if (record.activeCalories !== undefined && record.activeCalories !== null) {
      const calScore = Math.min(100, Math.round((record.activeCalories / 500) * 100));
      subScores.push({ metric: `Active Energy (${record.activeCalories} kcal)`, score: calScore, weight: 0.25 });
    }

    // Hydration (Weight 20%)
    if (record.waterIntake !== undefined && record.waterIntake !== null) {
      const waterScore = Math.min(100, Math.round((record.waterIntake / 2.5) * 100));
      subScores.push({ metric: `Hydration (${record.waterIntake}L)`, score: waterScore, weight: 0.20 });
    }

    // Inactivity reduction (Weight 15%)
    if (record.inactiveTime !== undefined && record.inactiveTime !== null) {
      let sedentaryScore = 100;
      if (record.inactiveTime > 10) sedentaryScore = 50;
      else if (record.inactiveTime > 8) sedentaryScore = 70;
      else if (record.inactiveTime > 6) sedentaryScore = 85;
      subScores.push({ metric: `Sedentary Time (${record.inactiveTime}h)`, score: sedentaryScore, weight: 0.15 });
    }

    if (subScores.length === 0) {
      return {
        dimension: 'Fitness',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'No activity metrics available. Log daily steps or workout metrics.',
        metricsEvaluated: [],
      };
    }

    const totalWeight = subScores.reduce((acc, curr) => acc + curr.weight, 0);
    const weightedSum = subScores.reduce((acc, curr) => acc + curr.score * curr.weight, 0);
    const finalScore = Math.round(weightedSum / totalWeight);

    return {
      dimension: 'Fitness',
      score: finalScore,
      status: subScores.length >= 2 ? 'complete' : 'partial',
      calculationBasis: `Evaluated ${subScores.length} activity metrics: ${subScores.map(s => `${s.metric}`).join(', ')}.`,
      metricsEvaluated: subScores.map(s => s.metric),
    };
  }

  /**
   * 3. Sleep Score Calculation
   * Evaluates: Duration (optimum 7-9 hrs = 100), Sleep Quality (0-100), Deep sleep ratio
   */
  static calculateSleepScore(record: any): DimensionScoreResult {
    if (!record) {
      return {
        dimension: 'Sleep',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'No sleep session logged.',
        metricsEvaluated: [],
      };
    }

    let subScores: { metric: string; score: number; weight: number }[] = [];

    if (record.sleepDurationHours !== undefined && record.sleepDurationHours !== null) {
      const dur = record.sleepDurationHours;
      let durScore = 100;
      if (dur >= 7 && dur <= 9) durScore = 100;
      else if (dur >= 6 && dur < 7) durScore = 80;
      else if (dur > 9 && dur <= 10) durScore = 85;
      else if (dur >= 5) durScore = 60;
      else durScore = 40;
      subScores.push({ metric: `Duration (${dur}h)`, score: durScore, weight: 0.50 });
    }

    if (record.sleepQuality !== undefined && record.sleepQuality !== null) {
      subScores.push({ metric: `Quality (${record.sleepQuality}%)`, score: record.sleepQuality, weight: 0.35 });
    }

    if (record.deepSleepPercent !== undefined && record.deepSleepPercent !== null) {
      const deepScore = Math.min(100, Math.round((record.deepSleepPercent / 20) * 100));
      subScores.push({ metric: `Deep Sleep (${record.deepSleepPercent}%)`, score: deepScore, weight: 0.15 });
    }

    if (subScores.length === 0) {
      return {
        dimension: 'Sleep',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'No sleep duration or quality recorded.',
        metricsEvaluated: [],
      };
    }

    const totalWeight = subScores.reduce((acc, curr) => acc + curr.weight, 0);
    const weightedSum = subScores.reduce((acc, curr) => acc + curr.score * curr.weight, 0);
    const finalScore = Math.round(weightedSum / totalWeight);

    return {
      dimension: 'Sleep',
      score: finalScore,
      status: subScores.length >= 2 ? 'complete' : 'partial',
      calculationBasis: `Computed from ${subScores.map(s => `${s.metric}`).join(' and ')}.`,
      metricsEvaluated: subScores.map(s => s.metric),
    };
  }

  /**
   * 4. Nutrition Score Calculation
   * Evaluates: Caloric balance, macronutrient distribution (protein target, healthy balance)
   */
  static calculateNutritionScore(record: any): DimensionScoreResult {
    if (!record) {
      return {
        dimension: 'Nutrition',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'No meal records logged.',
        metricsEvaluated: [],
      };
    }

    let subScores: { metric: string; score: number; weight: number }[] = [];

    if (record.calories !== undefined && record.calories !== null) {
      const cal = record.calories;
      let calScore = 100;
      if (cal >= 1800 && cal <= 2600) calScore = 100;
      else if (cal >= 1500 && cal <= 3000) calScore = 80;
      else calScore = 65;
      subScores.push({ metric: `Calorie Target (${cal} kcal)`, score: calScore, weight: 0.40 });
    }

    if (record.protein !== undefined && record.protein !== null) {
      const protScore = Math.min(100, Math.round((record.protein / 80) * 100));
      subScores.push({ metric: `Protein (${record.protein}g)`, score: protScore, weight: 0.35 });
    }

    if (record.dietaryScore !== undefined && record.dietaryScore !== null) {
      subScores.push({ metric: 'Dietary Variety Score', score: record.dietaryScore, weight: 0.25 });
    }

    if (subScores.length === 0) {
      return {
        dimension: 'Nutrition',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'Nutritional macro records missing.',
        metricsEvaluated: [],
      };
    }

    const totalWeight = subScores.reduce((acc, curr) => acc + curr.weight, 0);
    const weightedSum = subScores.reduce((acc, curr) => acc + curr.score * curr.weight, 0);
    const finalScore = Math.round(weightedSum / totalWeight);

    return {
      dimension: 'Nutrition',
      score: finalScore,
      status: 'partial',
      calculationBasis: `Aggregated from ${subScores.map(s => s.metric).join(', ')}.`,
      metricsEvaluated: subScores.map(s => s.metric),
    };
  }

  /**
   * 5. Mental Health Score Calculation
   * Evaluates: Stress (inverted), Anxiety (inverted), Burnout (inverted), Mindfulness
   */
  static calculateMentalScore(record: any): DimensionScoreResult {
    if (!record) {
      return {
        dimension: 'Mental Health',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'No mental wellness self-assessments completed.',
        metricsEvaluated: [],
      };
    }

    let subScores: { metric: string; score: number; weight: number }[] = [];

    // Stress (inverted: 0 stress = 100 score)
    if (record.stressLevel !== undefined && record.stressLevel !== null) {
      const stressScore = Math.max(0, 100 - record.stressLevel);
      subScores.push({ metric: `Stress Regulation (${100 - record.stressLevel}%)`, score: stressScore, weight: 0.30 });
    }

    // Anxiety (inverted)
    if (record.anxietyLevel !== undefined && record.anxietyLevel !== null) {
      const anxiScore = Math.max(0, 100 - record.anxietyLevel);
      subScores.push({ metric: `Anxiety Resilience (${100 - record.anxietyLevel}%)`, score: anxiScore, weight: 0.25 });
    }

    // Burnout (inverted)
    if (record.burnoutLevel !== undefined && record.burnoutLevel !== null) {
      const boScore = Math.max(0, 100 - record.burnoutLevel);
      subScores.push({ metric: `Burnout Prevention (${100 - record.burnoutLevel}%)`, score: boScore, weight: 0.25 });
    }

    // Mindfulness
    if (record.mindfulnessLevel !== undefined && record.mindfulnessLevel !== null) {
      subScores.push({ metric: `Mindfulness Practice (${record.mindfulnessLevel}%)`, score: record.mindfulnessLevel, weight: 0.20 });
    }

    if (subScores.length === 0) {
      return {
        dimension: 'Mental Health',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'Self-reported stress or mindfulness levels required.',
        metricsEvaluated: [],
      };
    }

    const totalWeight = subScores.reduce((acc, curr) => acc + curr.weight, 0);
    const weightedSum = subScores.reduce((acc, curr) => acc + curr.score * curr.weight, 0);
    const finalScore = Math.round(weightedSum / totalWeight);

    return {
      dimension: 'Mental Health',
      score: finalScore,
      status: subScores.length >= 2 ? 'complete' : 'partial',
      calculationBasis: `Self-reported balance: ${subScores.map(s => s.metric).join(', ')}. Note: Not a clinical psychiatric diagnosis.`,
      metricsEvaluated: subScores.map(s => s.metric),
    };
  }

  /**
   * 6. Emotional Health Score Calculation
   * Evaluates: Happiness, Confidence, Motivation vs Anger/Fear/Sadness
   */
  static calculateEmotionalScore(record: any): DimensionScoreResult {
    if (!record) {
      return {
        dimension: 'Emotional Health',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'No mood logs submitted today.',
        metricsEvaluated: [],
      };
    }

    let positiveScore = 0;
    let positiveCount = 0;
    if (record.happiness !== undefined && record.happiness !== null) { positiveScore += record.happiness; positiveCount++; }
    if (record.confidence !== undefined && record.confidence !== null) { positiveScore += record.confidence; positiveCount++; }
    if (record.motivation !== undefined && record.motivation !== null) { positiveScore += record.motivation; positiveCount++; }
    if (record.excitement !== undefined && record.excitement !== null) { positiveScore += record.excitement; positiveCount++; }

    let negativePenalty = 0;
    let negativeCount = 0;
    if (record.sadness !== undefined && record.sadness !== null) { negativePenalty += record.sadness; negativeCount++; }
    if (record.anger !== undefined && record.anger !== null) { negativePenalty += record.anger; negativeCount++; }
    if (record.fear !== undefined && record.fear !== null) { negativePenalty += record.fear; negativeCount++; }

    if (positiveCount === 0 && negativeCount === 0) {
      return {
        dimension: 'Emotional Health',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'No emotional state indicators logged.',
        metricsEvaluated: [],
      };
    }

    const avgPos = positiveCount > 0 ? positiveScore / positiveCount : 50;
    const avgNeg = negativeCount > 0 ? negativePenalty / negativeCount : 0;
    const finalScore = Math.round(Math.min(100, Math.max(0, (avgPos * 0.7) + ((100 - avgNeg) * 0.3))));

    return {
      dimension: 'Emotional Health',
      score: finalScore,
      status: 'complete',
      calculationBasis: `Positivity index (avg ${Math.round(avgPos)}%) balanced against distress factors (avg ${Math.round(avgNeg)}%).`,
      metricsEvaluated: ['Happiness', 'Confidence', 'Motivation', 'Sadness', 'Anger', 'Fear'],
    };
  }

  /**
   * Personality Score Calculation
   * Evaluates: Communication, Leadership, Teamwork, Adaptability, Openness
   */
  static calculatePersonalityScore(record: any): DimensionScoreResult {
    if (!record) {
      return {
        dimension: 'Personality Profile',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'Personality and behavioral traits not yet evaluated.',
        metricsEvaluated: [],
      };
    }

    let sum = 0;
    let count = 0;
    const metrics: string[] = [];

    if (record.communication !== null && record.communication !== undefined) { sum += record.communication; count++; metrics.push('Communication'); }
    if (record.leadership !== null && record.leadership !== undefined) { sum += record.leadership; count++; metrics.push('Leadership'); }
    if (record.teamwork !== null && record.teamwork !== undefined) { sum += record.teamwork; count++; metrics.push('Teamwork'); }
    if (record.adaptability !== null && record.adaptability !== undefined) { sum += record.adaptability; count++; metrics.push('Adaptability'); }
    if (record.openness !== null && record.openness !== undefined) { sum += record.openness; count++; metrics.push('Openness'); }

    if (count === 0) {
      return {
        dimension: 'Personality Profile',
        score: 75,
        status: 'partial',
        calculationBasis: `Type: ${record.personalityType || 'Unassigned'}. Specific capability metrics not yet logged.`,
        metricsEvaluated: [record.personalityType || 'Type'],
      };
    }

    const score = Math.round(sum / count);
    return {
      dimension: 'Personality Profile',
      score,
      status: count >= 3 ? 'complete' : 'partial',
      calculationBasis: `Evaluated ${count} personality dimensions (avg ${score}%). Note: Self-assessment, non-diagnostic.`,
      metricsEvaluated: metrics,
    };
  }

  /**
   * 7. Social Score Calculation
   * Evaluates: Family bond (0-100), Friendship score (0-100), Social engagement
   */
  static calculateSocialScore(record: any): DimensionScoreResult {
    if (!record) {
      return {
        dimension: 'Social Score',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'Social relationships questionnaire not completed.',
        metricsEvaluated: [],
      };
    }

    let sum = 0;
    let count = 0;
    if (record.familyBond !== null && record.familyBond !== undefined) { sum += record.familyBond; count++; }
    if (record.friendshipScore !== null && record.friendshipScore !== undefined) { sum += record.friendshipScore; count++; }
    if (record.socialEngagement !== null && record.socialEngagement !== undefined) { sum += record.socialEngagement; count++; }

    if (count === 0) {
      return {
        dimension: 'Social Score',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'Social indices empty.',
        metricsEvaluated: [],
      };
    }

    const score = Math.round(sum / count);
    return {
      dimension: 'Social Score',
      score,
      status: count >= 2 ? 'complete' : 'partial',
      calculationBasis: `Mean average of ${count} social cohesion indices (${score}/100).`,
      metricsEvaluated: ['Family Bond', 'Friendship Index', 'Social Engagement'],
    };
  }

  /**
   * 8. Learning Score Calculation
   * Evaluates: Learning progress, Skill development, Study time (benchmark 3h/day)
   */
  static calculateLearningScore(record: any): DimensionScoreResult {
    if (!record) {
      return {
        dimension: 'Learning Score',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'No study or skill logs available.',
        metricsEvaluated: [],
      };
    }

    let subScores: { metric: string; score: number; weight: number }[] = [];
    if (record.learningProgress !== null && record.learningProgress !== undefined) {
      subScores.push({ metric: 'Learning Progress', score: record.learningProgress, weight: 0.40 });
    }
    if (record.skillDevelopment !== null && record.skillDevelopment !== undefined) {
      subScores.push({ metric: 'Skill Development', score: record.skillDevelopment, weight: 0.35 });
    }
    if (record.studyTimeHours !== null && record.studyTimeHours !== undefined) {
      const studyScore = Math.min(100, Math.round((record.studyTimeHours / 3) * 100));
      subScores.push({ metric: `Study Time (${record.studyTimeHours}h)`, score: studyScore, weight: 0.25 });
    }

    if (subScores.length === 0) {
      return {
        dimension: 'Learning Score',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'No education progress metrics recorded.',
        metricsEvaluated: [],
      };
    }

    const totalWeight = subScores.reduce((acc, curr) => acc + curr.weight, 0);
    const weightedSum = subScores.reduce((acc, curr) => acc + curr.score * curr.weight, 0);
    return {
      dimension: 'Learning Score',
      score: Math.round(weightedSum / totalWeight),
      status: subScores.length >= 2 ? 'complete' : 'partial',
      calculationBasis: `Weighted progress across ${subScores.map(s => s.metric).join(', ')}.`,
      metricsEvaluated: subScores.map(s => s.metric),
    };
  }

  /**
   * 9. Career Score Calculation
   * Evaluates: Certifications, Projects, Career readiness self-rating
   */
  static calculateCareerScore(record: any): DimensionScoreResult {
    if (!record) {
      return {
        dimension: 'Career Score',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'No career readiness records logged.',
        metricsEvaluated: [],
      };
    }

    let score = 50;
    if (record.careerReadinessScore !== null && record.careerReadinessScore !== undefined) {
      score = record.careerReadinessScore;
    } else {
      let pts = 40;
      if (record.resumeStrengths) pts += 20;
      if (record.projectExperience) pts += 20;
      if (record.certificationsCount > 0) pts += Math.min(20, record.certificationsCount * 10);
      score = Math.min(100, pts);
    }

    return {
      dimension: 'Career Score',
      score,
      status: 'complete',
      calculationBasis: 'Career portfolio and readiness self-assessment index.',
      metricsEvaluated: ['Resume Strengths', 'Project Experience', 'Certifications'],
    };
  }

  /**
   * 10. Financial Score Calculation
   * Evaluates: Savings Rate (Savings / Income * 100: benchmark >=20% = 100), Budget compliance
   */
  static calculateFinancialScore(record: any): DimensionScoreResult {
    if (!record || (record.monthlyIncome === null && record.monthlySavings === null && record.monthlyExpenses === null)) {
      return {
        dimension: 'Financial Score',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'No financial income/expense records submitted.',
        metricsEvaluated: [],
      };
    }

    let subScores: { metric: string; score: number; weight: number }[] = [];

    // Savings rate (benchmark >= 20% savings of income)
    if (record.monthlyIncome && record.monthlySavings !== null && record.monthlySavings !== undefined) {
      const rate = (record.monthlySavings / record.monthlyIncome) * 100;
      const rateScore = Math.min(100, Math.round((rate / 20) * 100));
      subScores.push({ metric: `Savings Rate (${Math.round(rate)}%)`, score: rateScore, weight: 0.60 });
    }

    // Budget adherence
    if (record.monthlyBudget && record.monthlyExpenses) {
      const ratio = record.monthlyExpenses / record.monthlyBudget;
      let budgetScore = 100;
      if (ratio <= 0.9) budgetScore = 100;
      else if (ratio <= 1.0) budgetScore = 90;
      else if (ratio <= 1.15) budgetScore = 70;
      else budgetScore = 40;
      subScores.push({ metric: `Budget Adherence (${Math.round(ratio * 100)}%)`, score: budgetScore, weight: 0.40 });
    }

    if (subScores.length === 0) {
      return {
        dimension: 'Financial Score',
        score: 65,
        status: 'partial',
        calculationBasis: 'Basic financial overview submitted without complete income/budget pairs.',
        metricsEvaluated: ['Partial financial figures'],
      };
    }

    const totalWeight = subScores.reduce((acc, curr) => acc + curr.weight, 0);
    const weightedSum = subScores.reduce((acc, curr) => acc + curr.score * curr.weight, 0);
    return {
      dimension: 'Financial Score',
      score: Math.round(weightedSum / totalWeight),
      status: 'complete',
      calculationBasis: `Savings and budget adherence: ${subScores.map(s => s.metric).join(', ')}.`,
      metricsEvaluated: subScores.map(s => s.metric),
    };
  }

  /**
   * 11. Habits Score Calculation
   * Evaluates: Active habits completion rate over the last 7 days + streak consistency
   */
  static calculateHabitScore(habits: any[], logs: any[]): DimensionScoreResult {
    if (!habits || habits.length === 0) {
      return {
        dimension: 'Habits Score',
        score: null,
        status: 'insufficient_data',
        calculationBasis: 'No habit trackers established. Add your daily habits to generate score.',
        metricsEvaluated: [],
      };
    }

    // Average completion over active habits
    const totalHabits = habits.length;
    const completedToday = logs.filter(l => l.completed).length;
    const completionRate = Math.round((completedToday / totalHabits) * 100);

    const avgStreak = habits.reduce((acc, h) => acc + (h.currentStreak || 0), 0) / totalHabits;
    const streakBonus = Math.min(20, Math.round(avgStreak * 2));

    const finalScore = Math.min(100, Math.round((completionRate * 0.8) + streakBonus));

    return {
      dimension: 'Habits Score',
      score: finalScore,
      status: 'complete',
      calculationBasis: `Evaluated ${completedToday}/${totalHabits} completed habits today with avg streak ${avgStreak.toFixed(1)} days.`,
      metricsEvaluated: habits.map(h => h.name),
    };
  }

  /**
   * Holistic Composite Digital Twin Score
   * Transparently calculated ONLY if at least 4 dimensions have sufficient data.
   */
  static computeHolisticTwin(dimensionScores: Record<string, DimensionScoreResult>): HolisticTwinScore {
    const validScores: number[] = [];
    const totalDimensions = Object.keys(dimensionScores).length;

    for (const key of Object.keys(dimensionScores)) {
      const dim = dimensionScores[key];
      if (dim.score !== null && dim.score !== undefined) {
        validScores.push(dim.score);
      }
    }

    const completeness = Math.min(100, Math.round((validScores.length / totalDimensions) * 100));

    if (validScores.length < 3) {
      return {
        overallScore: null,
        completenessPercentage: completeness,
        dataSufficient: false,
        limitations: `Insufficient dimension data (${validScores.length}/${totalDimensions} available). A minimum of 3 populated dimensions is required to formulate an accurate replica score.`,
        dimensionScores,
      };
    }

    const sum = validScores.reduce((acc, s) => acc + s, 0);
    const overallScore = Math.round(sum / validScores.length);

    let limitations = `Calculated as the arithmetic mean across ${validScores.length} of ${totalDimensions} digital twin dimensions.`;
    if (validScores.length < totalDimensions) {
      limitations += ` ${totalDimensions - validScores.length} dimensions remain unpopulated and are excluded rather than scored as zero.`;
    }

    return {
      overallScore,
      completenessPercentage: completeness,
      dataSufficient: true,
      limitations,
      dimensionScores,
    };
  }
}
