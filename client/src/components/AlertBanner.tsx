import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AlertBannerProps {
  alerts: Array<{
    type: 'info' | 'warning' | 'success';
    dimension: string;
    message: string;
  }>;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {alerts.map((alert, idx) => {
        const isWarning = alert.type === 'warning';
        const isSuccess = alert.type === 'success';

        return (
          <div
            key={idx}
            className={`px-4 py-3 rounded-xl border flex items-center justify-between text-xs font-medium transition-all ${
              isWarning
                ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                : isSuccess
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-cyan-950/40 border-cyan-800/60 text-cyan-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isWarning ? (
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-cyan-400" />
              )}
              <span>
                <strong className="font-semibold uppercase tracking-wider text-[10px] mr-1 px-1.5 py-0.5 rounded bg-slate-900/60">
                  {alert.dimension}
                </strong>
                {alert.message}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
