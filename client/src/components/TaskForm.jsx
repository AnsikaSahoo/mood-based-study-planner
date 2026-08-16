import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export default function TaskForm({ isOpen, onClose, onSubmit, initialTask = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(60);
  const [priority, setPriority] = useState('High');
  const [difficulty, setDifficulty] = useState('Medium');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setSubject(initialTask.subject || '');
      setEstimatedTime(initialTask.estimatedTime || 60);
      setPriority(initialTask.priority || 'High');
      setDifficulty(initialTask.difficulty || 'Medium');
      setDeadline(
        initialTask.deadline
          ? new Date(initialTask.deadline).toISOString().split('T')[0]
          : ''
      );
    } else {
      setTitle('');
      setDescription('');
      setSubject('Mathematics');
      setEstimatedTime(60);
      setPriority('High');
      setDifficulty('Medium');
      setDeadline('');
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      subject,
      estimatedTime: Number(estimatedTime),
      priority,
      difficulty,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    });
  };

  return (
    <div class="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="glass-card w-full max-w-lg rounded-3xl border border-slate-800 p-6 relative shadow-2xl animate-fadeIn">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 class="font-display font-bold text-lg text-slate-100">
            {initialTask ? 'Edit Task' : 'Create New Study Task'}
          </h3>
          <button
            onClick={onClose}
            class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} class="space-y-4 pt-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Calculus Chapter 4 Exercises"
              required
              class="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key objectives or reference links..."
              rows={2}
              class="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Mathematics, Physics, CS..."
                required
                class="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Estimated Time (Minutes) *
              </label>
              <input
                type="number"
                min="5"
                max="360"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                required
                class="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                class="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                class="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                class="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div class="flex items-center gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              class="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:opacity-95 text-white font-bold text-xs shadow-glow-purple transition-all flex items-center justify-center gap-1.5"
            >
              <Check size={16} />
              {initialTask ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
