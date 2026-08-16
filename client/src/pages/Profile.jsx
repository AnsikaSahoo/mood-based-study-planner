import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Target, Clock, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [studyGoal, setStudyGoal] = useState(user?.studyGoal || '');
  const [preferredStudyHours, setPreferredStudyHours] = useState(
    user?.preferredStudyHours || 4
  );

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateProfile({
        name,
        studyGoal,
        preferredStudyHours: Number(preferredStudyHours),
      });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="space-y-8 max-w-3xl">
      <div>
        <h1 class="font-display font-bold text-2xl sm:text-3xl text-slate-100">Student Profile & Settings</h1>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal account details, study targets, and daily hour preferences.
        </p>
      </div>

      <div class="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        {/* Avatar header */}
        <div class="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 text-white font-bold text-2xl flex items-center justify-center shadow-glow-purple">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 class="font-display font-bold text-xl text-slate-100">{name || 'User Profile'}</h3>
            <p class="text-xs text-slate-400">{email}</p>
          </div>
        </div>

        {successMsg && (
          <div class="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div class="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div class="relative flex items-center">
              <User size={18} class="absolute left-3.5 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                class="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address (Read-only)
            </label>
            <div class="relative flex items-center">
              <Mail size={18} class="absolute left-3.5 text-slate-500 pointer-events-none" />
              <input
                type="email"
                value={email}
                disabled
                class="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800/60 rounded-xl text-slate-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Study Goal
            </label>
            <div class="relative flex items-center">
              <Target size={18} class="absolute left-3.5 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={studyGoal}
                onChange={(e) => setStudyGoal(e.target.value)}
                placeholder="e.g. Master Calculus & Computer Science"
                class="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Preferred Study Hours / Day
            </label>
            <div class="relative flex items-center">
              <Clock size={18} class="absolute left-3.5 text-slate-500 pointer-events-none" />
              <input
                type="number"
                min="1"
                max="14"
                value={preferredStudyHours}
                onChange={(e) => setPreferredStudyHours(e.target.value)}
                class="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            class="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:opacity-95 text-white font-bold text-sm shadow-glow-purple transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
