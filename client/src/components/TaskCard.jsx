import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, Circle, Edit3, Trash2, Calendar } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

const PRIORITY_BADGES = {
  High: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
  Medium: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  Low: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
};

const DIFFICULTY_BADGES = {
  Hard: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  Medium: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  Easy: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
};

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete, onStartSession }) {
  if (!task) return null;

  return (
    <div
      class={`p-5 rounded-3xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
          : 'glass-card border-slate-800 hover:border-purple-500/30'
      }`}
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-start gap-3.5">
          <button
            type="button"
            onClick={() => onToggleComplete && onToggleComplete(task)}
            class="mt-1 text-slate-500 hover:text-purple-400 transition-colors"
          >
            {task.completed ? (
              <CheckCircle2 size={22} class="text-emerald-400 fill-emerald-400/20" />
            ) : (
              <Circle size={22} />
            )}
          </button>
          <div>
            <h4
              class={`font-display font-semibold text-base ${
                task.completed ? 'line-through text-slate-500' : 'text-slate-100'
              }`}
            >
              {task.title}
            </h4>
            {task.description && (
              <p class="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
        </div>

        {/* Edit / Delete actions */}
        <div class="flex items-center gap-1.5 shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Edit Task"
            >
              <Edit3 size={15} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task._id)}
              class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Task"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Meta tags & details */}
      <div class="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
        {task.subject && (
          <span class="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-medium">
            📚 {task.subject}
          </span>
        )}

        <span
          class={`px-2.5 py-1 rounded-full border font-semibold ${
            PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.Medium
          }`}
        >
          {task.priority || 'Medium'} Priority
        </span>

        <span
          class={`px-2.5 py-1 rounded-full border font-semibold ${
            DIFFICULTY_BADGES[task.difficulty] || DIFFICULTY_BADGES.Medium
          }`}
        >
          {task.difficulty || 'Medium'}
        </span>

        {task.estimatedTime && (
          <span class="flex items-center gap-1 text-slate-400 ml-auto">
            <Clock size={13} />
            {task.estimatedTime} mins
          </span>
        )}

        {task.deadline && (
          <span class="flex items-center gap-1 text-slate-400">
            <Calendar size={13} />
            {formatDate(task.deadline)}
          </span>
        )}
      </div>

      {/* Quick Start Session Button */}
      {onStartSession && !task.completed && (
        <button
          onClick={() => onStartSession(task._id)}
          class="mt-4 w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          ⏱️ Start Session for this Task
        </button>
      )}
    </div>
  );
}
