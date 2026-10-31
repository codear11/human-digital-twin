import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Habit } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import {
  CheckSquare,
  Plus,
  Flame,
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
} from 'lucide-react';

export const HabitsPage: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'Productivity',
    targetFrequency: 'daily',
    targetTime: 'Morning',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchHabits = async () => {
    setIsLoading(true);
    try {
      const data = await api.habits.list();
      setHabits(data);
    } catch (err) {
      console.error('Failed to load habits:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleToggle = async (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const newStatus = !habit.completedToday;

    // Optimistic UI update
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habit.id
          ? {
              ...h,
              completedToday: newStatus,
              currentStreak: newStatus ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1),
            }
          : h
      )
    );

    try {
      await api.habits.toggle(habit.id, today, newStatus);
    } catch (err) {
      console.error('Failed to toggle habit:', err);
      fetchHabits();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.name.trim()) return;

    setIsSubmitting(true);
    try {
      await api.habits.create(newHabit);
      setIsModalOpen(false);
      setNewHabit({ name: '', category: 'Productivity', targetFrequency: 'daily', targetTime: 'Morning' });
      fetchHabits();
    } catch (err) {
      console.error('Failed to create habit:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.habits.delete(id);
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error('Failed to remove habit:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            <span>Daily Habit System & Streak Architecture</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build autonomic neural patterns. Check off today&apos;s habits to reinforce digital twin consistency.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit Tracker</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Checking Habit Consistency Chains..." />
      ) : habits.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">No Active Habits Found</h3>
          <p className="text-xs text-slate-400">
            Define daily foundational habits (e.g. 2L Water, 20m Reading, Morning Meditation) to build momentum.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
          >
            Create Your First Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`glass-panel p-5 rounded-2xl flex flex-col justify-between transition-all ${
                habit.completedToday ? 'border-emerald-500/40 bg-emerald-950/20' : 'hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {habit.category}
                  </span>

                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="Remove habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-bold text-base text-white mb-1">{habit.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{habit.targetTime || 'Anytime'} • {habit.targetFrequency}</span>
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>{habit.currentStreak} day streak</span>
                </div>

                <button
                  onClick={() => handleToggle(habit)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    habit.completedToday
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {habit.completedToday ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-slate-400" />
                      <span>Mark Done</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Habit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Establish New Habit Tracker"
        subtitle="Configure daily behavioral consistency parameters"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Habit Name</label>
            <input
              type="text"
              required
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              placeholder="e.g. 20 Minutes Deep Reading"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
              <select
                value={newHabit.category}
                onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              >
                <option value="Health">Physical Health</option>
                <option value="Fitness">Fitness & Activity</option>
                <option value="Mindfulness">Mindfulness</option>
                <option value="Productivity">Productivity</option>
                <option value="Learning">Learning & Skills</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target Window</label>
              <select
                value={newHabit.targetTime}
                onChange={(e) => setNewHabit({ ...newHabit, targetTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Anytime">Anytime</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Add Habit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
