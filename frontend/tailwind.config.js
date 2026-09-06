/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep navy — professional, trustworthy, insurance/legal
        primary: {
          50:  '#eef3fa',
          100: '#d5e4f3',
          200: '#adc8e6',
          300: '#7aa6d4',
          400: '#4d83bc',
          500: '#2563a3',
          600: '#1a4d87',
          700: '#143d6e',
          800: '#0f2d54',
          900: '#0a1f3d',
          950: '#060f1f',
        },
        // Warm amber / gold — authority, highlights
        secondary: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Warm slate for surfaces
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in':     'fadeIn 0.4s ease-out',
        'fade-in-up':  'fadeInUp 0.5s ease-out',
        'slide-up':    'slideUp 0.3s ease-out',
        'pulse-gentle':'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
