/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        warm: {
          base: '#FFFBF5',
          parchment: '#FFF8ED',
          deep: '#FFF3E0',
          surface: '#FFFFFF',
        },
        indigo: {
          primary: '#4F46E5',
          deep: '#3730A3',
          light: '#6366F1',
          bg: '#EEF2FF',
          bdr: '#C7D2FE',
        },
      },
      fontFamily: {
        sans: ['Google Sans', 'Product Sans', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
