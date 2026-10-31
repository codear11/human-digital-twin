import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  History,
  PlusCircle,
  Info,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export const ModuleDetailPage: React.FC = () => {
  const { module = 'health' } = useParams<{ module: string }>();

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const moduleTitles: Record<string, { title: string; desc: string }> = {
    health: { title: 'Physical Health', desc: 'Heart rate, resting pulse, blood pressure, oxygen saturation, blood sugar, BMI' },
    fitness: { title: 'Fitness & Lifestyle', desc: 'Daily step locomotion, walking distance, active caloric output, hydration' },
    sleep: { title: 'Sleep Tracking', desc: 'Sleep duration, bedtime, wake time, sleep quality %, deep sleep architecture' },
    nutrition: { title: 'Nutrition & Diet', desc: 'Meal tracking, calorie target, protein, carbs, fats, dietary quality' },
    mental: { title: 'Mental Health & Resilience', desc: 'Perceived stress, anxiety self-assessment, burnout check, mindfulness' },
    emotional: { title: 'Emotional Health & Mood', desc: 'Happiness, confidence, motivation, emotional regulation, mood logging' },
    personality: { title: 'Personality Profile', desc: 'Introversion/Extroversion, Big Five traits, leadership, adaptability' },
    social: { title: 'Social Relationships', desc: 'Family bonds, friendship satisfaction, social engagement, interaction frequency' },
    education: { title: 'Education & Learning', desc: 'Learning progress, skill acquisition, daily study time, coding and technical skills' },
    career: { title: 'Career Readiness', desc: 'Resume strength, project portfolio, certifications, career advancement index' },
    financial: { title: 'Financial Health', desc: 'Monthly income, expense tracking, savings rate, budget adherence, investments' },
  };

  const currentInfo = moduleTitles[module] || { title: 'Dimension Details', desc: 'Digital Twin dimension analytics' };

  const fetchModuleData = async () => {
    setIsLoading(true);
    try {
      const res = await api.dimensions.get(module);
      setData(res);
      // Pre-fill form with latest values if available
      if (res.latest) {
        setFormData({ ...res.latest });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to load dimension metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModuleData();
    setSuccessMessage(null);
    setErrorMessage(null);
  }, [module]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === '' ? null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await api.dimensions.log(module, formData);
      setSuccessMessage('Dimension data successfully recorded to your Digital Twin vault!');
      fetchModuleData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to record entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message={`Loading ${currentInfo.title} metrics...`} />;
  }

  // Generate chart data from history
  const chartData = (data?.history || []).slice().reverse().map((rec: any, idx: number) => {
    const date = new Date(rec.recordedAt).toLocaleDateString([], { month: 'short', day: 'numeric' });
    let value = 0;
    if (module === 'health') value = rec.restingHeartRate || rec.heartRate || 70;
    else if (module === 'fitness') value = rec.steps || 0;
    else if (module === 'sleep') value = rec.sleepDurationHours || 0;
    else if (module === 'mental') value = rec.stressLevel || 0;
    else if (module === 'emotional') value = rec.happiness || 0;
    else if (module === 'financial') value = rec.monthlySavings || 0;
    else value = rec.score || idx + 50;

    return {
      date,
      value,
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Navigation header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
          Module: {module}
        </span>
      </div>

      {/* Module Title Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">{currentInfo.title}</h1>
          <p className="text-xs text-slate-400 mt-1">{currentInfo.desc}</p>
        </div>

        {data?.score && (
          <div className="text-left md:text-right bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Current Dimension Score</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-cyan-400">{data.score.score ?? '--'}</span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
            <p className="text-[10px] text-slate-400 max-w-xs">{data.score.calculationBasis}</p>
          </div>
        )}
      </div>

      {/* Status Notifications */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Historical Trend Chart */}
      {chartData.length > 1 && (
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Historical Trend Observation</span>
            </h3>
            <span className="text-xs text-slate-400">{chartData.length} records in timeline</span>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4, fill: '#38bdf8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Input Form Card */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <PlusCircle className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-bold text-white">Log New {currentInfo.title} Record</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Dynamic fields based on module */}
            {module === 'health' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Heart Rate (BPM)</label>
                  <input
                    type="number"
                    value={formData.heartRate || ''}
                    onChange={(e) => handleInputChange('heartRate', e.target.value)}
                    placeholder="e.g. 72"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Resting Heart Rate (BPM)</label>
                  <input
                    type="number"
                    value={formData.restingHeartRate || ''}
                    onChange={(e) => handleInputChange('restingHeartRate', e.target.value)}
                    placeholder="e.g. 62"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Blood Pressure Systolic (mmHg)</label>
                  <input
                    type="number"
                    value={formData.bloodPressureSys || ''}
                    onChange={(e) => handleInputChange('bloodPressureSys', e.target.value)}
                    placeholder="e.g. 120"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Blood Pressure Diastolic (mmHg)</label>
                  <input
                    type="number"
                    value={formData.bloodPressureDia || ''}
                    onChange={(e) => handleInputChange('bloodPressureDia', e.target.value)}
                    placeholder="e.g. 80"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Oxygen Saturation (SpO2 %)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.oxygenLevel || ''}
                    onChange={(e) => handleInputChange('oxygenLevel', e.target.value)}
                    placeholder="e.g. 98.5"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Fasting Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    value={formData.bloodSugar || ''}
                    onChange={(e) => handleInputChange('bloodSugar', e.target.value)}
                    placeholder="e.g. 90"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
              </>
            )}

            {module === 'fitness' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Daily Steps</label>
                  <input
                    type="number"
                    value={formData.steps || ''}
                    onChange={(e) => handleInputChange('steps', e.target.value)}
                    placeholder="e.g. 8500"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Walking Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.walkingDistance || ''}
                    onChange={(e) => handleInputChange('walkingDistance', e.target.value)}
                    placeholder="e.g. 6.2"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Active Calories (kcal)</label>
                  <input
                    type="number"
                    value={formData.activeCalories || ''}
                    onChange={(e) => handleInputChange('activeCalories', e.target.value)}
                    placeholder="e.g. 450"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Water Intake (liters)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.waterIntake || ''}
                    onChange={(e) => handleInputChange('waterIntake', e.target.value)}
                    placeholder="e.g. 2.5"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Sedentary Time (hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.inactiveTime || ''}
                    onChange={(e) => handleInputChange('inactiveTime', e.target.value)}
                    placeholder="e.g. 6.5"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
              </>
            )}

            {module === 'sleep' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Sleep Duration (hours)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.sleepDurationHours || ''}
                    onChange={(e) => handleInputChange('sleepDurationHours', e.target.value)}
                    placeholder="e.g. 7.5"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Bedtime</label>
                  <input
                    type="time"
                    value={formData.bedtime || ''}
                    onChange={(e) => handleInputChange('bedtime', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Wake Time</label>
                  <input
                    type="time"
                    value={formData.wakeTime || ''}
                    onChange={(e) => handleInputChange('wakeTime', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Sleep Quality (0-100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.sleepQuality || ''}
                    onChange={(e) => handleInputChange('sleepQuality', e.target.value)}
                    placeholder="e.g. 85"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Deep Sleep Ratio (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.deepSleepPercent || ''}
                    onChange={(e) => handleInputChange('deepSleepPercent', e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
              </>
            )}

            {module === 'mental' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Stress Level (0-100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.stressLevel ?? ''}
                    onChange={(e) => handleInputChange('stressLevel', e.target.value)}
                    placeholder="e.g. 25"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Anxiety Level (0-100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.anxietyLevel ?? ''}
                    onChange={(e) => handleInputChange('anxietyLevel', e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Burnout Perception (0-100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.burnoutLevel ?? ''}
                    onChange={(e) => handleInputChange('burnoutLevel', e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Mindfulness Practice (0-100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.mindfulnessLevel ?? ''}
                    onChange={(e) => handleInputChange('mindfulnessLevel', e.target.value)}
                    placeholder="e.g. 80"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
              </>
            )}

            {module === 'emotional' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Happiness (0-100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.happiness ?? ''}
                    onChange={(e) => handleInputChange('happiness', e.target.value)}
                    placeholder="e.g. 85"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Confidence (0-100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.confidence ?? ''}
                    onChange={(e) => handleInputChange('confidence', e.target.value)}
                    placeholder="e.g. 90"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Motivation (0-100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.motivation ?? ''}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    placeholder="e.g. 80"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Dominant Mood</label>
                  <select
                    value={formData.dominantMood || ''}
                    onChange={(e) => handleInputChange('dominantMood', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  >
                    <option value="">Select Mood</option>
                    <option value="Joyful">Joyful</option>
                    <option value="Calm & Reflective">Calm & Reflective</option>
                    <option value="Energetic">Energetic</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Tired">Tired</option>
                    <option value="Stressed">Stressed</option>
                  </select>
                </div>
              </>
            )}

            {module === 'financial' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Monthly Income ($)</label>
                  <input
                    type="number"
                    value={formData.monthlyIncome || ''}
                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                    placeholder="e.g. 6000"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Monthly Expenses ($)</label>
                  <input
                    type="number"
                    value={formData.monthlyExpenses || ''}
                    onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Monthly Savings ($)</label>
                  <input
                    type="number"
                    value={formData.monthlySavings || ''}
                    onChange={(e) => handleInputChange('monthlySavings', e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Monthly Budget ($)</label>
                  <input
                    type="number"
                    value={formData.monthlyBudget || ''}
                    onChange={(e) => handleInputChange('monthlyBudget', e.target.value)}
                    placeholder="e.g. 4000"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
              </>
            )}

            {/* Other dimensions fallback */}
            {!['health', 'fitness', 'sleep', 'mental', 'emotional', 'financial'].includes(module) && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Progress / Score (0-100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.learningProgress || formData.communication || formData.familyBond || formData.careerReadinessScore || ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      handleInputChange('learningProgress', v);
                      handleInputChange('communication', v);
                      handleInputChange('familyBond', v);
                      handleInputChange('careerReadinessScore', v);
                    }}
                    placeholder="e.g. 80"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Primary Attribute / Type</label>
                  <input
                    type="text"
                    value={formData.personalityType || formData.targetRole || formData.technicalSkills || ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      handleInputChange('personalityType', v);
                      handleInputChange('targetRole', v);
                      handleInputChange('technicalSkills', v);
                    }}
                    placeholder="e.g. Extrovert, Full Stack, High Bond"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Notes & Context (Optional)</label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add observation notes for this timestamped entry..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Timestamp will be automatically saved with this record.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <span>{isSubmitting ? 'Recording...' : 'Commit to Digital Twin'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
