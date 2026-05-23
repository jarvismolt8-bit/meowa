import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFD93D',
          'yellow-soft': '#FFF4B8',
          green: '#6DD3A8',
          'green-soft': '#D4F5E3',
          violet: '#9B7EDC',
          'violet-soft': '#E4DBFF',
          cream: '#FFFBF0',
          ink: '#2A2438',
        },
        pastel: {
          green: '#6DD3A8',
          yellow: '#FFD93D',
          blue: '#9B7EDC',
          mint: '#6DD3A8',
          red: '#FFADAD',
        },
      },
      backgroundImage: {
        'gradient-meowa': 'linear-gradient(135deg, #FFD93D, #6DD3A8, #9B7EDC)',
        'gradient-sunny': 'linear-gradient(135deg, #FFD93D, #6DD3A8)',
        'gradient-cozy': 'linear-gradient(135deg, #E4DBFF, #D4F5E3)',
      },
      fontFamily: {
        sans: ['"Fredoka"', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
}

export default config
