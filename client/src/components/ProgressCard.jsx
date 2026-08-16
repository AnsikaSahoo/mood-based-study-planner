import React from 'react';
import { CheckCircle2, Clock, Zap, Flame } from 'lucide-react';

export default function ProgressCard({ analytics }) {
  const completedTasks = analytics?.completedTasks ?? 0;
  const studyHours = analytics?.totalStudyHours ?? 0;
  const focusScore = analytics?.avgFocusScore ?? 8.5;
  const streak = analytics?.currentStreak ?? 1;

  return (
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {/* Completed Tasks */}
      <div class="glass-card p-4 rounded-3xl border border-slate-800 flex items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Completed</span>
          <span class="font-display font-bold text-xl text-slate-100">{completedTasks} Tasks</span>
        </div>
      </div>

      {/* Study Hours */}
      <div class="glass-card p-4 rounded-3xl border border-slate-800 flex items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
          <Clock size={20} />
        </div>
        <div>
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Study Hours</span>
          <span class="font-display font-bold text-xl text-slate-100">{studyHours} hrs</span>
        </div>
      </div>

      {/* Focus Score */}
      <div class="glass-card p-4 rounded-3xl border border-slate-800 flex items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
          <Zap size={20} />
        </div>
        <div>
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Focus Score</span>
          <span class="font-display font-bold text-xl text-slate-100">{focusScore} / 10</span>
        </div>
      </div>

      {/* Current Streak */}
      <div class="glass-card p-4 rounded-3xl border border-slate-800 flex items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0">
          <Flame size={20} />
        </div>
        <div>
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Study Streak</span>
          <span class="font-display font-bold text-xl text-slate-100">{streak} Days</span>
        </div>
      </div>
    </div>
  );
}
