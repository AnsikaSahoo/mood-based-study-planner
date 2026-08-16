import React from 'react';
import { Bell, Check, Trash2, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { formatDateTime } from '../utils/formatDate';

export default function NotificationPanel({ notifications, onMarkRead, onDelete }) {
  if (!notifications || notifications.length === 0) {
    return (
      <div class="glass-card p-8 rounded-3xl border border-slate-800 text-center">
        <div class="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto mb-3 text-2xl">
          🔔
        </div>
        <h4 class="font-display font-bold text-slate-200">No Notifications</h4>
        <p class="text-xs text-slate-400 mt-1">You're all caught up! Study reminders and deadline alerts will show here.</p>
      </div>
    );
  }

  return (
    <div class="space-y-3">
      {notifications.map((item) => (
        <div
          key={item._id}
          class={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
            item.isRead
              ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
              : 'glass-card border-purple-500/30 shadow-glow-purple/20'
          }`}
        >
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
              <Bell size={16} />
            </div>
            <div>
              <h5 class={`font-display font-semibold text-sm ${item.isRead ? 'text-slate-300' : 'text-slate-100'}`}>
                {item.title || 'Notification'}
              </h5>
              <p class="text-xs text-slate-400 mt-0.5">{item.message}</p>
              <span class="text-[10px] text-slate-500 mt-1 block">
                {formatDateTime(item.createdAt)}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            {!item.isRead && onMarkRead && (
              <button
                onClick={() => onMarkRead(item._id)}
                class="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs transition-colors"
                title="Mark as Read"
              >
                <Check size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item._id)}
                class="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete Notification"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
