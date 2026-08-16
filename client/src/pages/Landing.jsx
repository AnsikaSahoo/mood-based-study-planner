import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  Calendar,
  BarChart3,
  Flame,
  ArrowRight,
  Smile,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function Landing() {
  return (
    <div class="min-h-screen bg-[#070a12] text-slate-100 selection:bg-purple-500 selection:text-white flex flex-col">
      {/* Header / Nav */}
      <header class="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 shadow-glow-purple">
            <div class="w-full h-full bg-[#070a12] rounded-[10px] flex items-center justify-center text-xl">
              🧠
            </div>
          </div>
          <span class="font-display font-bold text-xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            MoodPlanner
          </span>
        </div>

        <div class="flex items-center gap-4">
          <Link
            to="/login"
            class="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-glow-purple transition-all transform hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main class="flex-1 max-w-7xl w-full mx-auto px-6 pt-12 pb-24 flex flex-col items-center text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-8 animate-pulse">
          <Sparkles size={14} class="text-pink-400" />
          Revolutionizing Student Productivity
        </div>

        <h1 class="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight max-w-4xl leading-tight">
          Study smarter by planning according to{' '}
          <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            how you feel.
          </span>
        </h1>

        <p class="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Stop forcing fixed schedules when you're exhausted. Our AI-driven planner dynamically adjusts your daily study workload based on your stress, energy levels, and mood.
        </p>

        <div class="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            to="/register"
            class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:opacity-95 text-white font-bold text-base shadow-glow-purple transition-all flex items-center justify-center gap-2 group"
          >
            Start Planning Free
            <ArrowRight size={18} class="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-base transition-all flex items-center justify-center"
          >
            Member Login
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
          <div class="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 transition-all hover:-translate-y-1">
            <div class="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-6">
              <Smile size={24} />
            </div>
            <h3 class="font-display text-xl font-bold text-slate-100 mb-2">Mood-Based Planning</h3>
            <p class="text-slate-400 text-sm leading-relaxed">
              Log your energy, stress, and sleep metrics. The planner adjusts task difficulty and duration to prevent burnout.
            </p>
          </div>

          <div class="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-pink-500/30 transition-all hover:-translate-y-1">
            <div class="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center mb-6">
              <CheckCircle2 size={24} />
            </div>
            <h3 class="font-display text-xl font-bold text-slate-100 mb-2">Smart Prioritization</h3>
            <p class="text-slate-400 text-sm leading-relaxed">
              Organize tasks by difficulty, subject, and deadlines. Never miss an exam or assignment again.
            </p>
          </div>

          <div class="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 transition-all hover:-translate-y-1">
            <div class="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-6">
              <BarChart3 size={24} />
            </div>
            <h3 class="font-display text-xl font-bold text-slate-100 mb-2">Productivity Analytics</h3>
            <p class="text-slate-400 text-sm leading-relaxed">
              Track weekly study hours, mood trends, subject breakdowns, and focus scores with detailed visual charts.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer class="border-t border-slate-900 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 Mood-Based Study Planner. All rights reserved.</p>
      </footer>
    </div>
  );
}
