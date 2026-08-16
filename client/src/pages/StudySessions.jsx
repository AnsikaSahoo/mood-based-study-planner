import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sessionAPI } from '../services/sessionAPI';
import { taskAPI } from '../services/taskAPI';
import PomodoroTimer from '../components/PomodoroTimer';
import LoadingSpinner from '../components/LoadingSpinner';
import { Timer, CheckCircle2, Play, Square, History, BookOpen } from 'lucide-react';
import { formatDateTime } from '../utils/formatDate';

const extractTasksList = (res) => {
  if (!res) return [];
  const val = res.data !== undefined ? res.data : res;
  if (Array.isArray(val?.tasks)) return val.tasks;
  if (Array.isArray(val)) return val;
  return [];
};

const extractSessionsList = (res) => {
  if (!res) return [];
  const val = res.data !== undefined ? res.data : res;
  if (Array.isArray(val?.sessions)) return val.sessions;
  if (Array.isArray(val)) return val;
  return [];
};

export default function StudySessions() {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(location.state?.taskId || '');
  const [activeSession, setActiveSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, historyRes] = await Promise.allSettled([
        taskAPI.getTasks(),
        sessionAPI.getSessionHistory(),
      ]);

      if (tasksRes.status === 'fulfilled') {
        const taskList = extractTasksList(tasksRes.value);
        setTasks(taskList);
        if (taskList.length > 0 && !selectedTaskId) {
          setSelectedTaskId(taskList[0]._id);
        }
      }

      if (historyRes.status === 'fulfilled') {
        const sessionList = extractSessionsList(historyRes.value);
        setHistory(sessionList);
      }
    } catch (err) {
      console.error('Failed to load sessions data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartSession = async () => {
    if (!selectedTaskId) {
      alert('Please select a task to start a study session.');
      return;
    }

    setStarting(true);
    try {
      const res = await sessionAPI.startSession({ taskId: selectedTaskId });
      const sessionData = res.data?.session || res.data || res;
      setActiveSession(sessionData);
    } catch (err) {
      alert('Failed to start session: ' + err.message);
    } finally {
      setStarting(false);
    }
  };

  const handleEndSession = async (stats = {}) => {
    if (!activeSession || !activeSession._id) return;

    try {
      await sessionAPI.endSession({
        sessionId: activeSession._id,
        focusScore: stats.focusScore || 9,
        completed: true,
      });
      setActiveSession(null);
      fetchData();
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeHistory = Array.isArray(history) ? history : [];
  const selectedTask = safeTasks.find((t) => t && t._id === selectedTaskId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">Study Sessions & Pomodoro</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Track deep work intervals with custom Pomodoro timers and log completed study durations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Session & Task Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <BookOpen size={18} className="text-purple-400" />
              Target Task
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Select Task to Study
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-purple-500"
              >
                {safeTasks.length === 0 ? (
                  <option value="">No tasks available</option>
                ) : (
                  safeTasks.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.title} ({t.subject || 'General'}) - {t.estimatedTime}m
                    </option>
                  ))
                )}
              </select>
            </div>

            {selectedTask && (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subject:</span>
                  <span className="font-semibold text-slate-200">{selectedTask.subject || 'General'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Est. Time:</span>
                  <span className="font-semibold text-purple-300">{selectedTask.estimatedTime} mins</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Priority:</span>
                  <span className="font-semibold text-amber-400">{selectedTask.priority}</span>
                </div>
              </div>
            )}

            {!activeSession ? (
              <button
                onClick={handleStartSession}
                disabled={starting || !selectedTaskId}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:opacity-95 text-white font-bold text-xs shadow-glow-purple transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play size={16} />
                {starting ? 'Starting Session...' : 'Start Session'}
              </button>
            ) : (
              <button
                onClick={() => handleEndSession()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:opacity-95 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Square size={16} />
                End Current Session
              </button>
            )}
          </div>
        </div>

        {/* Pomodoro Timer */}
        <div className="lg:col-span-2">
          <PomodoroTimer onSessionComplete={(stats) => handleEndSession(stats)} />
        </div>
      </div>

      {/* Session History */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-display font-bold text-xl text-slate-100 flex items-center gap-2">
          <History size={20} className="text-purple-400" />
          Study Session History
        </h3>

        {loading ? (
          <LoadingSpinner message="Fetching session history..." />
        ) : safeHistory.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No study sessions logged yet.</p>
        ) : (
          <div className="space-y-3">
            {safeHistory.map((s) => {
              if (!s) return null;
              return (
                <div key={s._id || Math.random()} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                      <Timer size={16} />
                    </div>
                    <div>
                      <h5 className="font-display font-semibold text-slate-200">{s.task?.title || 'Study Session'}</h5>
                      <span className="text-[10px] text-slate-500">{formatDateTime(s.startTime)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-slate-300 font-semibold">{s.duration || 25} mins</span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[10px]">
                      Focus: {s.focusScore || 9}/10
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
