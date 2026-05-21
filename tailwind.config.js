/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cad: {
          bg:       '#0a0e14',
          panel:    '#0f1520',
          border:   '#1e2d40',
          grid:     '#111c2a',
          blue:     '#00b4d8',
          blueDim:  '#0077a8',
          orange:   '#f97316',
          orangeDim:'#c2410c',
          yellow:   '#fbbf24',
          green:    '#22d3ee',
          text:     '#cdd6f4',
          muted:    '#6b7a99',
          danger:   '#f43f5e',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-blue':   '0 0 12px 2px rgba(0,180,216,0.35)',
        'glow-orange': '0 0 12px 2px rgba(249,115,22,0.45)',
        'glow-yellow': '0 0 8px 1px rgba(251,191,36,0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};