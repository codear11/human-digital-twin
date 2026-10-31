import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

interface ScoreGaugeProps {
  score: number | null;
  completeness: number;
  dataSufficient: boolean;
  limitations: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  completeness,
  dataSufficient,
  limitations,
}) => {
  const displayScore = score !== null ? score : '--';
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = score !== null ? circumference - (score / 100) * circumference : circumference;

  const getScoreColor = (s: number | null) => {
    if (s === null) return 'text-slate-500 stroke-slate-700';
    if (s >= 80) return 'text-cyan-400 stroke-cyan-400';
    if (s >= 65) return 'text-blue-400 stroke-blue-400';
    if (s >= 50) return 'text-amber-400 stroke-amber-400';
    return 'text-rose-400 stroke-rose-400';
  };

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Background glowing aura */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-6">
        {/* Circular Gauge */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Value circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold tracking-tight text-white">{displayScore}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Twin Score</span>
          </div>
        </div>

        {/* Narrative & Completeness */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="w-3 h-3" />
              Composite Replica State
            </span>
            <span className="text-xs text-slate-400">
              Coverage: <strong className="text-white">{completeness}%</strong>
            </span>
          </div>

          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
            {dataSufficient ? 'Synthesized Digital Twin' : 'Calibrating Digital Replica'}
          </h2>

          <p className="text-xs text-slate-300 max-w-md leading-relaxed">
            {limitations}
          </p>
        </div>
      </div>

      {/* Transparent Calculation Footnote */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 max-w-xs text-xs text-slate-400 space-y-1.5 self-stretch flex flex-col justify-center">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Transparent Scoring Policy</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Scores are mathematically calculated from validated inputs. Missing categories remain &quot;incomplete&quot; rather than scored as zero or perfect.
        </p>
      </div>
    </div>
  );
};
