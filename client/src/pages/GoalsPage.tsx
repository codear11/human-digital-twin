import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Goal } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { Target, Plus, CheckCircle2, Clock, Trash2 } from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [progressVal, setProgressVal] = useState<number>(0);

  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'Health',
    targetValue: 10,
    currentValue: 0,
    unit: 'kg',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
  });

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const data = await api.goals.list();
      setGoals(data);
    } catch (err) {
      console.error('Failed to load goals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.goals.create(newGoal);
      setIsCreateOpen(false);
      setNewGoal({ title: '', category: 'Health', targetValue: 10, currentValue: 0, unit: 'kg', priority: 'MEDIUM' });
      fetchGoals();
    } catch (err) {
      console.error('Failed to create goal:', err);
    }
  };

  const handleUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;

    try {
      await api.goals.updateProgress(selectedGoal.id, progressVal);
      setIsUpdateOpen(false);
      setSelectedGoal(null);
      fetchGoals();
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.goals.delete(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Target className="w-6 h-6 text-cyan-400" />
            <span>Target Objectives & Milestone Tracking</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Quantified milestone tracking linked to your digital replica dimensions.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Set Objective</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Evaluating Goal Trajectories..." />
      ) : goals.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">No Active Targets Set</h3>
          <p className="text-xs text-slate-400">
            Establish tangible milestones (e.g. Run 100km, Save $5,000, Complete 3 Certifications) to guide your digital replica.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-colors"
          >
            Create Your First Objective
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const isCompleted = goal.status === 'COMPLETED' || goal.currentValue >= goal.targetValue;
            const pct = goal.targetValue > 0 ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) : 0;

            return (
              <div key={goal.id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {goal.category}
                    </span>

                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Remove objective"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-bold text-base text-white mb-1">{goal.title}</h3>

                  <div className="mt-4 flex items-baseline justify-between text-xs">
                    <span className="text-slate-400">
                      Current: <strong className="text-white">{goal.currentValue}</strong> {goal.unit}
                    </span>
                    <span className="text-slate-400">
                      Target: <strong className="text-cyan-400">{goal.targetValue}</strong> {goal.unit}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 my-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isCompleted ? 'bg-emerald-400' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{pct}% Complete</span>

                  <button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setProgressVal(goal.currentValue);
                      setIsUpdateOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                  >
                    Update Progress
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Set Milestone Target"
        subtitle="Establish quantifiable goals for your twin"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Goal Title</label>
            <input
              type="text"
              required
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="e.g. Save $10,000 in Emergency Reserve"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Dimension Category</label>
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              >
                <option value="Health">Physical Health</option>
                <option value="Fitness">Fitness & Activity</option>
                <option value="Financial">Financial Health</option>
                <option value="Career">Career & Skills</option>
                <option value="Mental">Mental Wellness</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Unit</label>
              <input
                type="text"
                required
                value={newGoal.unit}
                onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                placeholder="e.g. $, km, books, hrs"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target Value</label>
              <input
                type="number"
                required
                value={newGoal.targetValue}
                onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Current Value</label>
              <input
                type="number"
                value={newGoal.currentValue}
                onChange={(e) => setNewGoal({ ...newGoal, currentValue: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white"
            >
              Create Target
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Progress Modal */}
      <Modal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        title="Update Objective Progress"
        subtitle={`Adjust logged quantity for ${selectedGoal?.title}`}
      >
        <form onSubmit={handleUpdateProgress} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              New Current Value ({selectedGoal?.unit})
            </label>
            <input
              type="number"
              required
              value={progressVal}
              onChange={(e) => setProgressVal(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUpdateOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white"
            >
              Save Progress
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
