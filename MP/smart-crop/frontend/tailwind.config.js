/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50: '#fdf8f0',
          100: '#f9edda',
          200: '#f3d9b5',
          300: '#eabe88',
          400: '#df9c55',
          500: '#d67d31',
          600: '#c26426',
          700: '#a14b22',
          800: '#833c22',
          900: '#6b321f',
          950: '#3a180d',
        },
        beige: {
          50: '#fefdf8',
          100: '#fdf9ec',
          200: '#faf1d1',
          300: '#f5e5a8',
          400: '#eed376',
          500: '#e6be4a',
          600: '#d4a330',
          700: '#b08028',
          800: '#8d6326',
          900: '#745124',
          950: '#402b10',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
}
