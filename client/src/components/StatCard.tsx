import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'text-cyan-400',
}) => {
  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-slate-400 mb-1">{title}</p>
        <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
        {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className={`w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center ${accentColor}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
