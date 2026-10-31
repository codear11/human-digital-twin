import OpenAI from 'openai';
import { ENV } from '../config/env';
import { HolisticTwinScore } from './scoring.service';

export interface AIReportPayload {
  reportType: 'HOLISTIC_TWIN' | 'WEEKLY_SUMMARY' | 'MONTHLY_SUMMARY' | 'PREDICTIVE_INSIGHT';
  twinData: {
    user: { name: string; email: string };
    profile?: any;
    scores: HolisticTwinScore;
    recentHealth?: any;
    recentFitness?: any;
    recentSleep?: any;
    recentMental?: any;
    recentEmotional?: any;
    recentFinancial?: any;
    recentEducation?: any;
    habits?: any[];
  };
}

export interface GeneratedReport {
  reportType: string;
  title: string;
  summary: string;
  observations: string[];
  recommendations: string[];
  predictions: string[];
  compositeScore: number | null;
  source: 'OPENAI_GPT' | 'LOCAL_HEURISTIC';
  disclaimer: string;
}

export class AIService {
  private static openaiClient = ENV.OPENAI_API_KEY ? new OpenAI({ apiKey: ENV.OPENAI_API_KEY }) : null;

  static async generateReport(payload: AIReportPayload): Promise<GeneratedReport> {
    const { reportType, twinData } = payload;

    // If OpenAI key is present, attempt LLM generation
    if (this.openaiClient) {
      try {
        return await this.generateOpenAIReport(reportType, twinData);
      } catch (error) {
        console.warn('[AI Service] OpenAI generation failed, falling back to deterministic local heuristic engine:', error);
      }
    }

    // Default or Fallback: Deterministic Local Heuristic Engine
    return this.generateLocalHeuristicReport(reportType, twinData);
  }

  private static async generateOpenAIReport(reportType: string, twinData: any): Promise<GeneratedReport> {
    const prompt = `
You are the AI Cognitive Core for an advanced Human Digital Twin platform.
Analyze this user's multi-dimensional twin data:
User Name: ${twinData.user.name}
Overall Twin Score: ${twinData.scores.overallScore ?? 'N/A'} (Data Completeness: ${twinData.scores.completenessPercentage}%)
Physical Health: ${JSON.stringify(twinData.recentHealth || {})}
Fitness: ${JSON.stringify(twinData.recentFitness || {})}
Sleep: ${JSON.stringify(twinData.recentSleep || {})}
Mental Wellness: ${JSON.stringify(twinData.recentMental || {})}
Emotional State: ${JSON.stringify(twinData.recentEmotional || {})}
Financial: ${JSON.stringify(twinData.recentFinancial || {})}
Education: ${JSON.stringify(twinData.recentEducation || {})}
Habits: ${JSON.stringify(twinData.habits || [])}

Generate a structured JSON response for Report Type: "${reportType}".
DO NOT give clinical medical diagnosis or certified financial advice.
Format your output strictly as a valid JSON object matching this schema:
{
  "title": "string",
  "summary": "string",
  "observations": ["string", "string", ...],
  "recommendations": ["string", "string", ...],
  "predictions": ["string", "string", ...]
}
`;

    const completion = await this.openaiClient!.chat.completions.create({
      model: ENV.OPENAI_MODEL,
      messages: [
        { role: 'system', content: 'You are an objective, supportive personal analytics AI for a Human Digital Twin platform. Respond strictly in valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = completion.choices[0].message?.content || '{}';
    const parsed = JSON.parse(content);

    return {
      reportType,
      title: parsed.title || `Digital Twin Analysis: ${reportType}`,
      summary: parsed.summary || 'Holistic Digital Twin multidimensional report generated.',
      observations: Array.isArray(parsed.observations) ? parsed.observations : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      predictions: Array.isArray(parsed.predictions) ? parsed.predictions : [],
      compositeScore: twinData.scores.overallScore,
      source: 'OPENAI_GPT',
      disclaimer: 'DISCLAIMER: AI-generated observations are for personal informational and educational tracking only. They do not constitute certified medical, psychiatric, or financial counsel.',
    };
  }

  private static generateLocalHeuristicReport(reportType: string, twinData: any): GeneratedReport {
    const name = twinData.user.name || 'User';
    const score = twinData.scores.overallScore;
    const completeness = twinData.scores.completenessPercentage;
    const observations: string[] = [];
    const recommendations: string[] = [];
    const predictions: string[] = [];

    // Analyze Sleep vs Mental/Emotional
    const sleepHours = twinData.recentSleep?.sleepDurationHours;
    const stress = twinData.recentMental?.stressLevel;
    const steps = twinData.recentFitness?.steps;
    const savings = twinData.recentFinancial?.monthlySavings;
    const income = twinData.recentFinancial?.monthlyIncome;

    if (sleepHours !== undefined && sleepHours !== null) {
      if (sleepHours >= 7 && sleepHours <= 9) {
        observations.push(`Optimal sleep duration logged (${sleepHours} hours), stabilizing daily cognitive recovery.`);
      } else if (sleepHours < 6) {
        observations.push(`Sleep duration deficit recorded (${sleepHours} hours), which may correlate with elevated perceived stress.`);
        recommendations.push('Establish a consistent wind-down buffer 45 minutes prior to target bedtime.');
      }
    }

    if (stress !== undefined && stress !== null) {
      if (stress > 65) {
        observations.push(`High stress indicators observed (${stress}%). Active parasympathetic recovery recommended.`);
        recommendations.push('Introduce 10 minutes of box-breathing or dedicated mindfulness midday.');
      } else {
        observations.push(`Stress regulation is maintained within healthy thresholds (${stress}%).`);
      }
    }

    if (steps !== undefined && steps !== null) {
      if (steps >= 8000) {
        observations.push(`Active lifestyle confirmed with ${steps.toLocaleString()} daily steps.`);
      } else {
        observations.push(`Daily physical locomotion currently recorded at ${steps.toLocaleString()} steps.`);
        recommendations.push('Incorporate two 15-minute brisk walking breaks into daily schedule to hit 8,000+ steps.');
      }
    }

    if (income && savings !== undefined && savings !== null) {
      const rate = Math.round((savings / income) * 100);
      observations.push(`Monthly savings rate calculated at ${rate}% of reported monthly income.`);
      if (rate >= 20) {
        recommendations.push('Maintain surplus allocations toward diversified emergency and growth reserves.');
      } else {
        recommendations.push('Identify discretionary spending categories to bring savings allocation closer to the 20% benchmark.');
      }
    }

    // Predictive Modeling (only if data exists)
    if (sleepHours && stress !== undefined) {
      if (sleepHours >= 7 && stress < 50) {
        predictions.push('Positive correlation detected: Consistent sleep >7 hours is projected to maintain low stress resilience across upcoming cycles.');
      } else if (sleepHours < 6) {
        predictions.push('Fatigue accumulation risk: Continued sleep deficit may reduce workout capacity and elevate midday stress by 15-20%.');
      }
    }

    if (income && savings) {
      const projectedAnnual = savings * 12;
      predictions.push(`Financial Trajectory: Maintaining current monthly savings pace projects a 12-month capital reserve of $${projectedAnnual.toLocaleString()}.`);
    }

    if (observations.length === 0) {
      observations.push('Digital Twin initialization phase: baseline biometric and lifestyle metrics are currently being compiled.');
      recommendations.push('Log health vitals, daily steps, and tonight’s sleep to enable deeper algorithmic trend detection.');
    }

    const titleMap: Record<string, string> = {
      HOLISTIC_TWIN: `Holistic Digital Twin Synthesis for ${name}`,
      WEEKLY_SUMMARY: `Weekly Multi-Dimensional Performance Summary (${name})`,
      MONTHLY_SUMMARY: `Monthly Digital Twin Growth & Trajectory Report`,
      PREDICTIVE_INSIGHT: `Predictive Behavioral & Health Pattern Model`,
    };

    return {
      reportType,
      title: titleMap[reportType] || `Digital Twin Report: ${reportType}`,
      summary: `Automated digital twin synthesis for ${name}. Holistic Replica score currently standing at ${score ?? 'Evaluating'} with ${completeness}% dimension coverage.`,
      observations,
      recommendations,
      predictions,
      compositeScore: score,
      source: 'LOCAL_HEURISTIC',
      disclaimer: 'DISCLAIMER: AI-generated observations and projections are based on self-reported and device-logged data. They are designed for self-discovery and personal optimization, and are not intended as certified medical, clinical, or financial advice.',
    };
  }
}
