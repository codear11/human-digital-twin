import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { LineChart as LineChartIcon, Activity, Moon, Heart, Sparkles } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrends = async (r: '7d' | '30d' | '90d') => {
    setIsLoading(true);
    try {
      const data = await api.dashboard.getTrends(r);
      setTrends(data.timeSeries || []);
    } catch (err) {
      console.error('Failed to load analytics trends:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends(range);
  }, [range]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Range Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <LineChartIcon className="w-6 h-6 text-cyan-400" />
            <span>Digital Twin Analytics & Multi-Day Trends</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Time-series correlation modeling across physical vitals, movement, sleep, and psychological resilience.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                range === r
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Aggregating Time-Series Biometrics..." />
      ) : (
        <div className="space-y-6">
          {/* Chart 1: Daily Movement & Steps */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-sm text-white">Daily Steps Trajectory</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">10,000 Step Goal</span>
            </div>

            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="display" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                  />
                  <Bar dataKey="steps" fill="#f97316" radius={[4, 4, 0, 0]} name="Steps Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Sleep Duration vs Stress Inverse Correlation */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Sleep vs. Perceived Stress Correlation</h3>
              </div>
              <span className="text-xs text-slate-400">Inverse Pattern Analysis</span>
            </div>

            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="display" stroke="#64748b" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#818cf8" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" stroke="#c084fc" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="sleepHours" stroke="#818cf8" strokeWidth={2.5} name="Sleep (Hours)" />
                  <Line yAxisId="right" type="monotone" dataKey="stress" stroke="#c084fc" strokeWidth={2.5} strokeDasharray="5 5" name="Stress Level (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Vitals & Happiness */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-sm text-white">Heart Rate & Mood Progression</h3>
              </div>
              <span className="text-xs text-slate-400">Basal Equilibrium</span>
            </div>

            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="display" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="heartRate" stroke="#fb7185" strokeWidth={2} name="Resting HR (bpm)" />
                  <Line type="monotone" dataKey="happiness" stroke="#fbbf24" strokeWidth={2} name="Happiness (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
