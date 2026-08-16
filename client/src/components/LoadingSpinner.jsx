import React from 'react';

export default function LoadingSpinner({ fullScreen = false, message = 'Loading...' }) {
  const content = (
    <div class="flex flex-col items-center justify-center p-6 gap-4">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
        <div class="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-pink-500 border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      {message && <p class="text-slate-400 text-sm font-medium animate-pulse">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div class="fixed inset-0 bg-[#070a12]/80 backdrop-blur-md z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
