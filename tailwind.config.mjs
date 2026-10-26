/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        halloween: {
          bg: '#0a0512',
          card: '#160b26',
          cardHover: '#23123d',
          cardBorder: '#3b1d66',
          orange: '#ff6200',
          orangeGlow: '#ff7700',
          purple: '#9333ea',
          purpleDark: '#4c1d95',
          slime: '#10b981',
          lime: '#84cc16',
          blood: '#dc2626',
          ghost: '#e2e8f0',
          yellow: '#facc15'
        }
      },
      boxShadow: {
        'spooky-orange': '0 0 25px -5px rgba(255, 98, 0, 0.4), 0 0 10px -2px rgba(255, 98, 0, 0.2)',
        'spooky-purple': '0 0 25px -5px rgba(147, 51, 234, 0.4), 0 0 10px -2px rgba(147, 51, 234, 0.2)',
        'spooky-slime': '0 0 20px -4px rgba(16, 185, 129, 0.4)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
};
