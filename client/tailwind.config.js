/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#09090B',
          panel: '#121214',
          card: '#171719',
          border: '#29292C',
          borderSubtle: '#202023',
          hover: '#202023',
        },
        violet: {
          accent: '#8B5CF6',
          glow: 'rgba(139, 92, 246, 0.35)',
          muted: '#6D28D9',
        },
        cyan: {
          accent: '#22D3EE',
          glow: 'rgba(34, 211, 238, 0.35)',
          muted: '#0891B2',
        },
        emerald: {
          quest: '#10B981',
          glow: 'rgba(16, 185, 129, 0.35)',
        },
        amber: {
          quest: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.35)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-violet': '0 0 25px -4px rgba(235, 235, 235, 0.08)',
        'glow-cyan': '0 0 25px -4px rgba(235, 235, 235, 0.07)',
        'glow-emerald': '0 0 25px -4px rgba(52, 211, 153, 0.16)',
        'glow-node': '0 0 20px 2px rgba(235, 235, 235, 0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
