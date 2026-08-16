import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { moodAPI } from '../services/moodAPI';
import { plannerAPI } from '../services/plannerAPI';
import { taskAPI } from '../services/taskAPI';
import { analyticsAPI } from '../services/analyticsAPI';

import MoodCard from '../components/MoodCard';
import ProgressCard from '../components/ProgressCard';
import StudyPlan from '../components/StudyPlan';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';

import { Sparkles, Smile, CheckSquare, Calendar, Timer, Plus, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [todayMood, setTodayMood] = useState(null);
  const [todayPlan, setTodayPlan] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [moodTrend, setMoodTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [moodRes, planRes, tasksRes, analyticsRes, weeklyRes, moodTrendRes] = await Promise.allSettled([
          moodAPI.getTodayMood(),
          plannerAPI.getTodayPlan(),
          taskAPI.getTasks(),
          analyticsAPI.getDashboard(),
          analyticsAPI.getWeekly(),
          analyticsAPI.getMood(),
        ]);

        if (moodRes.status === 'fulfilled') {
          const resVal = moodRes.value?.data !== undefined ? moodRes.value.data : moodRes.value;
          setTodayMood(resVal);
        }
        if (planRes.status === 'fulfilled') {
          const resVal = planRes.value?.data !== undefined ? planRes.value.data : planRes.value;
          setTodayPlan(resVal);
        }
        if (tasksRes.status === 'fulfilled') {
          const resVal = tasksRes.value?.data !== undefined ? tasksRes.value.data : tasksRes.value;
          setTasks(Array.isArray(resVal) ? resVal : []);
        }
        if (analyticsRes.status === 'fulfilled') {
          const resVal = analyticsRes.value?.data !== undefined ? analyticsRes.value.data : analyticsRes.value;
          setAnalytics(resVal);
        }
        if (weeklyRes.status === 'fulfilled') {
          const resVal = weeklyRes.value?.data !== undefined ? weeklyRes.value.data : weeklyRes.value;
          setWeeklyData(Array.isArray(resVal) ? resVal : []);
        }
        if (moodTrendRes.status === 'fulfilled') {
          const resVal = moodTrendRes.value?.data !== undefined ? moodTrendRes.value.data : moodTrendRes.value;
          setMoodTrend(Array.isArray(resVal) ? resVal : []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Fetching dashboard analytics..." />;
  }

  const upcomingTasks = Array.isArray(tasks) ? tasks.filter((t) => t && !t.completed).slice(0, 3) : [];

  return (
    <div class="space-y-8">
      {/* Welcome Banner */}
      <div class="glass-card p-6 sm:p-8 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 via-slate-900/90 to-blue-900/20 relative overflow-hidden">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full inline-block mb-2">
              Student Dashboard
            </span>
            <h1 class="font-display font-bold text-2xl sm:text-4xl text-slate-100">
              Good morning, {user?.name || 'Student'} 👋
            </h1>
            <p class="text-slate-400 text-sm mt-1 max-w-xl">
              How are you feeling today? Check in your mood state to generate a customized study schedule.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <Link
              to="/mood"
              class="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-glow-purple transition-all flex items-center gap-2 shrink-0"
            >
              <Smile size={16} />
              Log Today's Mood
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Cards Row */}
      <ProgressCard analytics={analytics} />

      {/* Grid Section: Today's Mood + Today's Study Plan */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1 space-y-6">
          <MoodCard mood={todayMood} />

          {/* Quick Actions Panel */}
          <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <h3 class="font-display font-bold text-base text-slate-200 mb-4">Quick Actions</h3>
            <Link
              to="/mood"
              class="w-full p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-between"
            >
              <span class="flex items-center gap-2">😊 Log Mood</span>
              <ArrowRight size={14} class="text-slate-500" />
            </Link>

            <Link
              to="/tasks"
              class="w-full p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-between"
            >
              <span class="flex items-center gap-2">📝 Add New Task</span>
              <Plus size={14} class="text-slate-500" />
            </Link>

            <Link
              to="/planner"
              class="w-full p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-between"
            >
              <span class="flex items-center gap-2">📅 Generate Study Plan</span>
              <Sparkles size={14} class="text-purple-400" />
            </Link>

            <Link
              to="/sessions"
              class="w-full p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-between"
            >
              <span class="flex items-center gap-2">⏱️ Start Study Session</span>
              <Timer size={14} class="text-slate-500" />
            </Link>
          </div>
        </div>

        <div class="lg:col-span-2">
          <StudyPlan plan={todayPlan} loading={false} />
        </div>
      </div>

      {/* Grid Section: Weekly Charts & Upcoming Tasks */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Study Chart */}
        <div class="glass-card p-6 rounded-3xl border border-slate-800">
          <h3 class="font-display font-bold text-lg text-slate-100 mb-4">Weekly Study Hours</h3>
          {weeklyData && weeklyData.length > 0 ? (
            <div class="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="hours" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div class="h-48 flex items-center justify-center text-slate-500 text-xs">
              No weekly study data available yet.
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-display font-bold text-lg text-slate-100">Upcoming Tasks</h3>
            <Link to="/tasks" class="text-xs text-purple-400 font-semibold hover:underline">
              View All Tasks →
            </Link>
          </div>

          {upcomingTasks.length > 0 ? (
            <div class="space-y-3">
              {upcomingTasks.map((t) => (
                <TaskCard key={t._id} task={t} />
              ))}
            </div>
          ) : (
            <p class="text-xs text-slate-500 text-center py-8">No pending tasks. Create one to get started!</p>
          )}
        </div>
      </div>
    </div>
  );
}
