import { describe, it, expect } from 'vitest';
import { ScoringService } from '../services/scoring.service';

describe('ScoringService - Transparent 11-Dimension Engine', () => {
  it('should return insufficient_data when records are empty for health', () => {
    const result = ScoringService.calculateHealthScore(null, null);
    expect(result.score).toBeNull();
    expect(result.status).toBe('insufficient_data');
  });

  it('should correctly calculate health score for optimal resting HR and blood pressure', () => {
    const record = {
      restingHeartRate: 60,
      bloodPressureSys: 118,
      bloodPressureDia: 76,
      oxygenLevel: 99,
      bloodSugar: 85,
    };
    const profile = { height: 175, weight: 68 }; // BMI ~ 22.2 (normal)
    const result = ScoringService.calculateHealthScore(record, profile);

    expect(result.score).toBe(100);
    expect(result.status).toBe('complete');
    expect(result.calculationBasis).toContain('Weighted average');
  });

  it('should calculate fitness score from steps and active calories', () => {
    const record = {
      steps: 10000,
      activeCalories: 500,
      waterIntake: 2.5,
      inactiveTime: 5,
    };
    const result = ScoringService.calculateFitnessScore(record);
    expect(result.score).toBe(100);
    expect(result.status).toBe('complete');
  });

  it('should calculate sleep score penalizing short sleep duration', () => {
    const record = {
      sleepDurationHours: 4.5,
      sleepQuality: 50,
      deepSleepPercent: 10,
    };
    const result = ScoringService.calculateSleepScore(record);
    expect(result.score).toBeLessThan(60);
  });

  it('should calculate mental score properly inverting stress and anxiety', () => {
    const record = {
      stressLevel: 20, // 80 resilience
      anxietyLevel: 10, // 90 resilience
      burnoutLevel: 15, // 85 resilience
      mindfulnessLevel: 80,
    };
    const result = ScoringService.calculateMentalScore(record);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.calculationBasis).toContain('Self-reported balance');
  });

  it('should enforce data sufficiency for holistic twin computation', () => {
    const dimensionScores = {
      health: ScoringService.calculateHealthScore(null, null),
      fitness: ScoringService.calculateFitnessScore(null),
      sleep: ScoringService.calculateSleepScore(null),
    };

    const holistic = ScoringService.computeHolisticTwin(dimensionScores);
    expect(holistic.dataSufficient).toBe(false);
    expect(holistic.overallScore).toBeNull();
  });
});
