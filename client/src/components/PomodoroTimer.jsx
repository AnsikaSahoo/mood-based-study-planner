import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame, CheckCircle, Coffee, BookOpen } from 'lucide-react';
import { formatTimerSeconds } from '../utils/formatTime';

const PRESETS = [
  { label: '25 / 5 Standard', study: 25, breakTime: 5 },
  { label: '50 / 10 Deep Work', study: 50, breakTime: 10 },
  { label: '90 / 15 Ultra Focus', study: 90, breakTime: 15 },
];

export default function PomodoroTimer({ onSessionComplete }) {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [isBreakMode, setIsBreakMode] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(PRESETS[0].study * 60);
  const [isActive, setIsActive] = useState(false);
  const [focusScore, setFocusScore] = useState(9);

  // Sync preset changes
  useEffect(() => {
    setIsActive(false);
    setIsBreakMode(false);
    setSecondsLeft(selectedPreset.study * 60);
  }, [selectedPreset]);

  // Countdown timer loop
  useEffect(() => {
    let interval = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      clearInterval(interval);
      setIsActive(false);

      if (!isBreakMode) {
        // Study session ended
        if (onSessionComplete) {
          onSessionComplete({
            duration: selectedPreset.study,
            focusScore,
          });
        }
        // Switch to break
        setIsBreakMode(true);
        setSecondsLeft(selectedPreset.breakTime * 60);
      } else {
        // Break ended
        setIsBreakMode(false);
        setSecondsLeft(selectedPreset.study * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, secondsLeft, isBreakMode, selectedPreset, focusScore, onSessionComplete]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setIsBreakMode(false);
    setSecondsLeft(selectedPreset.study * 60);
  };

  const totalDuration = (isBreakMode ? selectedPreset.breakTime : selectedPreset.study) * 60;
  const progressPercent = Math.round(((totalDuration - secondsLeft) / totalDuration) * 100);

  return (
    <div class="glass-card p-6 sm:p-8 rounded-3xl border border-purple-500/30 text-center relative overflow-hidden">
      {/* Top Presets */}
      <div class="flex flex-wrap items-center justify-center gap-2 mb-8">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => setSelectedPreset(preset)}
            class={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              selectedPreset.label === preset.label
                ? 'bg-purple-600/30 border-purple-500 text-white shadow-glow-purple'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Mode Badge */}
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-6 bg-slate-900 border border-slate-800">
        {isBreakMode ? (
          <>
            <Coffee size={14} class="text-amber-400 animate-bounce" />
            <span class="text-amber-300">Rest & Refresh Break</span>
          </>
        ) : (
          <>
            <BookOpen size={14} class="text-purple-400 animate-pulse" />
            <span class="text-purple-300">Focus Study Mode</span>
          </>
        )}
      </div>

      {/* Large Countdown Display */}
      <div class="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex flex-col items-center justify-center mb-8">
        {/* SVG Progress Circle */}
        <svg class="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="42%"
            class="stroke-slate-800"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="50%"
            cy="50%"
            r="42%"
            class={isBreakMode ? 'stroke-amber-500' : 'stroke-purple-500'}
            strokeWidth="10"
            strokeDasharray="600"
            strokeDashoffset={600 - (600 * progressPercent) / 100}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>

        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="font-display font-bold text-5xl sm:text-6xl text-slate-100 tracking-tight">
            {formatTimerSeconds(secondsLeft)}
          </span>
          <span class="text-xs text-slate-400 mt-2 font-medium">
            {progressPercent}% Complete
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div class="flex items-center justify-center gap-4">
        <button
          onClick={toggleTimer}
          class={`px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 ${
            isActive
              ? 'bg-amber-600 hover:bg-amber-500'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-glow-purple'
          }`}
        >
          {isActive ? (
            <>
              <Pause size={18} /> Pause
            </>
          ) : (
            <>
              <Play size={18} /> Start Session
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          class="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
}
