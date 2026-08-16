import React from 'react';
import { Smile, Zap, Activity, Moon } from 'lucide-react';

const MOOD_EMOJIS = {
  Happy: '😊',
  Focused: '🎯',
  Neutral: '😐',
  Tired: '😴',
  Stressed: '😰',
  Sleepy: '🥱',
};

export default function MoodCard({ mood }) {
  const actualMood = mood?.mood && typeof mood.mood === 'object' ? mood.mood : mood;

  if (!actualMood || !actualMood.mood) {
    return (
      <div className="glass-card p-6 rounded-3xl border border-slate-800 text-center">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto mb-3 text-2xl">
          ❓
        </div>
        <h4 className="font-display font-bold text-slate-200">No Mood Logged Today</h4>
        <p className="text-xs text-slate-400 mt-1 mb-4">Log your mood to personalize your daily study plan.</p>
      </div>
    );
  }

  const moodName = typeof actualMood.mood === 'string' ? actualMood.mood : 'Focused';
  const emoji = MOOD_EMOJIS[moodName] || '🎯';

  return (
    <div className="glass-card p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 via-slate-900/80 to-blue-900/20 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 flex items-center justify-center text-3xl shadow-glow-purple">
            {emoji}
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-full">
              Today's Mood
            </span>
            <h3 className="font-display font-bold text-xl text-slate-100 mt-1">{moodName}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-semibold mb-1">
            <Zap size={13} />
            Energy
          </div>
          <span className="font-display font-bold text-lg text-slate-100">{actualMood.energyLevel ?? 5}/10</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1 text-rose-400 text-xs font-semibold mb-1">
            <Activity size={13} />
            Stress
          </div>
          <span className="font-display font-bold text-lg text-slate-100">{actualMood.stressLevel ?? 5}/10</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1 text-indigo-400 text-xs font-semibold mb-1">
            <Moon size={13} />
            Sleep
          </div>
          <span className="font-display font-bold text-lg text-slate-100">{actualMood.sleepHours ?? 8} hrs</span>
        </div>
      </div>
    </div>
  );
}
