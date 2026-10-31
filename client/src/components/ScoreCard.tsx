import React from 'react';
import { DimensionScore } from '../types';
import { ArrowUpRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ScoreCardProps {
  title: string;
  dimensionKey: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  data: DimensionScore;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  dimensionKey,
  icon: Icon,
  color,
  data,
}) => {
  const hasScore = data.score !== null && data.score !== undefined;
  const scoreValue = hasScore ? data.score : '--';

  const getStatusBadge = () => {
    if (data.status === 'complete') {
      return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">Complete</span>;
    }
    if (data.status === 'partial') {
      return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800/60">Partial</span>;
    }
    return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">Incomplete</span>;
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between relative group">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-slate-800/80 border border-slate-700/60 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-200">{title}</h3>
              {getStatusBadge()}
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold tracking-tight text-white">{scoreValue}</span>
            {hasScore && <span className="text-xs text-slate-400">/100</span>}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              hasScore && data.score! >= 75
                ? 'bg-cyan-400'
                : hasScore && data.score! >= 50
                ? 'bg-blue-400'
                : hasScore
                ? 'bg-amber-400'
                : 'bg-slate-700'
            }`}
            style={{ width: `${hasScore ? data.score : 0}%` }}
          />
        </div>

        {/* Calculation basis */}
        <div className="flex items-start gap-1.5 text-[11px] text-slate-400 line-clamp-2 min-h-[32px]">
          <Info className="w-3.5 h-3.5 shrink-0 text-slate-500 mt-0.5" />
          <span>{data.calculationBasis}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-medium">
          {data.metricsEvaluated.length > 0 ? `${data.metricsEvaluated.length} metrics` : 'Awaiting data'}
        </span>

        <Link
          to={`/modules/${dimensionKey}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>View & Log</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
