import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        golden: {
          DEFAULT: '#febf00',
          light: '#fcd34d',
          lighter: '#fef3c7'
        },
        cream: {
          DEFAULT: '#efe3d4',
          light: '#f5f0e8',
          lighter: '#faf8f5'
        },
        blue: {
          DEFAULT: '#4a71f6',
          dark: '#3b5fd4',
          light: '#6b8eff'
        },
        dark: {
          DEFAULT: '#000001',
          80: '#1a1a1a',
          60: '#4d4d4d',
          40: '#808080'
        }
      },
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      }
    }
  },
  plugins: [typography]
};
