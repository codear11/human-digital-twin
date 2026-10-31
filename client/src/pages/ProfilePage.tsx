import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Profile } from '../types';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  User as UserIcon,
  Save,
  CheckCircle2,
  AlertCircle,
  Activity,
  Heart,
  ShieldAlert,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<Partial<Profile & { name: string }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.profile.get();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (field: string, val: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: val === '' ? null : val,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(null);
    setError(null);

    try {
      await api.profile.update(profile);
      await refreshUser();
      setSuccess('Personal biometric profile successfully saved!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  // Compute live BMI
  const height = profile.height ? Number(profile.height) : null;
  const weight = profile.weight ? Number(profile.weight) : null;
  let calculatedBmi: number | null = null;
  let bmiCategory = '';

  if (height && weight && height > 50) {
    const hM = height / 100;
    calculatedBmi = parseFloat((weight / (hM * hM)).toFixed(1));
    if (calculatedBmi < 18.5) bmiCategory = 'Underweight';
    else if (calculatedBmi <= 24.9) bmiCategory = 'Normal Healthy Weight';
    else if (calculatedBmi <= 29.9) bmiCategory = 'Overweight';
    else bmiCategory = 'Obesity Range';
  }

  if (isLoading) {
    return <LoadingSpinner message="Accessing Personal Biometric Vault..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <UserIcon className="w-6 h-6 text-cyan-400" />
          <span>Personal Information & Biometric Profile</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Foundational parameters that calibrate your digital replica across all calculations.
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Biometric Status Card */}
      {calculatedBmi && (
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Calculated Body Mass Index (BMI)</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{calculatedBmi}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {bmiCategory}
                </span>
              </div>
            </div>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline font-mono">Height: {height}cm • Weight: {weight}kg</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profile.name || user?.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Age</label>
              <input
                type="number"
                min="1"
                max="130"
                value={profile.age ?? ''}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="e.g. 25"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Gender</label>
              <select
                value={profile.gender || ''}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Blood Group</label>
              <input
                type="text"
                value={profile.bloodGroup || ''}
                onChange={(e) => handleChange('bloodGroup', e.target.value)}
                placeholder="e.g. O+, A-, B+"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Height (cm)</label>
              <input
                type="number"
                step="0.1"
                value={profile.height ?? ''}
                onChange={(e) => handleChange('height', e.target.value)}
                placeholder="e.g. 175"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={profile.weight ?? ''}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="e.g. 70"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Occupation</label>
              <input
                type="text"
                value={profile.occupation || ''}
                onChange={(e) => handleChange('occupation', e.target.value)}
                placeholder="e.g. Software Engineer / Student"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Education Background</label>
              <input
                type="text"
                value={profile.education || ''}
                onChange={(e) => handleChange('education', e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Emergency Contact Information</label>
              <input
                type="text"
                value={profile.emergencyContact || ''}
                onChange={(e) => handleChange('emergencyContact', e.target.value)}
                placeholder="e.g. +1 555-019-2834 (Family / Physician)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Personal Twin Bio & Goals</label>
              <textarea
                rows={3}
                value={profile.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Add context about your daily life, routine, and replica calibration preferences..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Updating...' : 'Save Biometric Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
