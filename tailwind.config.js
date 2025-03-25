export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // General scan across src folder
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dashboard-bg': '#F0F6FA',
        bg: '#EFF2F6',
        'fade-bg': '#F8F9FC',
        white: '#ffffff',
        'fade-white': '#D9D9D9',
        yellow: '#F6B827',
        orange: '#F87D08',
        red: '#FF4D4D',
        'fade-orange': '#F87D081A',
        parrot: '#22C55E',
        'dark-green': '#617B47',
        'fade-green': '#22C55E1A',
        'lime-green': '#59D20D',
        border: '#D3DAE3',
        black: '#000',
        'fade-black': '#353537',
        'fadish-black': '#5C5E64',
        silver: {
          100: '#A1AEBE',
          500: '#667085',
          600: '#969696',
          950: '#333333',
        },
        grey: {
          100: '#E7E7E7',
          200: '#d1d1d1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#6D6D6D',
          600: '#5D5D5D',
          800: '#454545',
          extra: '#E7E7E799',
          'cadet-blue': '#DDE2E8',
        },
        lynch: {
          50: '#F6F7F9',
          300: '#B1BBC8',
          400: '#8695AA',
          900: '#343A46',
        },
        'primary-blue': '#2275FC',
      },
    },
  },
  plugins: [],
};
