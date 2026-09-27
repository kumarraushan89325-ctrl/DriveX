/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0b1b33',
          800: '#102544',
          700: '#16345c',
          600: '#1d4678',
        },
        accent: {
          400: '#3b82f6',
          500: '#2563eb',
          600: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(11, 27, 51, 0.18)',
      },
    },
  },
  plugins: [],
};
