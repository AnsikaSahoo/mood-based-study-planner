import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Coffee, BookOpen, Sparkles, Plus } from 'lucide-react';
import { extractStudyPlan } from '../utils/extractStudyPlan';

export default function StudyPlan({ plan: rawPlan, onRegenerate, loading }) {
  if (loading) {
    return (
      <div className="glass-card p-8 rounded-3xl border border-slate-800 text-center">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm animate-pulse">Generating optimal study schedule based on your mood...</p>
      </div>
    );
  }

  const parsedPlan = extractStudyPlan(rawPlan);

  if (!parsedPlan || !parsedPlan.schedule || parsedPlan.schedule.length === 0) {
    return (
      <div className="glass-card p-8 rounded-3xl border border-slate-800 text-center">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto mb-3 text-2xl">
          📅
        </div>
        <h4 className="font-display font-bold text-slate-200">No Study Plan Active</h4>
        <p className="text-xs text-slate-400 mt-1 mb-6 max-w-sm mx-auto">
          Create study tasks and specify your available hours to generate a personalized timetable.
        </p>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-glow-purple transition-all"
        >
          <Plus size={16} />
          Create Tasks First
        </Link>
      </div>
    );
  }

  const { schedule, summary } = parsedPlan;

  return (
    <div className="glass-card p-6 rounded-3xl border border-purple-500/20 bg-slate-900/60 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-1">
            <Sparkles size={13} className="text-pink-400" />
            AI Optimized Timetable
          </div>
          <h3 className="font-display font-bold text-xl text-slate-100">Today's Personalized Study Plan</h3>
        </div>

        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            🔄 Reset & Regenerate
          </button>
        )}
      </div>

      {summary && (
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 leading-relaxed">
          💡 <strong>Plan Strategy:</strong> {summary}
        </div>
      )}

      {/* Timeline List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {schedule.map((item, index) => {
          const isBreak = item.type === 'Break';

          return (
            <div key={index} className="relative flex items-start gap-4 group">
              {/* Timeline Dot */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                  isBreak
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                }`}
              >
                {isBreak ? <Coffee size={10} /> : <BookOpen size={10} />}
              </div>

              {/* Slot Box */}
              <div
                className={`flex-1 p-4 rounded-2xl border transition-all ${
                  isBreak
                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                    : 'bg-slate-900/90 border-slate-800 hover:border-purple-500/40'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg">
                      {item.timeSlot}
                    </span>
                    <h5
                      className={`font-display font-semibold text-sm ${
                        isBreak ? 'text-amber-300 italic' : 'text-slate-100'
                      }`}
                    >
                      {item.taskTitle}
                    </h5>
                  </div>

                  <span className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                    <Clock size={13} />
                    {item.durationMinutes} mins
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
