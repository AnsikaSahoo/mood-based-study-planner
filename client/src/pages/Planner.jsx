import React, { useState, useEffect } from 'react';
import { plannerAPI } from '../services/plannerAPI';
import StudyPlan from '../components/StudyPlan';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles, Clock } from 'lucide-react';

export default function Planner() {
  const [availableHours, setAvailableHours] = useState(4);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await plannerAPI.getTodayPlan();
      setPlan(res.data !== undefined ? res.data : res);
    } catch (err) {
      console.error('Failed to fetch plan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    setGenerating(true);
    try {
      const res = await plannerAPI.generatePlan({ availableStudyHours: Number(availableHours) });
      setPlan(res.data !== undefined ? res.data : res);
    } catch (err) {
      alert('Failed to generate plan: ' + (err.message || 'Error occurred'));
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (window.confirm('Reset and generate a fresh study plan?')) {
      try {
        await plannerAPI.regeneratePlan();
        handleGenerate();
      } catch (err) {
        alert('Failed to reset plan: ' + (err.message || 'Error occurred'));
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">Dynamic Study Planner</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Our algorithm balances task priorities and difficulty against your current mood & available hours.
        </p>
      </div>

      {/* Available Hours Form Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-purple-500/20 bg-slate-900/80">
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row items-end gap-6">
          <div className="flex-1 space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Available Study Hours Today
            </label>
            <div className="relative flex items-center">
              <Clock size={18} className="absolute left-3.5 text-slate-500 pointer-events-none" />
              <input
                type="number"
                min="1"
                max="14"
                value={availableHours}
                onChange={(e) => setAvailableHours(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={generating}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:opacity-95 text-white font-bold text-sm shadow-glow-purple transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            <Sparkles size={18} className="text-pink-300" />
            {generating ? 'Generating Schedule...' : 'Generate My Study Plan'}
          </button>
        </form>
      </div>

      {/* Today's Study Plan Output */}
      {loading ? (
        <LoadingSpinner message="Checking today's study plan..." />
      ) : (
        <StudyPlan plan={plan} onRegenerate={handleRegenerate} loading={generating} />
      )}
    </div>
  );
}
