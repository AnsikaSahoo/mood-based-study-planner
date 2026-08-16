import React, { useState, useEffect } from 'react';
import { moodAPI } from '../services/moodAPI';
import MoodSelector from '../components/MoodSelector';
import MoodCard from '../components/MoodCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Smile, Calendar, Activity, Zap, Moon } from 'lucide-react';
import { formatDateTime } from '../utils/formatDate';

export default function MoodHistory() {
  const [todayMood, setTodayMood] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMoods = async () => {
    setLoading(true);
    try {
      const [todayRes, historyRes] = await Promise.allSettled([
        moodAPI.getTodayMood(),
        moodAPI.getMoodHistory(),
      ]);

      if (todayRes.status === 'fulfilled') {
        const val = todayRes.value?.data !== undefined ? todayRes.value.data : todayRes.value;
        const moodObj = val?.mood !== undefined ? val.mood : val;
        setTodayMood(moodObj);
      }

      if (historyRes.status === 'fulfilled') {
        const val = historyRes.value?.data !== undefined ? historyRes.value.data : historyRes.value;
        const moodList = Array.isArray(val?.moods)
          ? val.moods
          : Array.isArray(val)
          ? val
          : [];
        setHistory(moodList);
      }
    } catch (err) {
      console.error('Failed to load mood data:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const safeHistory = Array.isArray(history) ? history : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">Mood Check-in & History</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor your mood variations, stress levels, and energy trends to optimize your daily focus.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching mood check-ins..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mood Selector Column */}
          <div className="lg:col-span-2 space-y-6">
            <MoodSelector onMoodLogged={fetchMoods} />
          </div>

          {/* Today's Mood Display */}
          <div className="lg:col-span-1">
            <MoodCard mood={todayMood} />
          </div>
        </div>
      )}

      {/* Mood History List */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-display font-bold text-xl text-slate-100 mb-2">Past Mood Logs</h3>

        {safeHistory.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No previous mood records found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeHistory.map((m) => {
              if (!m) return null;
              return (
                <div key={m._id || Math.random()} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base text-purple-300">{m.mood || 'Focused'}</span>
                    <span className="text-[10px] text-slate-500">{formatDateTime(m.createdAt)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
                    <div className="p-2 rounded-xl bg-slate-800/60">
                      <Zap size={12} className="mx-auto text-amber-400 mb-1" />
                      <span>{m.energyLevel ?? 5}/10</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/60">
                      <Activity size={12} className="mx-auto text-rose-400 mb-1" />
                      <span>{m.stressLevel ?? 5}/10</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/60">
                      <Moon size={12} className="mx-auto text-indigo-400 mb-1" />
                      <span>{m.sleepHours ?? 8}h</span>
                    </div>
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
