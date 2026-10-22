import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.ts'],
  theme: {
    extend: {
      colors: {
        gold: '#A39B8A',
        'gold-dark': '#8E8676',
        ink: '#4A4B4F',
        body: '#5E5E5E',
        muted: '#8E8E8E',
        paper: '#ECECEC',
        line: '#9C9C9C',
        navy: '#021559',
        sand: '#E8D9B5',
      },
      fontFamily: {
        sans: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
        accent: ['var(--font-instrument)', 'Georgia', 'serif'],
        display: ['var(--font-syncopate)', 'var(--font-satoshi)', 'sans-serif'],
        form: ['var(--font-inter-tight)', 'system-ui', 'sans-serif'],
        helvetica: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        content: '1008px',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        marquee: 'marquee 45s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
