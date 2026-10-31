import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DashboardOverview } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { ScoreCard } from '../components/ScoreCard';
import { StatCard } from '../components/StatCard';
import { AlertBanner } from '../components/AlertBanner';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Heart,
  Activity,
  Moon,
  Utensils,
  Brain,
  Smile,
  Compass,
  Users,
  GraduationCap,
  Briefcase,
  Wallet,
  CheckCircle,
  Footprints,
  Clock,
  Sparkles,
  RefreshCw,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const res = await api.dashboard.getOverview();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to synchronize twin dashboard.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Calibrating Multi-Dimensional Replica..." />;
  }

  if (error || !data) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center max-w-lg mx-auto space-y-4">
        <p className="text-sm text-rose-400 font-semibold">{error || 'Unable to load twin state'}</p>
        <button
          onClick={() => fetchOverview()}
          className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Dimension cards configuration
  const dimensionConfigs = [
    { key: 'health', title: 'Physical Health', icon: Heart, color: 'text-rose-400', data: data.dimensionScores.health },
    { key: 'fitness', title: 'Fitness & Lifestyle', icon: Activity, color: 'text-orange-400', data: data.dimensionScores.fitness },
    { key: 'sleep', title: 'Sleep Tracking', icon: Moon, color: 'text-indigo-400', data: data.dimensionScores.sleep },
    { key: 'nutrition', title: 'Nutrition', icon: Utensils, color: 'text-emerald-400', data: data.dimensionScores.nutrition },
    { key: 'mental', title: 'Mental Health', icon: Brain, color: 'text-purple-400', data: data.dimensionScores.mental },
    { key: 'emotional', title: 'Emotional Health', icon: Smile, color: 'text-amber-400', data: data.dimensionScores.emotional },
    { key: 'personality', title: 'Personality Profile', icon: Compass, color: 'text-cyan-400', data: data.dimensionScores.personality },
    { key: 'social', title: 'Social Relationships', icon: Users, color: 'text-sky-400', data: data.dimensionScores.social },
    { key: 'learning', title: 'Education & Skills', icon: GraduationCap, color: 'text-blue-400', data: data.dimensionScores.learning },
    { key: 'career', title: 'Career Readiness', icon: Briefcase, color: 'text-violet-400', data: data.dimensionScores.career },
    { key: 'financial', title: 'Financial Health', icon: Wallet, color: 'text-teal-400', data: data.dimensionScores.financial },
  ];

  // Radar chart dataset
  const radarData = dimensionConfigs.map((c) => ({
    dimension: c.title.replace(' & Skills', '').replace(' Tracking', '').replace(' Relationships', '').replace(' Profile', ''),
    score: c.data.score || 0,
    fullMark: 100,
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {data.user.name}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time digital twin replica state synchronized across 11 human life dimensions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchOverview(true)}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-cyan-500/50 text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Sync</span>
          </button>

          <Link
            to="/ai-reports"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Report</span>
          </Link>
        </div>
      </div>

      {/* Dynamic Alerts */}
      <AlertBanner alerts={data.alerts} />

      {/* Holistic Twin Gauge Card */}
      <ScoreGauge
        score={data.twinScore}
        completeness={data.completenessPercentage}
        dataSufficient={data.dataSufficient}
        limitations={data.limitations}
      />

      {/* Quick KPI Stat Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Resting HR"
          value={data.quickStats.restingHeartRate ? `${data.quickStats.restingHeartRate} bpm` : '--'}
          subtitle="Vitals"
          icon={Heart}
          accentColor="text-rose-400"
        />
        <StatCard
          title="Daily Steps"
          value={data.quickStats.steps ? data.quickStats.steps.toLocaleString() : '--'}
          subtitle="Benchmark 10,000"
          icon={Footprints}
          accentColor="text-orange-400"
        />
        <StatCard
          title="Sleep Logged"
          value={data.quickStats.sleepHours ? `${data.quickStats.sleepHours} hrs` : '--'}
          subtitle="Rest & Recovery"
          icon={Moon}
          accentColor="text-indigo-400"
        />
        <StatCard
          title="Stress Index"
          value={data.quickStats.stress !== null ? `${data.quickStats.stress}%` : '--'}
          subtitle="Self-Reported"
          icon={Brain}
          accentColor="text-purple-400"
        />
        <StatCard
          title="Savings Rate"
          value={data.quickStats.savingsRate !== null ? `${data.quickStats.savingsRate}%` : '--'}
          subtitle="Target >= 20%"
          icon={Wallet}
          accentColor="text-teal-400"
        />
        <StatCard
          title="Habits Today"
          value={`${data.quickStats.completedHabitsToday}/${data.quickStats.activeHabitsCount}`}
          subtitle="Daily Streaks"
          icon={CheckCircle}
          accentColor="text-emerald-400"
        />
      </div>

      {/* Visual Analytics Radar & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                11-Dimension Equilibrium Radar
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Holistic balance representation across all life domains</p>
            </div>
            <Link to="/analytics" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
              Deep Analytics →
            </Link>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Radar name="Dimension Score" dataKey="score" stroke="#0e8ce8" fill="#0e8ce8" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Recent Twin Activity
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Real-Time</span>
            </div>

            <div className="space-y-3">
              {data.recentActivity.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500">
                  No activity recorded today. Select a dimension below to log new vitals.
                </div>
              ) : (
                data.recentActivity.map((act, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-cyan-400">{act.type}</span>
                      <span className="text-[10px] text-slate-500">{new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{act.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60 mt-4">
            <Link
              to="/profile"
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-800"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Update Biometrics & Info</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 11 Dimension Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">The 11 Twin Dimensions</h2>
            <p className="text-xs text-slate-400">Click &quot;View &amp; Log&quot; on any card to update records and see historical charts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dimensionConfigs.map((cfg) => (
            <ScoreCard
              key={cfg.key}
              title={cfg.title}
              dimensionKey={cfg.key}
              icon={cfg.icon}
              color={cfg.color}
              data={cfg.data}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
