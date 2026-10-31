import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  CheckSquare,
  Target,
  Sparkles,
  User,
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
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const mainNav = [
    { name: 'Unified Twin Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Analytics & Trends', to: '/analytics', icon: LineChart },
    { name: 'Daily Habits', to: '/habits', icon: CheckSquare },
    { name: 'Goals & Targets', to: '/goals', icon: Target },
    { name: 'AI Reports & Insights', to: '/ai-reports', icon: Sparkles },
    { name: 'Personal Profile', to: '/profile', icon: User },
  ];

  const dimensions = [
    { name: 'Physical Health', to: '/modules/health', icon: Heart, color: 'text-rose-400' },
    { name: 'Fitness & Lifestyle', to: '/modules/fitness', icon: Activity, color: 'text-orange-400' },
    { name: 'Sleep Tracking', to: '/modules/sleep', icon: Moon, color: 'text-indigo-400' },
    { name: 'Nutrition', to: '/modules/nutrition', icon: Utensils, color: 'text-emerald-400' },
    { name: 'Mental Health', to: '/modules/mental', icon: Brain, color: 'text-purple-400' },
    { name: 'Emotional Health', to: '/modules/emotional', icon: Smile, color: 'text-amber-400' },
    { name: 'Personality', to: '/modules/personality', icon: Compass, color: 'text-cyan-400' },
    { name: 'Social Relationships', to: '/modules/social', icon: Users, color: 'text-sky-400' },
    { name: 'Education & Skills', to: '/modules/education', icon: GraduationCap, color: 'text-blue-400' },
    { name: 'Career Readiness', to: '/modules/career', icon: Briefcase, color: 'text-violet-400' },
    { name: 'Financial Health', to: '/modules/financial', icon: Wallet, color: 'text-teal-400' },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-slate-800/80 bg-slate-950/80 p-4 space-y-6 min-h-[calc(100vh-65px)]">
      <div>
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Platform Core</p>
        <nav className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div>
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">11 Twin Dimensions</p>
        <nav className="space-y-0.5 overflow-y-auto max-h-[460px] pr-1">
          {dimensions.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`
                }
              >
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
