import React from 'react';
import { Cpu } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = 'Synchronizing Digital Twin State...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 animate-pulse flex items-center justify-center glow-cyan">
          <Cpu className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/40 animate-ping" />
      </div>
      <p className="text-sm font-semibold text-slate-300 tracking-wide">{message}</p>
      <span className="text-xs text-slate-500 font-mono">Running local heuristic & biometric algorithms</span>
    </div>
  );
};
