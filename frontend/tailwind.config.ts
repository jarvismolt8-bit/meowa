import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          green: '#A8E6CF',
          yellow: '#FFF3B0',
          blue: '#A0C4FF',
          violet: '#CDB4DB',
          red: '#FFADAD',
        },
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
