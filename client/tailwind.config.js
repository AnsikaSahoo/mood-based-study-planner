/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#070a12',
          800: '#090d16',
          700: '#0f172a',
          600: '#1e293b',
          500: '#334155',
        },
        brand: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          blue: '#3b82f6',
          teal: '#14b8a6',
          indigo: '#6366f1',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.35)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.35)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.35)',
      }
    },
  },
  plugins: [],
}
