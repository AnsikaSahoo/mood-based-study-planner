import React, { useState } from 'react';
import { moodAPI } from '../services/moodAPI';
import { Smile, Zap, Activity, Moon, CheckCircle2, AlertCircle } from 'lucide-react';

const MOOD_OPTIONS = [
  { label: 'Happy', emoji: '😊', bg: 'hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300' },
  { label: 'Focused', emoji: '🎯', bg: 'hover:bg-purple-500/20 border-purple-500/30 text-purple-300' },
  { label: 'Neutral', emoji: '😐', bg: 'hover:bg-blue-500/20 border-blue-500/30 text-blue-300' },
  { label: 'Tired', emoji: '😴', bg: 'hover:bg-amber-500/20 border-amber-500/30 text-amber-300' },
  { label: 'Stressed', emoji: '😰', bg: 'hover:bg-rose-500/20 border-rose-500/30 text-rose-300' },
  { label: 'Sleepy', emoji: '🥱', bg: 'hover:bg-indigo-500/20 border-indigo-500/30 text-indigo-300' },
];

export default function MoodSelector({ onMoodLogged }) {
  const [selectedMood, setSelectedMood] = useState('Focused');
  const [stressLevel, setStressLevel] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(8);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await moodAPI.logMood({
        mood: selectedMood,
        stressLevel: Number(stressLevel),
        energyLevel: Number(energyLevel),
        sleepHours: Number(sleepHours),
        notes,
      });

      setSuccessMsg('Mood logged successfully!');
      if (onMoodLogged) onMoodLogged(res.data || res);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to log mood.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="glass-card p-6 rounded-3xl border border-slate-800">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
          <Smile size={20} />
        </div>
        <div>
          <h3 class="font-display font-bold text-lg text-slate-100">Log Your Current Mood</h3>
          <p class="text-xs text-slate-400">How are you feeling right now?</p>
        </div>
      </div>

      {successMsg && (
        <div class="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div class="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} class="space-y-6">
        {/* Mood Selection Buttons */}
        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Select Mood State
          </label>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {MOOD_OPTIONS.map((item) => {
              const isSelected = selectedMood === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSelectedMood(item.label)}
                  class={`p-3 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-gradient-to-b from-purple-600/40 to-pink-600/30 border-purple-500 shadow-glow-purple scale-105'
                      : `bg-slate-900/60 border-slate-800 ${item.bg}`
                  }`}
                >
                  <span class="text-2xl">{item.emoji}</span>
                  <span class="text-xs font-semibold text-slate-200">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy & Stress Sliders */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap size={14} class="text-amber-400" />
                Energy Level
              </label>
              <span class="text-xs font-bold text-amber-400">{energyLevel} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(e.target.value)}
              class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Activity size={14} class="text-rose-400" />
                Stress Level
              </label>
              <span class="text-xs font-bold text-rose-400">{stressLevel} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(e.target.value)}
              class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Moon size={14} class="text-indigo-400" />
                Sleep Hours
              </label>
              <span class="text-xs font-bold text-indigo-400">{sleepHours} hrs</span>
            </div>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              class="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:opacity-95 text-white font-bold text-sm shadow-glow-purple transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Saving Mood Log...' : 'Submit Mood Check-in'}
        </button>
      </form>
    </div>
  );
}
