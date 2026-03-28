/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          base: '#060B14',
          surface: '#0A1220',
          card: 'rgba(255,255,255,0.045)',
        },
        glow: {
          primary: '#38bdf8',
          secondary: '#0ea5e9',
          dim: 'rgba(56,189,248,0.15)',
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
